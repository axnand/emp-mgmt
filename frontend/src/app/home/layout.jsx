"use client";
import React, { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  School,
  Users,
  BookA,
  ArrowLeftRightIcon,
  Clipboard,
  LogOut,
  ChevronRight,
  File,
  Menu,
  Upload,
  Download, // added Menu for sidebar toggle
} from "lucide-react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { useUser } from "@/context/UserContext";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // New state for collapsible sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // State for toggling the Transfers subnav
  const [transfersOpen, setTransfersOpen] = useState(false);

  // Retrieve the logged-in user from localStorage on mount
  const { user, userRole } = useUser();
  console.log("User role:", userRole);
  console.log("User:", user);

  const schoolId = useMemo(() => {
    return userRole === "schoolAdmin" && user?.schoolId
      ? parseInt(user.schoolId, 10)
      : null;
  }, [userRole, user]);

  // Define navigation items for each role
  const navItemsByRole = {
    admin: [
      {
        title: "Dashboard",
        href: "/home/dashboard",
        icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      },
      {
        title: "School Status",
        href: "/home/school-status",
        icon: <School className="mr-2 h-5 w-5" />,
      },
      {
        title: "Transfers",
        href: "/home/transfers",
        icon: <ArrowLeftRightIcon className="mr-2 h-5 w-5" />,
      },
      {
        title: "Staff statement",
        href: "/home/staff-statement",
        icon: <File className="mr-2 h-5 w-5" />,
      },
      {
        title: "Logs",
        href: "/home/logs",
        icon: <Clipboard className="mr-2 h-5 w-5" />,
      },
    ],
    schoolAdmin: [
      {
        title: "Dashboard",
        href: "/home/dashboard",
        icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      },
      {
        title: "Employees",
        href: `/home/school-status/${schoolId}`,
        icon: <Users className="mr-2 h-5 w-5" />,
      },
      {
        title: "Attendance",
        href: "/home/attendance",
        icon: <BookA className="mr-2 h-5 w-5" />,
      },
      {
        title: "Transfers",
        icon: <ArrowLeftRightIcon className="mr-2 h-5 w-5" />,
        subNav: [
          {
            title: "Outgoing Transfers",
            href: "/home/transfers/outgoing",
            icon: <Upload className=" h-5 w-5" />,
          },
          {
            title: "Incoming Transfers",
            href: "/home/transfers/incoming",
            icon: <Download className=" h-5 w-5" />,
          },
        ],
      },
      {
        title: "Staff statement",
        href: "/home/staff-statement",
        icon: <File className="mr-2 h-5 w-5" />,
      },
      {
        title: "Logs",
        href: "/home/logs",
        icon: <Clipboard className="mr-2 h-5 w-5" />,
      },
    ],
    staff: [
      {
        title: "Dashboard",
        href: "/home/dashboard",
        icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
      },
    ],
  };

  // Get nav items based on the user's role
  const navItems = navItemsByRole[userRole] || [];

  // Update active tab based on pathname
  useEffect(() => {
    navItems.forEach((item) => {
      // Check for subnav items as well
      if (item.subNav) {
        item.subNav.forEach((sub) => {
          if (pathname.includes(sub.href.split("/").pop())) {
            setActiveTab(sub.title);
            setTransfersOpen(true);
          }
        });
      }
      const segment = item.href ? item.href.split("/").pop() : "";
      if (segment && pathname.includes(segment)) {
        setActiveTab(item.title);
      }
    });
    if (pathname.includes("login")) {
      setActiveTab("logout");
    }
  }, [pathname, navItems]);

  // Simulate a loading state on tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1200);
  };

  // Logout function clears user data and redirects to login
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`bg-[#fffdfd] shadow-black shadow-2xl text-[#6c6d6d] h-full py-4 transition-all duration-300 ${
          sidebarOpen ? "w-72 px-6" : "w-16 pl-3 px-2"
        }`}
      >
        <div className="">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <img
                src="/logo.svg"
                alt="Logo"
                className="transition-all w-40"
              />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-200"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <hr className="mb-4" />
          <div className="flex flex-col justify-between text-sm h-full">
            <ul className="space-y-3">
              {navItems.map((item) =>
                item.subNav && userRole === "schoolAdmin" ? (
                  <li key={item.title}>
                    <button
                      className={`flex items-center w-full justify-between hover:text-white transition py-3 px-3 rounded-md font-medium hover:bg-[#377DFF] ${
                        activeTab === item.title
                          ? "bg-[#377DFF] text-white"
                          : "text-[#6c6d6d]"
                      }`}
                      onClick={() => {
                        setActiveTab(item.title);
                        setTransfersOpen((prev) => !prev);
                      }}
                    >
                      <div className="flex items-center gap-x-3">
                        {item.icon}
                        {sidebarOpen && <span>{item.title}</span>}
                      </div>
                      {sidebarOpen && (
                        <ChevronRight
                          className={`h-5 w-5 transition-transform duration-300 ${
                            transfersOpen ? "rotate-90" : ""
                          }`}
                        />
                      )}
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: transfersOpen ? "110px" : "0px" }}
                    >
                      <ul
                        className={`my-2 gap-y-2 flex flex-col ${
                          sidebarOpen ? "pl-8" : ""
                        }`}
                      >
                        {item.subNav.map((sub) => (
                          <li key={sub.title}>
                            <Link
                              href={sub.href}
                              className={`flex items-center gap-x-3 hover:text-white transition py-3 px-3 rounded-md font-medium hover:bg-[#377DFF] ${
                                activeTab === sub.title
                                  ? "bg-[#377DFF] text-white"
                                  : "text-[#6c6d6d]"
                              }`}
                              onClick={() => handleTabClick(sub.title)}
                            >
                              {sub.icon && sub.icon}
                              {sidebarOpen && <span>{sub.title}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.title} className={`${sidebarOpen ? "" : "flex"}`}>
                    <Link
                      href={item.href}
                      className={`flex gap-x-3 items-center hover:text-white transition py-3 px-3 rounded-md font-medium hover:bg-[#377DFF] ${
                        activeTab === item.title
                          ? "bg-[#377DFF] text-white"
                          : "text-[#6c6d6d]"
                      }`}
                      onClick={() => handleTabClick(item.title)}
                    >
                      {item.icon}
                      {sidebarOpen && <span>{item.title}</span>}
                    </Link>
                  </li>
                )
              )}
            </ul>

            <div className="mt-3">
              <button
                onClick={handleLogout}
                className={`flex w-full gap-x-3 items-center hover:text-white transition py-3 px-3 rounded-md font-medium hover:bg-[#377DFF] ${
                  activeTab === "logout" ? "bg-[#377DFF] text-white" : "text-[#6c6d6d]"
                }`}
              >
                <LogOut className=" h-5 w-5" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-none">
          <TopBar />
        </div>
        <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="border-t-transparent border-[#377DFF] w-8 h-8 border-4 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
