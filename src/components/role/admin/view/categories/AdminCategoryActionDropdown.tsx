"use client";

import { FilePenLine, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

const AdminCategoryActionDropdown = ({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) => {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(category);
        }}
      >
        <FilePenLine className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 text-destructive hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(category);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AdminCategoryActionDropdown;
