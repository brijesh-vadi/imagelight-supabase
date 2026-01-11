import PublicHeader from "@/components/role/public/shared/PublicHeader";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen">{children}</main>
    </>
  );
};

export default PublicLayout;
