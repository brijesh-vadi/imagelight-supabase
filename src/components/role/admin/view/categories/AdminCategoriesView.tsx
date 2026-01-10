"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  deleteCategory,
  updateCategory,
} from "@/actions/admin/category.action";
import { type TreeDataItem, TreeView } from "@/components/ui/tree-view";
import { DeleteDialog } from "@/components/widgets/DeleteDialog";
import type { Category } from "@/types";
import AdminCategoryActionDropdown from "./AdminCategoryActionDropdown";
import AdminUpdateCategoryModal from "./AdminCategoryUpdateModal";

interface Props {
  categories: Category[];
}

const AdminCategoriesView = ({ categories }: Props) => {
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [categoryToUpdate, setCategoryToUpdate] = useState<Category | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteIntent = (category: Category) => {
    setCategoryToDelete(category);
  };

  const handleUpdateIntent = (category: Category) => {
    setCategoryToUpdate(category);
  };

  const handleDelete = async () => {
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

  const buildAdminCategoryTree = (
    categories: Category[],
    onEdit: (c: Category) => void,
    onDelete: (c: Category) => void,
  ): TreeDataItem[] => {
    const parents = categories.filter(
      (c) => c.parent_id === null && c.is_active,
    );

    const childrenByParent = new Map<string, Category[]>();

    for (const category of categories) {
      if (category.parent_id) {
        if (!childrenByParent.has(category.parent_id)) {
          childrenByParent.set(category.parent_id, []);
        }
        childrenByParent.get(category.parent_id)!.push(category);
      }
    }

    return parents.map<TreeDataItem>((parent) => ({
      id: parent.id,
      name: parent.name,

      actions: (
        <AdminCategoryActionDropdown
          category={parent}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),

      children: (childrenByParent.get(parent.id) ?? [])
        .filter((child) => child.is_active)
        .map<TreeDataItem>((child) => ({
          id: child.id,
          name: child.name,

          actions: (
            <AdminCategoryActionDropdown
              category={child}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ),
        })),
    }));
  };

  const treeData = useMemo(
    () =>
      buildAdminCategoryTree(
        categories,
        handleUpdateIntent,
        handleDeleteIntent,
      ),
    [categories],
  );

  return (
    <>
      <TreeView data={treeData} className="p-0" />

      <AdminUpdateCategoryModal
        category={categoryToUpdate}
        onClose={() => setCategoryToUpdate(null)}
      />
      <DeleteDialog
        open={!!categoryToDelete}
        title={categoryToDelete?.name ?? ""}
        description="This action cannot be undone. This will permanently delete the product from the system."
        isDeleting={isDeleting}
        onConfirmAction={handleDelete}
        onCancelAction={() => setCategoryToDelete(null)}
      />
    </>
  );
};

export default AdminCategoriesView;
