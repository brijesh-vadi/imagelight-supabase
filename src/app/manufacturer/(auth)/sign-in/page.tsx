import ManufacturerSignInForm from "@/components/role/manufacturer/view/signin/ManufacturerSignInForm";

const ManufacturerSignInPage = () => {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h2 className="font-bold text-3xl text-foreground">Welcome Back</h2>
        <p className="mt-2 text-muted-foreground text-sm">
          Sign in to your manufacturer account
        </p>
      </div>

      <ManufacturerSignInForm />
    </div>
  );
};

export default ManufacturerSignInPage;
