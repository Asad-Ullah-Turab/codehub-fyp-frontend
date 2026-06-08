import { Outlet } from "react-router-dom";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function Layout() {
  return (
    <>
      <Header />
      <div className="h-[72px] md:h-[96px]" />
      <Outlet />
      <Footer />
    </>
  );
}
