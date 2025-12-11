"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Fragment } from "react/jsx-runtime";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { onboardManufacturer } from "@/api/manufacturer/onboard.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Combobox } from "@/components/ui/combobox";
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
  1: ["companyName", "contactPerson", "gstNumber", "description"],
  2: ["address", "state", "city", "pincode"],
  3: ["companyLogo", "verificationDocument"],
};

const totalSteps = 3;

const ManufacturerOnboardDialog = ({ userId }: { userId: string }) => {
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
  } = useForm<ManufacturerOnboardingForm>({
    mode: "onTouched",
    resolver: zodResolver(manufacturerOnboardingSchema),
  });

  const selectedState = watch("state");

  const availableCities = useMemo(() => {
    if (!selectedState) return [];
    const stateId = statesData.find((s) => s.name === selectedState)?.id;
    if (!stateId) return [];
    return citiesData.filter((city) => city.state_id === stateId);
  }, [selectedState]);

  const handleStateChange = (stateName: string) => {
    setValue("state", stateName, { shouldValidate: true });
    setValue("city", "", { shouldValidate: false });
  };

  const handleCityChange = (cityName: string) => {
    setValue("city", cityName, { shouldValidate: true });
  };

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const fieldsToValidate = STEP_FIELDS[currentStep];
    // const isValid = await trigger(fieldsToValidate);
    const isValid = true;

    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogoChange = (file: any | null) => {
    if (file?.file) {
      setValue("companyLogo", file.file, {
        shouldDirty: true,
      });
    } else {
      setValue("companyLogo", "", {
        shouldDirty: true,
      });
    }
  };

  const handleVerificationDocChange = (file: any | null) => {
    if (file?.file) {
      setValue("verificationDocument", file.file, {
        shouldDirty: true,
      });
    } else {
      setValue("verificationDocument", "", {
        shouldDirty: true,
      });
    }
  };

  const onSubmit = async (data: ManufacturerOnboardingForm) => {
    try {
      setIsSubmitting(true);

      const response = await onboardManufacturer({
        userId,
        data,
      });

      if (response.success) {
        toast.success(response.message);
        // router.push("/dashboard");
        // router.refresh();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 w-full">
      <div className="max-w-4xl w-full">
        <div className="mb-6 w-full space-y-6">
          <div className="flex items-center justify-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div className="flex items-end">
            {STEPS.map((step, index) => (
              <Fragment key={step.id}>
                <div className="flex flex-1 flex-col items-center gap-2">
                  <p
                    className={`text-center font-medium text-sm transition-colors ${
                      currentStep === step.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </p>
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      currentStep > step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : currentStep === step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.id}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    key={`line-${step.id}`}
                    className={`mb-4 h-0.5 flex-1 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>

        <Card className="w-full p-10">
          <CardContent className="space-y-6 p-0">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step Content */}
              <div className="min-h-[400px]">
                {currentStep === 1 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-1">
                        <div className="space-y-2">
                          <Label>
                            Company Name <RequiredIndicator />
                          </Label>
                          <Input
                            {...register("companyName")}
                            placeholder="Imagelight Pvt Ltd"
                          />
                        </div>
                        {errors.companyName && (
                          <ValidationMessage
                            message={errors.companyName.message || ""}
                          />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="space-y-2">
                          <Label>
                            Contact Person <RequiredIndicator />
                          </Label>
                          <Input
                            {...register("contactPerson")}
                            placeholder="John Doe"
                          />
                        </div>
                        {errors.contactPerson && (
                          <ValidationMessage
                            message={errors.contactPerson.message || ""}
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-1">
                        <div className="space-y-2">
                          <Label>
                            Website <RequiredIndicator />
                          </Label>
                          <Input
                            {...register("website")}
                            placeholder="https://imagelight.com"
                          />
                        </div>
                        {errors.website && (
                          <ValidationMessage
                            message={errors.website.message || ""}
                          />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="space-y-2">
                          <Label className="h-4">
                            GST Number <RequiredIndicator />
                          </Label>
                          <Input
                            {...register("gstNumber")}
                            placeholder="22ABCDE1234F1Z5"
                            maxLength={15}
                          />
                        </div>
                        {errors.gstNumber && (
                          <ValidationMessage
                            message={errors.gstNumber.message || ""}
                          />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="space-y-2">
                        <Label>
                          Company Description
                          <RequiredIndicator />
                        </Label>
                        <Textarea
                          {...register("description")}
                          placeholder="Tell dealers about your company, products, manufacturing capabilities, years in business, and what makes you unique. Example: ABC Textiles has been producing high-quality fabrics for 15 years, specializing in organic cotton and sustainable materials."
                          className="h-40"
                          rows={7}
                        />
                      </div>
                      {errors.description && (
                        <ValidationMessage
                          message={errors.description.message || ""}
                        />
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-1">
                      <div className="space-y-2">
                        <Label>
                          Company Address <RequiredIndicator />
                        </Label>
                        <Textarea
                          {...register("address")}
                          placeholder="Building number, street name, area"
                          className="h-20"
                        />
                      </div>
                      {errors.address && (
                        <ValidationMessage
                          message={errors.address.message || ""}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <div className="space-y-1">
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
                        {errors.state && (
                          <ValidationMessage
                            message={errors.state.message || ""}
                          />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="space-y-2">
                          <Label>
                            City <RequiredIndicator />
                          </Label>
                          <Combobox
                            options={availableCities}
                            value={watch("city")}
                            placeholder="Select city"
                            searchPlaceholder="Search city..."
                            emptyText="No city found."
                            onValueChange={handleCityChange}
                            disabled={!selectedState}
                          />
                        </div>
                        {errors.city && (
                          <ValidationMessage
                            message={errors.city.message || ""}
                          />
                        )}
                      </div>

                      <div className="space-y-1">
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
                        {errors.pincode && (
                          <ValidationMessage
                            message={errors.pincode.message || ""}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-1 w-fit mx-auto">
                        <div className="space-y-4">
                          <Label className="w-fit mx-auto">
                            Company Logo <RequiredIndicator />
                          </Label>
                          <div className="flex flex-col gap-2">
                            <FileUpload
                              accept="image"
                              variant="round"
                              onFileChange={handleLogoChange}
                              disabled={isSubmitting}
                            />
                            <p className="text-muted-foreground text-xs text-center">
                              PNG, JPG up to 2MB
                            </p>
                          </div>
                        </div>
                        {errors.companyLogo && (
                          <ValidationMessage
                            message={errors.companyLogo.message || ""}
                          />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="space-y-4">
                          <Label>
                            Verification Document <RequiredIndicator />
                          </Label>
                          <div className="flex flex-col gap-2">
                            <FileUpload
                              accept="image-pdf"
                              variant="rectangle"
                              onFileChange={handleVerificationDocChange}
                              disabled={isSubmitting}
                            />

                            <p className="text-muted-foreground text-xs text-center">
                              GST certificate, Trade license, or Registration
                              certificate up to 2MB
                            </p>
                          </div>
                        </div>

                        {errors.verificationDocument && (
                          <ValidationMessage
                            message={errors.verificationDocument.message || ""}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between  pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                {currentStep < totalSteps ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerOnboardDialog;
