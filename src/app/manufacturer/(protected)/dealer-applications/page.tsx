import Link from "next/link";
import AddDealerForm from "@/components/role/manufacturer/view/dealer-applications/AddDealerForm";
import DealersListView from "@/components/role/manufacturer/view/dealer-applications/DealersListView";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/widgets/BackButton";

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    "add-dealer"?: string;
  }>;
}

const DealerApplicationsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const isAddMode = params["add-dealer"] !== undefined;

  if (isAddMode) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <BackButton />
          <div>
            <h1 className="font-semibold text-2xl text-primary">Add Dealer</h1>
            <p className="text-muted-foreground text-sm">
              Create a dealer account with basic details. Additional information
              can be completed later by the dealer.
            </p>
          </div>
        </div>
        {isAddMode && <AddDealerForm />}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">
            Dealership Applications
          </h1>
          <p className="text-muted-foreground text-sm">
            Review, track, and manage dealership requests from dealers applying
            to work with your business.
          </p>
        </div>
        <Button asChild>
          <Link href="/manufacturer/dealer-applications?add-dealer">
            Add Dealer
          </Link>
        </Button>
      </div>

      <DealersListView />
    </div>
  );
};

export default DealerApplicationsPage;
