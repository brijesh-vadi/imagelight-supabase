"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { addDealer } from "@/actions/manufacturer/dealer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import MobileInput from "@/components/widgets/MobileInput";
import PasswordInput from "@/components/widgets/PasswordInput";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import { type DealerForm, dealerSchema } from "@/schema/manufacturer/dealer";

const AddDealerForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<DealerForm>({
    resolver: zodResolver(dealerSchema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: DealerForm) => {
    try {
      setIsLoading(true);
      const response = await addDealer(data);

      if (response.success) {
        toast.success(response.message);
        router.push("/manufacturer/dealer-applications");
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error("Add dealer error:", err);
      toast.error("Failed to add dealer");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6 max-w-xl"
    >
      {/* Company Info */}
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <Label>
            Company Name <RequiredIndicator />
          </Label>
          <Input
            {...register("companyName")}
            placeholder="ABC Traders Pvt Ltd"
            disabled={isSubmitting}
          />
          {errors.companyName?.message && (
            <ValidationMessage message={errors.companyName.message} />
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          <Label>
            Contact Person <RequiredIndicator />
          </Label>
          <Input
            {...register("contactPerson")}
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {errors.contactPerson?.message && (
            <ValidationMessage message={errors.contactPerson.message} />
          )}
        </div>
      </div>

      {/* Login Info */}
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-2">
          <Label>
            Email <RequiredIndicator />
          </Label>
          <Input
            {...register("email")}
            placeholder="dealer@example.com"
            disabled={isSubmitting}
          />
          {errors.email?.message && (
            <ValidationMessage message={errors.email.message} />
          )}
        </div>

        <MobileInput
          label="Mobile Number"
          register={register("mobile")}
          error={errors.mobile}
        />
      </div>

      {/* Temporary Password */}
      <div className="flex flex-col gap-6">
        <PasswordInput
          register={register("password")}
          error={errors.password}
        />

        <PasswordInput
          register={register("confirmPassword")}
          error={errors.confirmPassword}
        />

        <p className="text-xs text-muted-foreground">
          This is a temporary password. The dealer will be required to change it
          on first login.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Discard changes?</AlertDialogTitle>
              <AlertDialogDescription>
                Any entered dealer information will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => router.push("/manufacturer/dealers")}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button
          type="submit"
          disabled={isLoading || !isValid}
          className="flex items-center gap-2"
        >
          <span>Save</span>
          {isLoading && <Spinner className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
};

export default AddDealerForm;
