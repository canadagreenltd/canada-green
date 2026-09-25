export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar / topbar — coming soon */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
