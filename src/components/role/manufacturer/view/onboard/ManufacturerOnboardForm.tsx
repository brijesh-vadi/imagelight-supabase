"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onboardManufacturer } from "@/actions/manufacturer/onboard.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/widgets/FileUpload";
import RequiredIndicator from "@/components/widgets/RequiredIndicator";
import ValidationMessage from "@/components/widgets/ValidationMessage";
import citiesData from "@/data/cities.json";
import statesData from "@/data/states.json";
import {
  type ManufacturerOnboardingForm,
  manufacturerOnboardingSchema,
} from "@/schema/manufacturer/onboard";

const STEPS = [
  { id: 1, name: "Company Information" },
  { id: 2, name: "Address Details" },
  { id: 3, name: "Documents" },
];

const STEP_FIELDS: Record<number, (keyof ManufacturerOnboardingForm)[]> = {
  1: ["companyName", "contactPerson", "gstNumber", "description", "website"],
  2: ["address", "state", "city", "pincode"],
  3: ["companyLogo", "verificationDocument"],
};

const totalSteps = 3;

interface Props {
  userId: string;
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ManufacturerOnboardForm = ({ userId, open, onOpenChange }: Props) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ManufacturerOnboardingForm>({
    mode: "onChange",
    resolver: zodResolver(manufacturerOnboardingSchema),
    defaultValues: {
      website: "",
      state: "",
      city: "",
    },
  });

  const selectedState = watch("state");
  const watchedCity = watch("city");

  const availableCities = useMemo(() => {
    if (!selectedState) return [];
    const stateId = statesData.find((s) => s.name === selectedState)?.id;
    return stateId
      ? citiesData.filter((city) => city.state_id === stateId)
      : [];
  }, [selectedState]);

  const handleStateChange = (value: string) => {
    setValue("state", value || "", { shouldDirty: true });
    setValue("city", "", { shouldDirty: true });
  };

  const handleCityChange = (value: string) => {
    setValue("city", value || "", { shouldDirty: true });
  };

  const handleLogoChange = (file: any | null) => {
    setValue("companyLogo", file?.file || "", { shouldDirty: true });
  };

  const handleVerificationDocChange = (file: any | null) => {
    setValue("verificationDocument", file?.file || "", { shouldDirty: true });
  };

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await trigger(fields);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleSuccess = () => {
    reset();
    onOpenChange?.(false);
    router.push("/manufacturer/dashboard");
    router.refresh();
  };

