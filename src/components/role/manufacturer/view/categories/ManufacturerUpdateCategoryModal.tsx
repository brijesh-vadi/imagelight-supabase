"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateCategory } from "@/actions/manufacturer/category.action";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import {
  type CategoryForm,
  categorySchema,
} from "@/schema/manufacturer/category";
import type { Category } from "@/types";

interface Props {
  open: boolean;
  category: Category | null;
  onClose: () => void;
}

const ManufacturerUpdateCategoryModal = ({
  open,
  category,
  onClose,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (category) {
      setValue("name", category.name);
    }
  }, [category, setValue]);

  const onSubmit = async (data: CategoryForm) => {
    if (!category) return;

    const response = await updateCategory(category.id, data);
    if (response?.success) {
      reset();
      onClose();
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex flex-col gap-6">
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
          <div className="flex items-center gap-3">
            <div className="flex w-full flex-col gap-2">
              <Label className="text-muted-foreground">
                Category Name <RequiredIndicator />
              </Label>
              <Input {...register("name")} placeholder="Kilogram" />
              {errors.name?.message && (
                <ValidationMessage message={errors.name.message} />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="flex items-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              <span>Update</span>
              {isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerUpdateCategoryModal;
