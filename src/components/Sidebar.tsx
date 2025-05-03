import React, { useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon, UsersIcon, ClipboardListIcon, CreditCardIcon, PillIcon } from "lucide-react";

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`bg-[#6FA3D8] h-screen fixed top-0 left-0 ${collapsed ? "min-w-[80px]" : "min-w-[250px]"} py-6 px-4 transition-all duration-300`}
    >
      <div className="relative">
        <div className="flex items-center justify-between">
          {!collapsed && <h1 className="text-white font-bold text-2xl">CliniTech</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-6 top-1 h-6 w-6 p-[6px] cursor-pointer bg-[#A4C8E1] flex items-center justify-center rounded-full"
          >
            {collapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-white" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="overflow-auto py-6 h-full mt-4">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="text-Black font-semibold hover:text-white hover:bg-[#4C92D9] text-[16px] flex items-center rounded px-4 py-2 transition-all"
            >
              <UsersIcon className="w-5 h-5 mr-3" />
              {!collapsed && <span className="font-bold text-lg">View Users</span>}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-Black font-semibold hover:text-white hover:bg-[#4C92D9] text-[16px] flex items-center rounded px-4 py-2 transition-all"
            >
              <ClipboardListIcon className="w-5 h-5 mr-3" />
              {!collapsed && <span className="font-bold text-lg">Patient History</span>}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-Black font-semibold hover:text-white hover:bg-[#4C92D9] text-[16px] flex items-center rounded px-4 py-2 transition-all"
            >
              <CreditCardIcon className="w-5 h-5 mr-3" />
              {!collapsed && <span className="font-bold text-lg">Payment</span>}
            </a>
          </li>
          <li>
            <a
              href="#"
              className="text-Black font-semibold hover:text-white hover:bg-[#4C92D9] text-[16px] flex items-center rounded px-4 py-2 transition-all"
            >
              <PillIcon className="w-5 h-5 mr-3" />
              {!collapsed && <span className="font-bold text-lg">Drug Inventory</span>}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
