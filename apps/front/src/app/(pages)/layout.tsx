import { ReactNode } from "react";
import Footer from "@layouts/Footer";
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
