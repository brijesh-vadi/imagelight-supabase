"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addCategory } from "@/actions/manufacturer/category.action";
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
import { Spinner } from "@/components/ui/spinner";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import {
  type CategoryForm,
  categorySchema,
} from "@/schema/manufacturer/category";

const ManufacturerAddCategoryModal = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryForm) => {
    const response = await addCategory(data);
    if (response?.success) {
      reset();
      setIsDialogOpen(false);
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            Add Category
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
              <Input {...register("name")} placeholder="Books" />
              {errors.name?.message && (
                <ValidationMessage message={errors.name.message} />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="secondary" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="flex items-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              <span>Save</span>
              {isSubmitting && <Spinner />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerAddCategoryModal;
