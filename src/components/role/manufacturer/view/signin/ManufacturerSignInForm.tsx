"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInManufacturer } from "@/actions/manufacturer/auth.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import MobileInput from "@/components/widgets/MobileInput";
import PasswordInput from "@/components/widgets/PasswordInput";
import { type SignInForm, signInSchema } from "@/schema/manufacturer/auth";

const ManufacturerSignInForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
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
    }
  };

  return (
    <Card className="border-none">
      <CardContent className="px-4 md:px-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <MobileInput
            label="Mobile Number"
            register={register("mobile")}
            error={errors.mobile}
            disabled={isSubmitting}
          />

          <PasswordInput
            register={register("password")}
            error={errors.password}
            placeholder="********"
            disabled={isSubmitting}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || !isValid}
          >
            Sign In
            {isSubmitting && <Spinner className="h-4 w-4" />}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center w-full text-muted-foreground">
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
