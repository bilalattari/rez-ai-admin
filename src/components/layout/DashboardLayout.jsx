import { Outlet, useLocation } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; // ✅ Import SidebarProvider
import { BookUser, LayoutDashboard, Megaphone , ShieldQuestion  , CookingPot , Check  } from "lucide-react";
import { useEffect, useState } from "react";

const items = [
  { key: 1, title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { key: 2, title: "Users", url: "/users", icon: BookUser },
  { key: 3, title: "Recipes", url: "/recipes", icon: CookingPot },
  { key: 4, title: "Questions", url: "/questions", icon: ShieldQuestion },
  { key: 5, title: "Answers", url: "/answers", icon: Check },
];

const DashboardLayout = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(1); // Default to 1 (Dashboard)

  useEffect(() => {
    const activeItem = items.find((item) => item.url === location.pathname);
    if (activeItem) setSelectedKey(activeItem.key);
  }, [location.pathname]);
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar selectedKey={selectedKey} items={items} />
        <SidebarInset>
          <AppHeader selectedKey={selectedKey} items={items} />
          <div className="w-full flex-1 py-4 md:py-6">
            <Outlet />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
