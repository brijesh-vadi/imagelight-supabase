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
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3 sm:gap-4 border-b pb-3 sm:pb-4">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-xl sm:text-2xl text-primary">
              Add Dealer
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 border-b pb-3 sm:pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-xl sm:text-2xl text-primary">
            Dealership Applications
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Review, track, and manage dealership requests from dealers applying
            to work with your business.
          </p>
        </div>
        <Button asChild className="shrink-0">
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
