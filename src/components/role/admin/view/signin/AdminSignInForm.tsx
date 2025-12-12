"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInAdmin } from "@/actions/admin/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/widgets/PasswordInput";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import { type AdminSigninForm, adminSigninSchema } from "@/schema/admin/auth";

const AdminSignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSigninForm>({
    resolver: zodResolver(adminSigninSchema),
  });

  const onSubmit = async (data: AdminSigninForm) => {
    setLoading(true);

    try {
      const result = await signInAdmin(data);
      console.log("result", result);

      if (!result.success) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success(result.message);
      router.refresh();
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-none shadow-lg">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <div className="space-y-2">
              <Label>
                Username
                <RequiredIndicator />
              </Label>
              <Input
                {...register("username")}
                type="text"
                placeholder="admin"
                disabled={loading}
              />
            </div>
            {errors.username?.message && (
              <ValidationMessage message={errors.username.message} />
            )}
          </div>

          <PasswordInput
            register={register("password")}
            error={errors.password}
            disabled={loading}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminSignInForm;
