"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCategory } from "@/actions/admin/category.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import { type CategoryForm, categorySchema } from "@/schema/admin/category";
import type { Category } from "@/types";

interface Props {
  category: Category | null;
  onClose: () => void;
}

const AdminUpdateCategoryModal = ({ category, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      reset({
        name: category.name,
        category_type: category.category_type,
        parent_id: category.parent_id ?? null,
        description: category.description ?? undefined,
      });
    }
  }, [category, reset]);

  const onSubmit = async (data: CategoryForm) => {
    if (!category) return;

    const payload = {
      name: data.name,
      category_type: data.category_type,
      description: data.description ?? undefined,
    };

    const response = await updateCategory(category.id, payload);

    if (response.success) {
      toast.success(response.message);
      onClose();
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Dialog open={!!category} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            Update Category
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-6"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">
              Category Name <RequiredIndicator />
            </Label>
            <Input {...register("name")} />
            {errors.name?.message && (
              <ValidationMessage message={errors.name.message} />
            )}
          </div>

          {/* Description ONLY for parent */}
          {category?.parent_id === null && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">
                Description <RequiredIndicator />
              </Label>
              <Textarea {...register("description")} className="h-44" />
              {errors?.description?.message && (
                <ValidationMessage message={errors.description.message} />
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Save
              {isSubmitting && <Spinner className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminUpdateCategoryModal;
