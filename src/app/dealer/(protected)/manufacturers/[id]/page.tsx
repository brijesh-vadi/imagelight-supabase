import { notFound } from "next/navigation";
import { getManufacturerById } from "@/actions/dealer/manufacturer.action";
import ManufacturerDetailsView from "@/components/role/dealer/views/manufacturers/ManufacturerDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

const ManufacturerDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  const { data: manufacturer } = await getManufacturerById(id, true);

  if (!manufacturer) notFound();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">
            Manufacturer Details
          </h1>
          <p className="text-muted-foreground text-sm">
            View complete manufacturer information, verify credentials, and
            explore their product offerings.
          </p>
        </div>
      </div>
      <ManufacturerDetailsView manufacturer={manufacturer} />
    </div>
  );
};

export default ManufacturerDetailsPage;
