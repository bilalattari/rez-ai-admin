import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../ui/mode-toggler";

const AppHeader = ({ selectedKey, items }) => {
  const activeTitle =
    items.find((item) => item.key === selectedKey)?.title || "Dashboard";
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="gap-1 px-4 lg:gap-2 lg:px-6 flex w-full items-center justify-between">
        <div className="flex items-center gap-1 lg:gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{activeTitle}</h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
};

export default AppHeader;
