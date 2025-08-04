import AdminHeader from "@/components/shared/AdminHeader";
import Footer from "@/components/shared/Footer";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminHeader />
      {children}
      <Footer />
    </div>
  );
};

export default RootLayout;
