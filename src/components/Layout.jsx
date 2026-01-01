import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { Suspense } from "react";
import SpinnerLoading from "./SpinnerLoading";
import YandexAds from "./YandexAds";

export default function Layout() {
  const location = useLocation();
  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        <main className="flex-1 p-16">
          <Suspense key={location.pathname} fallback={<SpinnerLoading />}>
            <Outlet />
          </Suspense>
        </main>
      </main>
      <YandexAds />
      <Footer />
    </>
  );
}
