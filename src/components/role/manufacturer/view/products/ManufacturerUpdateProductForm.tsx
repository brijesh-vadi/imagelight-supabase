"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getChildCategories } from "@/actions/manufacturer/category.action";
import { updateProduct } from "@/actions/manufacturer/product.action";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/widgets/FileUpload";
import NumericField from "@/components/widgets/NumericField";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import {
  type UpdateProductForm,
  updateProductSchema,
} from "@/schema/manufacturer/product";
import type { Category, Product, Unit } from "@/types";

interface Props {
  product: Product;
  parentCategories: Category[];
  allCategories: Category[];
  units: Unit[];
}

type ExistingImageSlot = {
  id: string;
  preview: string;
  isExisting: true;
  originalIndex: number;
};

type ImageSlot = ExistingImageSlot | FileWithPreview | null;

const MAX_SECONDARY_IMAGES = 3;

const isExistingImage = (img: ImageSlot): img is ExistingImageSlot =>
  Boolean(img && "isExisting" in img && img.isExisting);

const ManufacturerUpdateProductForm = ({
  product,
  parentCategories,
  allCategories,
  units,
}: Props) => {
  const router = useRouter();

  // Find the parent category of the product's current category
  const currentCategory = allCategories.find((c) => c.id === product.category_id);
  const initialParentId = currentCategory?.parent_id || "";

  const [selectedParentId, setSelectedParentId] = useState<string>(initialParentId);
  const [childCategories, setChildCategories] = useState<Category[]>([]);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);

  const [removedExistingImages, setRemovedExistingImages] = useState<
    Set<number>
  >(new Set());

  const [secondaryImages, setSecondaryImages] = useState<ImageSlot[]>(() => {
    const existing = (product.images ?? []).map((url, index) => ({
      id: `existing-${index}`,
      preview: url,
      isExisting: true as const,
      originalIndex: index,
    }));

    if (existing.length < MAX_SECONDARY_IMAGES) {
      return [...existing, null];
    }
    return existing;
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm<UpdateProductForm>({
    resolver: zodResolver(updateProductSchema),
    mode: "onSubmit",
    defaultValues: {
      name: product.name,
      description: product.description,
      categoryId: product.category_id,
      unitId: product.unit_id,
      regularPrice: product.regular_price,
      dealerPrice: product.dealer_price,
      sku: product.sku,
      stock: product.stock,
      minOrderQuantity: product.min_order_quantity,
      isActive: product.is_active,
      inStock: product.in_stock,
      primaryImage: undefined,
      images: [],
    },
  });

  const isActive = watch("isActive");
  const inStock = watch("inStock");
  const categoryId = watch("categoryId");
  const unitId = watch("unitId");
  const primaryImage = watch("primaryImage");

  // Load child categories when parent is selected or on mount
  useEffect(() => {
    const loadChildCategories = async () => {
      if (!selectedParentId) {
        setChildCategories([]);
        return;
      }

      setIsLoadingChildren(true);
      const response = await getChildCategories(selectedParentId);
      if (response.success && response.data) {
        setChildCategories(response.data.categories);
      } else {
        toast.error("Failed to load child categories");
        setChildCategories([]);
      }
      setIsLoadingChildren(false);
    };

    loadChildCategories();
  }, [selectedParentId]);

  const handleParentCategoryChange = (value: string) => {
    setSelectedParentId(value);
    // Reset child category selection when parent changes
    setValue("categoryId", "", { shouldValidate: false });
  };

  const parentCategoryOptions = parentCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  const childCategoryOptions = childCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
  }));

  const unitOptions = units.map((unit) => ({
    id: unit.id,
    name: unit.name,
  }));

  const handleSecondaryImageChange = (
    index: number,
    file: FileWithPreview | null,
  ) => {
    const next = [...secondaryImages];
    const current = next[index];

    if (!file && isExistingImage(current)) {
      setRemovedExistingImages((prev) =>
        new Set(prev).add(current.originalIndex),
      );
    }

    next[index] = file;

    if (
      file &&
      index === next.length - 1 &&
      next.length < MAX_SECONDARY_IMAGES
    ) {
      next.push(null);
    }

    while (
      next.length > 1 &&
      !next[next.length - 1] &&
      !next[next.length - 2]
    ) {
      next.pop();
    }

    setSecondaryImages(next);

    const newFiles = next
      .filter(
        (img): img is FileWithPreview => img !== null && !isExistingImage(img),
      )
      .map((img) => img.file)
      .filter((f): f is File => f instanceof File);

    setValue("images", newFiles);
    setValue("removedImages", Array.from(removedExistingImages));
  };

  const [primaryImageRemoved, setPrimaryImageRemoved] = useState(false);

  const handlePrimaryImageChange = (file: FileWithPreview | null) => {
    if (file && file.file instanceof File) {
      // Only set if it's a real File (new upload)
      setValue("primaryImage", file.file);
      setPrimaryImageRemoved(false);
    } else if (!file) {
      // If removing the image
      setValue("primaryImage", undefined);
      setPrimaryImageRemoved(true);
    }
    // If file exists but file.file is not a File instance, it's an existing image - do nothing
  };

  const onSubmit = async (data: UpdateProductForm) => {
    try {
      const result = await updateProduct(product.id, data);

      if (result.success) {
        toast.success(result.message || "Product updated successfully");
        router.push("/manufacturer/products");
      } else {
        toast.error(result.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update product error:", error);
      toast.error("An unexpected error occurred");
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
    >
      <div className="flex items-start gap-10 min-h-0">
        <div className="flex flex-col gap-6 flex-1">
          {/* Product Name */}
          <div className="flex w-full flex-col gap-2">
            <Label>
              Product Name <RequiredIndicator />
            </Label>
            <Input
              {...register("name")}
              placeholder="LED Bulb 9W"
              disabled={isSubmitting}
            />
            {errors.name?.message && (
              <ValidationMessage message={errors.name.message} />
            )}
          </div>

          {/* Description */}
          <div className="flex w-full flex-col gap-2">
            <Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label>
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
              <Label>
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
                  isLoadingChildren
                    ? "Loading..."
                    : selectedParentId
                      ? "Select child category"
                      : "Select parent first"
                }
                emptyText="No child categories found"
                disabled={isSubmitting || !selectedParentId || isLoadingChildren}
                valueKey="id"
              />
              {errors.categoryId?.message && (
                <ValidationMessage message={errors.categoryId.message} />
              )}
            </div>
          </div>

          {/* Regular Price and Dealer Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label>
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
              <Label>
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

          {/* SKU and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label>
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
              <Label>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="flex w-full flex-col gap-2">
              <Label>
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
              <Label>
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
              <Label>
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
              <Label>
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

        <div className="w-px bg-border self-stretch" />

        {/* Image Upload Section */}
        <div className="flex-1 flex items-start justify-start">
          <div className="flex flex-col gap-8 w-full">
            {/* Primary Image */}
            <div className="space-y-2">
              <Label>
                Primary Image <RequiredIndicator />
              </Label>
              <FileUpload
                accept="image"
                variant="square"
                size="lg"
                disabled={isSubmitting}
                onFileChange={handlePrimaryImageChange}
                value={
                  primaryImage && primaryImage instanceof File
                    ? {
                        file: primaryImage,
                        id: "primary",
                        preview: URL.createObjectURL(primaryImage),
                      }
                    : product.primary_image && !primaryImageRemoved
                      ? {
                          file: null as any,
                          id: "existing-primary",
                          preview: product.primary_image,
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
              <Label>Secondary Images</Label>
              <div className="grid grid-cols-4 gap-4">
                {secondaryImages.map((img, index) => (
                  <FileUpload
                    key={`${img?.id}_${index}`}
                    variant="square"
                    size="md"
                    value={
                      isExistingImage(img)
                        ? {
                            file: null as any,
                            id: img.id,
                            preview: img.preview,
                          }
                        : img
                    }
                    onFileChange={(file) =>
                      handleSecondaryImageChange(index, file)
                    }
                  />
                ))}
              </div>
              <p className="text-xs  text-muted-foreground">
                PNG, JPG up to 2MB each (Max {MAX_SECONDARY_IMAGES - 1} images)
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
      <div className="flex items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Cancel</Button>
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
          className="flex items-center gap-2"
          type="submit"
          disabled={isSubmitting}
        >
          <span>{isSubmitting ? "Saving..." : "Save"}</span>
        </Button>
      </div>
    </form>
  );
};

export default ManufacturerUpdateProductForm;