  const onSubmit = async (data: ManufacturerOnboardingForm) => {
    try {
      setIsSubmitting(true);
      const response = await onboardManufacturer({ userId, data });

      if (response.success) {
        toast.success(response.message || "Profile completed successfully!");
        handleSuccess();
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-4xl overflow-y-auto p-0 gap-0 [&>button:first-of-type]:hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-3 text-xl mx-auto">
              <Building2 className="h-7 w-7 text-primary" />
              Complete Your Manufacturer Profile
            </span>
          </DialogTitle>
          <DialogDescription />

          {/* Step Indicator */}
          <div className="flex items-center justify-center mt-6">
            {STEPS.map((step, index) => (
              <Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <span
                    className={`text-xs font-medium mb-2 whitespace-nowrap ${
                      currentStep >= step.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all flex-shrink-0 ${
                      currentStep > step.id
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`h-0.5 w-32 transition-colors mx-4`} />
                  // <div
                  //   className={`h-0.5 w-32 transition-colors mx-4 ${
                  //     currentStep > step.id + 1 ? "bg-primary" : "bg-border"
                  //   }`}
                  // />
                )}
              </Fragment>
            ))}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-0 shadow-none rounded-t-none p-0">
            <CardContent className="p-8 pt-6 space-y-8">
              {/* Step 1: Company Info */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>
                          Company Name <RequiredIndicator />
                        </Label>
                        <Input
                          {...register("companyName")}
                          placeholder="Imagelight Pvt Ltd"
                        />
                      </div>
                      {errors.companyName?.message && (
                        <ValidationMessage
                          message={errors.companyName.message}
                        />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>
                          Contact Person <RequiredIndicator />
                        </Label>
                        <Input
                          {...register("contactPerson")}
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.contactPerson?.message && (
                        <ValidationMessage
                          message={errors.contactPerson.message}
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          {...register("website")}
                          placeholder="https://example.com"
                        />
                      </div>
                      {errors.website?.message && (
                        <ValidationMessage message={errors.website.message} />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>
                          GST Number <RequiredIndicator />
                        </Label>
                        <Input
                          {...register("gstNumber")}
                          placeholder="22ABCDE1234F1Z5"
                          maxLength={15}
                        />
                      </div>
                      {errors.gstNumber?.message && (
                        <ValidationMessage message={errors.gstNumber.message} />
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="space-y-2 w-full max-w-full">
                      <Label>
                        Company Description <RequiredIndicator />
                      </Label>
                      <Textarea
                        {...register("description")}
                        placeholder="Tell us about your company..."
                        className="min-h-40 resize-none w-full break-all overflow-hidden whitespace-pre-wrap"
                        rows={7}
                      />
                    </div>
                    {errors.description?.message && (
                      <ValidationMessage message={errors.description.message} />
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Address */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-0.5">
                    <div className="space-y-2">
                      <Label>
                        Company Address <RequiredIndicator />
                      </Label>
                      <Textarea
                        {...register("address")}
                        placeholder="Full address..."
                        className="h-24"
                      />
                    </div>
                    {errors.address?.message && (
                      <ValidationMessage message={errors.address.message} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>
                          State <RequiredIndicator />
                        </Label>
                        <Combobox
                          options={statesData}
                          value={selectedState}
                          onValueChange={handleStateChange}
                          placeholder="Select state"
                          searchPlaceholder="Search state..."
                          emptyText="No state found."
                        />
                      </div>
                      {errors.state?.message && (
                        <ValidationMessage message={errors?.state?.message} />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>
                          City <RequiredIndicator />
                        </Label>
                        <Combobox
                          options={availableCities}
                          value={watchedCity}
                          onValueChange={handleCityChange}
                          placeholder="Select city"
                          disabled={!selectedState}
                          emptyText="Select state first"
                        />
                      </div>
                      {errors.city?.message && (
                        <ValidationMessage message={errors.city.message} />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <div className="space-y-2">
                        <Label>
                          Pincode <RequiredIndicator />
                        </Label>
                        <Input
                          {...register("pincode")}
                          placeholder="400001"
                          maxLength={6}
                        />
                      </div>
                      {errors.pincode?.message && (
                        <ValidationMessage message={errors.pincode.message} />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-0.5">
                    <div className="space-y-4">
                      <Label className="block text-center">
                        Company Logo <RequiredIndicator />
                      </Label>
                      <div className="mx-auto w-fit">
                        <FileUpload
                          accept="image"
                          variant="round"
                          onFileChange={handleLogoChange}
                          disabled={isSubmitting}
                        />
                      </div>
                      <p className="text-xs text-center text-muted-foreground">
                        PNG, JPG up to 2MB
                      </p>
                    </div>
                    <div className="w-fit mx-auto">
                      {errors.companyLogo?.message && (
                        <ValidationMessage
                          message={errors.companyLogo.message}
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="space-y-4">
                      <Label>
                        Verification Document <RequiredIndicator />
                      </Label>
                      <FileUpload
                        accept="image-pdf"
                        variant="rectangle"
                        onFileChange={handleVerificationDocChange}
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-muted-foreground">
                        GST certificate, Trade license, or Registration
                        certificate (up to 2MB)
                      </p>
                    </div>
                    {errors.verificationDocument?.message && (
                      <ValidationMessage
                        message={errors.verificationDocument.message}
                      />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center p-6 border-t bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerOnboardForm;
