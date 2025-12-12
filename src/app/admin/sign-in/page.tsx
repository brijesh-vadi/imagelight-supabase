import AdminSignInForm from "@/components/role/admin/view/signin/AdminSignInForm";

const AdminSignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-bold text-4xl text-foreground">Admin Portal</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to access the admin dashboard
          </p>
        </div>

        <AdminSignInForm />
      </div>
    </div>
  );
};

export default AdminSignInPage;
