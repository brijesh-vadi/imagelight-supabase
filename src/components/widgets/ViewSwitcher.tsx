import { LayoutGrid, List } from "lucide-react";

type ViewType = "card" | "list";

interface Props {
  selectedView: ViewType;
  onChange: (view: ViewType) => void;
}

export default function ViewSwitcher({ selectedView, onChange }: Props) {
  return (
    <div className="bg-primary px-1 py-1 rounded-md">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange("card")}
          className={`p-2 rounded-sm cursor-pointer flex items-center justify-center
          ${selectedView === "card" ? "bg-white text-primary" : "text-white"}`}
        >
          <LayoutGrid size={14} />
        </button>

        <button
          type="button"
          onClick={() => onChange("list")}
          className={`p-2 rounded-sm cursor-pointer flex items-center justify-center
          ${selectedView === "list" ? "bg-white text-primary" : "text-white"}`}
        >
          <List size={14} />
        </button>
      </div>
    </div>
  );
}
