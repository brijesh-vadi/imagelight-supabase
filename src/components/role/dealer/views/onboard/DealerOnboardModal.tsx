"use client";

import { useState } from "react";
import DealerOnboardForm from "./DealerOnboardForm";

const DealerOnboardModal = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(true);

  return (
    <DealerOnboardForm userId={userId} open={open} onOpenChange={setOpen} />
  );
};

export default DealerOnboardModal;
