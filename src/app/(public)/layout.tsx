import { AnnouncementTicker } from "@/components/shared/announcement-ticker";
import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { UtilityBar } from "@/components/public/utility-bar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-cream">
      <UtilityBar />
      <Navbar />
      <AnnouncementTicker />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
