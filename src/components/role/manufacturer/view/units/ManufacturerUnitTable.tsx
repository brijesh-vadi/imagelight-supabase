"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUnit } from "@/actions/manufacturer/unit.action";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/widgets/DeleteDialog";
import { useUnits } from "@/hooks/manufacturer/useUnits";
import { formatDate } from "@/lib/utils";
import type { Unit } from "@/types";
import ManufacturerUnitActionDropdown from "./ManufacturerUnitActionDropdown";
import ManufacturerUpdateUnitModal from "./ManufacturerUpdateUnitModal";

const ManufacturerUnitTable = () => {
  const { data: units, isLoading } = useUnits();

  const queryClient = useQueryClient();

  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);
  const [unitToUpdate, setUnitToUpdate] = useState<Unit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUnit = async () => {
    if (!unitToDelete) return;

    setIsDeleting(true);
    const response = await deleteUnit(unitToDelete.id);
    setIsDeleting(false);

    if (response?.success) {
      toast.success(response.message);
      setUnitToDelete(null);

      queryClient.invalidateQueries({
        queryKey: ["manufacturer-units"],
      });
    } else {
      toast.error(response.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-175">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/10">
            <TableRow>
              <TableHead className="px-5">Unit Name</TableHead>
              <TableHead className="text-center">Product Count</TableHead>
              <TableHead className="text-center">Created At</TableHead>
              <TableHead className="text-center">Updated At</TableHead>
              <TableHead className="px-5 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units?.map((unit) => (
              <TableRow key={unit.id} className="h-14">
                <TableCell className="pl-5 text-left text-sm">
                  {unit.name}
                </TableCell>
                <TableCell className=" text-center text-sm">
                  {unit.product_count ?? 0}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {formatDate(unit.created_at)}
                </TableCell>
                <TableCell className="text-center text-sm">
                  {formatDate(unit.updated_at)}
                </TableCell>
                <TableCell className="pr-5 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <ManufacturerUnitActionDropdown
                      onUpdate={() => setUnitToUpdate(unit)}
                      onDelete={() => setUnitToDelete(unit)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {units?.map((unit) => (
          <div
            key={unit.id}
            className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-primary">
                  {unit.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {unit.product_count ?? 0} products
                </p>
              </div>
              <ManufacturerUnitActionDropdown
                onUpdate={() => setUnitToUpdate(unit)}
                onDelete={() => setUnitToDelete(unit)}
              />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Created</span>
                <p className="font-medium mt-0.5">
                  {formatDate(unit.created_at)}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Updated</span>
                <p className="font-medium mt-0.5">
                  {formatDate(unit.updated_at)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteDialog
        open={!!unitToDelete}
        title={unitToDelete?.name ?? ""}
        description="This action cannot be undone. This will permanently delete the unit from the system."
        isDeleting={isDeleting}
        onConfirmAction={handleDeleteUnit}
        onCancelAction={() => setUnitToDelete(null)}
      />
      <ManufacturerUpdateUnitModal
        open={!!unitToUpdate}
        unit={unitToUpdate}
        onClose={() => setUnitToUpdate(null)}
      />
    </>
  );
};

export default ManufacturerUnitTable;
