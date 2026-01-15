"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addProduct } from "@/actions/manufacturer/product.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/widgets/FileUpload";
import NumericField from "@/components/widgets/NumericField";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import { useAdminCategories } from "@/hooks/admin/useAdminCategories";
import { useUnits } from "@/hooks/manufacturer/useUnits";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import {
  type AddProductForm,
  addProductSchema,
} from "@/schema/manufacturer/product";

const MAX_SECONDARY_IMAGES = 4;

const ManufacturerAddProductForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: units } = useUnits();

  const { data: categories } = useAdminCategories();

  const [isLoading, setIsLoading] = useState(false);
  const [secondaryImages, setSecondaryImages] = useState<
    (FileWithPreview | null)[]
  >([null]);
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<AddProductForm>({
    resolver: zodResolver(addProductSchema),
    mode: "onSubmit",
    defaultValues: {
      isActive: true,
      inStock: true,
      stock: undefined,
      minOrderQuantity: undefined,
      regularPrice: undefined,
      dealerPrice: undefined,
    },
  });

  const isActive = watch("isActive");
  const inStock = watch("inStock");
  const categoryId = watch("categoryId");
  const unitId = watch("unitId");
  const primaryImage = watch("primaryImage");

  const handleParentCategoryChange = (value: string) => {
    setSelectedParentId(value);
    setValue("categoryId", "", { shouldValidate: false });
  };

  const onSubmit = async (data: AddProductForm) => {
    try {
      setIsLoading(true);
      const response = await addProduct(data);

      if (response.success) {
        toast.success(response.message);
        router.push("/manufacturer/products");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parentCategoryOptions =
    categories
      ?.filter((cat) => cat.parent_id === null)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
      })) ?? [];

  const childCategoryOptions =
    categories
      ?.filter((cat) => cat.parent_id === selectedParentId)
      .map((cat) => ({
        id: cat.id,
        name: cat.name,
      })) ?? [];

  const unitOptions =
    units?.map((unit) => ({
      id: unit.id,
      name: unit.name,
    })) ?? [];

  const handleSecondaryImageChange = (
    index: number,
    file: FileWithPreview | null,
  ) => {
    const newImages = [...secondaryImages];
    newImages[index] = file;

    if (
      file &&
      index === newImages.length - 1 &&
      newImages.length < MAX_SECONDARY_IMAGES
    ) {
      newImages.push(null);
    }

    if (!file) {
      while (
        newImages.length > 1 &&
        !newImages[newImages.length - 1] &&
        !newImages[newImages.length - 2]
      ) {
        newImages.pop();
      }
    }

    setSecondaryImages(newImages);

    const validImages = newImages
      .filter((img): img is FileWithPreview => img !== null)
      .map((img) => img.file)
      .filter((file): file is File => file instanceof File);

    setValue("images", validImages);
  };

  const handlePrimaryImageChange = (file: FileWithPreview | null) => {
    if (file) {
      setValue("primaryImage", file.file as File, { shouldValidate: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4 md:gap-6"
    >
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
        <div className="flex flex-col gap-4 md:gap-6 flex-1 w-full">
          {/* Product Name */}
          <div className="flex w-full flex-col gap-2">
            <Label className="text-sm">
              Product Name <RequiredIndicator />
            </Label>
            <Input
              {...register("name")}
              placeholder="Silk Saree"
              disabled={isSubmitting}
            />
            {errors.name?.message && (
              <ValidationMessage message={errors.name.message} />
            )}
          </div>

          {/* Description */}
          <div className="flex w-full flex-col gap-2">
            <Label className="text-sm">
              Description <RequiredIndicator />
            </Label>
            <Textarea
              {...register("description")}
              placeholder="Enter product description..."
              disabled={isSubmitting}
              className="min-h-35"
            />
            {errors.description?.message && (
              <ValidationMessage message={errors.description.message} />
            )}
          </div>

          {/* Parent Category and Child Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Parent Category <RequiredIndicator />
              </Label>
              <Combobox
                options={parentCategoryOptions}
                value={selectedParentId || ""}
                onValueChange={handleParentCategoryChange}
                placeholder="Select parent category"
                emptyText="No parent categories found"
                disabled={isSubmitting}
                valueKey="id"
              />
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Child Category <RequiredIndicator />
              </Label>
              <Combobox
                options={childCategoryOptions}
                value={categoryId || ""}
                onValueChange={(value) =>
                  setValue("categoryId", value, {
                    shouldValidate: true,
                  })
                }
                placeholder={
                  selectedParentId
                    ? "Select child category"
                    : "Select parent first"
                }
                emptyText="No child categories found"
                disabled={isSubmitting || !selectedParentId}
                valueKey="id"
              />
              {errors.categoryId?.message && (
                <ValidationMessage message={errors.categoryId.message} />
              )}
            </div>
          </div>

          {/* Price and SKU */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Regular Price <RequiredIndicator />
              </Label>
              <NumericField
                {...register("regularPrice", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : v),
                })}
                allowDecimals
                min={0.01}
                placeholder="999.99"
                disabled={isSubmitting}
              />
              {errors.regularPrice?.message && (
                <ValidationMessage message={errors.regularPrice.message} />
              )}
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Dealer Price <RequiredIndicator />
              </Label>
              <NumericField
                {...register("dealerPrice", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : v),
                })}
                allowDecimals
                min={0.01}
                placeholder="999.99"
                disabled={isSubmitting}
              />
              {errors.dealerPrice?.message && (
                <ValidationMessage message={errors.dealerPrice.message} />
              )}
            </div>
          </div>

          {/* Stock and Min Order Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                SKU <RequiredIndicator />
              </Label>
              <Input
                {...register("sku")}
                placeholder="LED-9W-001"
                disabled={isSubmitting}
              />
              {errors.sku?.message && (
                <ValidationMessage message={errors.sku.message} />
              )}
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Stock <RequiredIndicator />
              </Label>
              <NumericField
                {...register("stock", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : v),
                })}
                min={0}
                placeholder="100"
                disabled={isSubmitting}
              />
              {errors.stock?.message && (
                <ValidationMessage message={errors.stock.message} />
              )}
            </div>
          </div>
          {/* Min Order Quantity and Unit */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Min. Order Quantity <RequiredIndicator />
              </Label>
              <NumericField
                {...register("minOrderQuantity", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? undefined : v),
                })}
                min={1}
                placeholder="1"
                disabled={isSubmitting}
              />
              {errors.minOrderQuantity?.message && (
                <ValidationMessage message={errors.minOrderQuantity.message} />
              )}
            </div>

            <div className="flex w-full flex-col gap-2">
              <Label className="text-sm">
                Unit <RequiredIndicator />
              </Label>
              <Combobox
                options={unitOptions}
                value={unitId || ""}
                onValueChange={(value) =>
                  setValue("unitId", value, { shouldValidate: true })
                }
                placeholder="Select unit"
                emptyText="No units found"
                disabled={isSubmitting}
                valueKey="id"
              />
              {errors.unitId?.message && (
                <ValidationMessage message={errors.unitId.message} />
              )}
            </div>
          </div>

          {/* Switches */}
          <div className="flex items-center gap-4">
            <div className="flex w-full items-center gap-2">
              <Label className="text-sm">
                In Stock? <RequiredIndicator />
              </Label>
              <Switch
                checked={inStock}
                onCheckedChange={(checked) =>
                  setValue("inStock", checked, { shouldValidate: true })
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="flex w-full items-center gap-2">
              <Label className="text-sm">
                Is Active? <RequiredIndicator />
              </Label>
              <Switch
                checked={isActive}
                onCheckedChange={(checked) =>
                  setValue("isActive", checked, { shouldValidate: true })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block w-px bg-border self-stretch" />

        {/* Image Upload Section */}
        <div className="flex-1 w-full flex items-start justify-start">
          <div className="flex flex-col gap-6 md:gap-8 w-full">
            {/* Primary Image */}
            <div className="space-y-2">
              <Label className="text-sm">
                Primary Image <RequiredIndicator />
              </Label>
              <FileUpload
                accept="image"
                variant="square"
                size="lg"
                disabled={isSubmitting}
                onFileChange={handlePrimaryImageChange}
                value={
                  primaryImage
                    ? {
                        file: primaryImage,
                        id: "primary",
                        preview: URL.createObjectURL(primaryImage),
                      }
                    : null
                }
              />
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 2MB
              </p>
              {errors.primaryImage?.message && (
                <div className="w-fit mx-auto">
                  <ValidationMessage message={errors.primaryImage.message} />
                </div>
              )}
            </div>

            {/* Secondary Images */}
            <div className="space-y-2">
              <Label className="text-sm">Secondary Images</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {secondaryImages.map((image, index) => (
                  <FileUpload
                    key={`${image?.id}_${index}`}
                    accept="image"
                    variant="square"
                    size="md"
                    value={image}
                    disabled={isSubmitting}
                    onFileChange={(file) =>
                      handleSecondaryImageChange(index, file)
                    }
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 2MB each (Max 4 images)
              </p>
              {errors.images?.message && (
                <div className="w-fit mx-auto">
                  <ValidationMessage message={errors.images.message} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-start md:justify-normal items-center gap-3 md:gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-auto">
              Cancel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Any unsaved product details will be lost if you cancel now.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push("/manufacturer/products")}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          className="flex items-center gap-2 w-auto"
          type="submit"
          disabled={isLoading || !isValid}
        >
          <span>Save</span>
          {isLoading && <Spinner className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  );
};

export default ManufacturerAddProductForm;
