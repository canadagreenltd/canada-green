export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Admin shell — coming soon */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
