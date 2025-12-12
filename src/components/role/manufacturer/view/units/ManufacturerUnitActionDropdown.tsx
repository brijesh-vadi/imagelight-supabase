import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onUpdate?: () => void;
  onDelete?: () => void;
}

const ManufacturerUnitActionDropdown = ({ onDelete, onUpdate }: Props) => {
  const dropdownItems = [
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
      <DropdownMenuTrigger>
        <Ellipsis className="cursor-pointer" size={18} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {dropdownItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className="flex cursor-pointer items-center gap-2 font-medium"
          >
            <item.icon className="h-2 w-2 hover:text-primary" />
            <span className="text-xs">{item.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ManufacturerUnitActionDropdown;
