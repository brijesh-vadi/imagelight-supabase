import ManufacturerSignUpForm from "@/components/role/manufacturer/view/signup/ManufacturerSignUpForm";

const ManufacturerSignUpPage = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="font-bold text-3xl text-foreground">Create Account</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Join ImageLight as a manufacturer
        </p>
      </div>

      <ManufacturerSignUpForm />
    </div>
  );
};

export default ManufacturerSignUpPage;
