import { CircleX, EllipsisVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onDetail?: () => void;
  onCancel?: () => void;
}

const DealerOrderItemActionDropdown = ({ onDetail, onCancel }: Props) => {
  const dropdownItems = [
    {
      label: "View Product",
      icon: Eye,
      onClick: onDetail,
      show: !!onDetail,
    },
    {
      label: "Cancel Order",
      icon: CircleX,
      onClick: onCancel,
      show: !!onCancel,
    },
  ].filter((item) => item.show);

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

export default DealerOrderItemActionDropdown;
