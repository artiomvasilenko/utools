import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Suspense, useState } from "react";
import SpinnerLoading from "./SpinnerLoading";
import YandexAds from "./YandexAds";
import CookiesModal from "./CookiesModal";

export default function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function toggleSidebar() {
    console.log("toggleSidebar");
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex min-h-screen">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4">
          <Suspense key={location.pathname} fallback={<SpinnerLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </main>
      <CookiesModal />
      <YandexAds />
      <Footer />
    </>
  );
}
