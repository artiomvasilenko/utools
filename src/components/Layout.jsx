import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="flex">
        <Sidebar />
        <main className="flex-1 p-16">
          <Outlet />
        </main>
      </main>
      <Footer />
    </>
  );
}
