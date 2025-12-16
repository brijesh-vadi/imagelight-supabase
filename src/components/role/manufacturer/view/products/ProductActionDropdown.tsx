import { EllipsisVertical, Eye, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onUpdate?: () => void;
  onDelete?: () => void;
  onDetail?: () => void;
}

const ProductActionDropdown = ({ onDetail, onDelete, onUpdate }: Props) => {
  const dropdownItems = [
    {
      label: "View Details",
      icon: Eye,
      onClick: onDetail,
    },
    {
      label: "Update",
      icon: Pencil,
      onClick: onUpdate,
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: onDelete,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-md p-1 hover:bg-muted">
        <EllipsisVertical className="cursor-pointer" size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dropdownItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className="flex cursor-pointer items-center gap-2 font-medium"
          >
            <item.icon className="hover:text-primary h-4 w-4" />
            <span className="text-xs">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductActionDropdown;
