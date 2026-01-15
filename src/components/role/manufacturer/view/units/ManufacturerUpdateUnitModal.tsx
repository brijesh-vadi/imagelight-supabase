"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateUnit } from "@/actions/manufacturer/unit.action";
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
import { type UnitForm, unitSchema } from "@/schema/manufacturer/unit";
import type { Unit } from "@/types";

interface UpdateUnitModalProps {
  open: boolean;
  unit: Unit | null;
  onClose: () => void;
}

const ManufacturerUpdateUnitModal = ({
  open,
  unit,
  onClose,
}: UpdateUnitModalProps) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UnitForm>({
    resolver: zodResolver(unitSchema),
  });

  useEffect(() => {
    if (open && unit) {
      reset({
        name: unit.name || "",
      });
    }
  }, [open, unit, reset]);

  const onSubmit = async (data: UnitForm) => {
    if (!unit) return;

    const response = await updateUnit(unit.id, data);
    if (response?.success) {
      reset();
      onClose();
      toast.success(response.message);
      queryClient.invalidateQueries({
        queryKey: ["manufacturer-units"],
      });
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
            Update Unit
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
                Unit Name <RequiredIndicator />
              </Label>
              <Input {...register("name")} placeholder="Kilogram" />
              {errors.name?.message && (
                <ValidationMessage message={errors.name.message} />
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <DialogClose asChild>
              <Button variant="secondary" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="flex items-center gap-2"
              type="submit"
              disabled={isSubmitting}
            >
              <span>Update</span>
              {isSubmitting && <Spinner className="w-4 h-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerUpdateUnitModal;
