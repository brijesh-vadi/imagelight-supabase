"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateDealerPassword } from "@/actions/dealer/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  dealerId: string;
}

const DealerPasswordResetModal = ({ dealerId }: Props) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const res = await updateDealerPassword(dealerId, password);
    setLoading(false);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success("Password updated successfully");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-xl font-semibold">Set New Password</h2>
        <p className="text-sm text-muted-foreground">
          You were added by a manufacturer. Please set a new password to
          continue.
        </p>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Confirm password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <Button className="w-full" onClick={handleSubmit} disabled={loading}>
          Update Password
        </Button>
      </div>
    </div>
  );
};

export default DealerPasswordResetModal;
