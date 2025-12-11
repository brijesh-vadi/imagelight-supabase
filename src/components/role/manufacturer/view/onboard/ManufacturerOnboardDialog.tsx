"use client";

import { useState } from "react";
import ManufacturerOnboardForm from "./ManufacturerOnboardForm";

const ManufacturerOnboardDialog = ({ userId }: { userId: string }) => {
  const [open, setOpen] = useState(true);

  return (
    <ManufacturerOnboardForm
      userId={userId}
      open={open}
      onOpenChange={setOpen}
    />
  );
};

export default ManufacturerOnboardDialog;
