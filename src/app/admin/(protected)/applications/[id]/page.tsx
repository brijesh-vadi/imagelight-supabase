import ApplicationDetailsView from "@/components/role/admin/view/applications/ApplicationDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: Props) => {
  const { id } = await params;

  return <ApplicationDetailsView id={id} />;
};

export default page;
