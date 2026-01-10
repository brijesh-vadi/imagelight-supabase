"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addCategory } from "@/actions/admin/category.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import { type CategoryForm, categorySchema } from "@/schema/admin/category";
import type { Category } from "@/types";

interface Props {
  parentCategories: Category[];
}

const AdminAddCategoryModal = ({ parentCategories }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      parent_id: null,
      description: null,
    },
  });

  const onSubmit = async (data: CategoryForm) => {
    const payload = {
      ...data,
      description: data.description ?? undefined,
      parent_id: data.parent_id ?? null,
    };

    const response = await addCategory(payload);
    if (response?.success) {
      reset();
      setSelectedParentId(null);
      setIsDialogOpen(false);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleParentChange = (value: string) => {
    const selectedParent = parentCategories.find((cat) => cat.id === value);
    setValue("parent_id", value);
    setSelectedParentId(value);

    if (selectedParent) {
      setValue("category_type", selectedParent.category_type);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            Add Category
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          {/* Category Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Category Name <RequiredIndicator />
            </Label>
            <Input
              {...register("name")}
              placeholder="e.g., Silk Sarees, Wedding Sarees"
            />
            {errors.name?.message && (
              <ValidationMessage message={errors.name.message} />
            )}
          </div>

          {/* Parent Category */}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Parent Category <RequiredIndicator />
            </Label>
            <Select
              onValueChange={handleParentChange}
              value={selectedParentId || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                {parentCategories.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No parent categories available. Please seed them first.
                  </SelectItem>
                ) : (
                  parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select which parent category this belongs to
            </p>
            {errors.parent_id?.message && (
              <ValidationMessage message={errors.parent_id.message} />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="flex items-center gap-2"
              type="submit"
              disabled={isSubmitting || !selectedParentId}
            >
              <span>Save Category</span>
              {isSubmitting && <Spinner className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminAddCategoryModal;
