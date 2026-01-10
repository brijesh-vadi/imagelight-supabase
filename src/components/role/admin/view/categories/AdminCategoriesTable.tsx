"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/manufacturer/category.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteDialog } from "@/components/widgets/DeleteDialog";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/types";

const AdminCategoriesTable = ({ categories }: { categories: Category[] }) => {
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    const response = await deleteCategory(categoryToDelete.id);
    setIsDeleting(false);

    if (response?.success) {
      toast.success(response.message);
      setCategoryToDelete(null);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-primary/10">
          <TableRow>
            <TableHead className="px-5">Category Name</TableHead>
            <TableHead className="text-center">Product Count</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Updated At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="h-14">
              <TableCell className="pl-5 text-left">{category.name}</TableCell>
              <TableCell className=" text-center">
                {category.product_count ?? 0}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(category.created_at)}
              </TableCell>
              <TableCell className="text-center">
                {formatDate(category.updated_at)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DeleteDialog
        open={!!categoryToDelete}
        title={categoryToDelete?.name ?? ""}
        description="This action cannot be undone. This will permanently delete the unit from the system."
        isDeleting={isDeleting}
        onConfirmAction={handleDeleteCategory}
        onCancelAction={() => setCategoryToDelete(null)}
      />
    </>
  );
};

export default AdminCategoriesTable;
