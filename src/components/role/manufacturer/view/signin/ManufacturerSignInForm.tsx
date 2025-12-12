"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInManufacturer } from "@/actions/manufacturer/auth.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MobileInput from "@/components/widgets/MobileInput";
import PasswordInput from "@/components/widgets/PasswordInput";
import { type SignInForm, signInSchema } from "@/schema/manufacturer/auth";

const ManufacturerSignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);

    try {
      const result = await signInManufacturer(data);

      if (!result.success) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      toast.success(result.message);

      router.push("/manufacturer/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MobileInput
            label="Mobile Number"
            register={register("mobile")}
            error={errors.mobile}
          />

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
      <CardFooter>
        <p className="text-sm text-center w-full text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/manufacturer/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ManufacturerSignInForm;
