"use client";

import { useState } from "react";
import type {
  ApplicationStatus,
  Dealer,
  DealerApplicationHistoryEntry,
} from "@/types";
import DealerApplicationActions from "./DealerApplicationActions";
import DealerDetailsView from "./DealerDetailsView";

interface Props {
  initialDealer: Dealer & {
    application_history?: DealerApplicationHistoryEntry[];
    application_status?: ApplicationStatus;
  };
  dealerId: string;
}

const DealerApplicationPage = ({ initialDealer, dealerId }: Props) => {
  const [applicationStatus, setApplicationStatus] = useState<
    ApplicationStatus | undefined
  >(initialDealer.application_status);

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setApplicationStatus(newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="font-semibold text-2xl text-primary">
              Dealer Application
            </h1>
            <p className="text-muted-foreground text-sm">
              Review dealer information and manage their application status.
            </p>
          </div>
          <DealerApplicationActions
            dealerId={dealerId}
            applicationStatus={applicationStatus}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
      <DealerDetailsView
        dealer={{
          ...initialDealer,
          application_status: applicationStatus,
        }}
      />
    </div>
  );
};

export default DealerApplicationPage;
