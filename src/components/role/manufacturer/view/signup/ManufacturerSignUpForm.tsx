"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signupManufacturer } from "@/actions/manufacturer/auth.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MobileInput from "@/components/widgets/MobileInput";
import PasswordInput from "@/components/widgets/PasswordInput";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import { type SignUpForm, signupSchema } from "@/schema/manufacturer/auth";

const ManufacturerSignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      setLoading(true);

      const response = await signupManufacturer(data);

      if (!response?.success) {
        toast.error(response?.message);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/manufacturer/sign-in");
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
          <div className="space-y-1">
            <div className="space-y-2">
              <Label>
                Email Address <RequiredIndicator />
              </Label>
              <Input
                {...register("email")}
                type="email"
                placeholder="manufacturer@example.com"
                disabled={loading}
              />
            </div>
            {errors.email?.message && (
              <ValidationMessage message={errors.email?.message} />
            )}
          </div>

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

          <PasswordInput
            label="Confirm Password"
            register={register("confirmPassword")}
            error={errors.confirmPassword}
            disabled={loading}
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/manufacturer/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ManufacturerSignUpForm;
