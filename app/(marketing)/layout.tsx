import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyContactButtons from "@/components/StickyContactButtons";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <StickyContactButtons />
      <Footer />
    </>
  );
}
