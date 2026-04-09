import { Outlet } from "react-router-dom";
// @NOTE: Components
import Tabs from "@/components/profile/Tabs";

export default function ProfileLayout() {
  return (
    <>
      <Tabs />
      <Outlet />
    </>
  )
}
