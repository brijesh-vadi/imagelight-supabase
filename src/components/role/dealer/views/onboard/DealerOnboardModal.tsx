"use client";

import { useState } from "react";
import type { Dealer } from "@/types";
import DealerOnboardForm from "./DealerOnboardForm";

interface Props {
  userId: string;
  dealer: Dealer;
}

const DealerOnboardModal = ({ userId, dealer }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <DealerOnboardForm
      userId={userId}
      open={open}
      onOpenChange={setOpen}
      dealer={dealer}
    />
  );
};

export default DealerOnboardModal;
