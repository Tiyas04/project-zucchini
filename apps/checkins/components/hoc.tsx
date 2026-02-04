import Footer from "./footer";
import { Navbar } from "./navbar";

export default function HOC({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-dvh flex flex-col bg-card">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">{children}</div>
      <Footer />
    </section>
  );
}
