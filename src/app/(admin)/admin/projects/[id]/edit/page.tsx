export default async function EditAdminProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        Edit Project {id} — coming soon
      </h1>
    </div>
  );
}
