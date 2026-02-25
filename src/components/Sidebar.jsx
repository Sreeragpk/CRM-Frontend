// // src/components/Sidebar.jsx

// import { NavLink } from "react-router-dom";
// import {
//   HomeIcon,
//   BuildingOffice2Icon,
//   UserGroupIcon,
//   CurrencyDollarIcon,
//   ChartBarIcon,
//   Cog6ToothIcon,
//   CheckCircleIcon
// } from "@heroicons/react/24/outline";


// const navigation = [
//   { name: "Dashboard", to: "/", icon: HomeIcon },
//   { name: "Accounts", to: "/accounts", icon: BuildingOffice2Icon },
//   { name: "Contacts", to: "/contacts", icon: UserGroupIcon },
//   { name: "Deals", to: "/deals", icon: CurrencyDollarIcon },
//   { name: "Tasks", to: "/tasks", icon: CheckCircleIcon },
//   { name: "Pipeline", to: "/deals/pipeline", icon: ChartBarIcon },
// ];

// const Sidebar = ({ onClose }) => {
//   return (
//     <div className="flex flex-col h-full">
//       {/* Logo */}
//       <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
//         <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
//           <span className="text-white font-bold text-sm">CRM</span>
//         </div>
//         <span className="text-lg font-bold text-gray-900">
//           SalesCRM
//         </span>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
//         {navigation.map((item) => (
//           <NavLink
//             key={item.name}
//             to={item.to}
//             end={item.to === "/"}
//             onClick={onClose}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
//               transition-all duration-200 group ${
//                 isActive
//                   ? "bg-blue-50 text-blue-700 shadow-sm"
//                   : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//               }`
//             }
//           >
//             <item.icon
//               className={`w-5 h-5 transition-colors`}
//             />
//             {item.name}
//           </NavLink>
//         ))}
//       </nav>

//       {/* Footer */}
//       <div className="px-4 py-4 border-t border-gray-100">
//         <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400">
//           <Cog6ToothIcon className="w-4 h-4" />
//           <span>v1.0.0</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// src/components/Sidebar.jsx

import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice"
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  CheckSquare,
  GitBranch,
  Zap,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "Accounts",
    to: "/accounts",
    icon: Building2,
    badge: null,
  },
  {
    name: "Contacts",
    to: "/contacts",
    icon: Users,
    badge: null,
  },
  {
    name: "Deals",
    to: "/deals",
    icon: DollarSign,
    badge: null,
  },
  {
    name: "Tasks",
    to: "/tasks",
    icon: CheckSquare,
    badge: null,
  },
  {
    name: "Pipeline",
    to: "/deals/pipeline",
    icon: GitBranch,
    badge: null,
  },
];

const Sidebar = ({ onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Get user role display
  const getRoleDisplay = (role) => {
    if (!role) return "User";
    return role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ");
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-700 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sky-400/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-white rounded-xl blur-md opacity-20" />
              <div className="relative w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                <Zap className="w-6 h-6 text-blue-700 fill-blue-100" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white leading-none">
                SalesCRM
              </h1>
              <p className="text-[10px] font-semibold text-blue-200/60 uppercase tracking-[0.2em] mt-0.5">
                Pro Suite
              </p>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-6 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200/30">
            Navigation
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.name}
                to={item.to}
                end={item.to === "/"}
                onClick={onClose}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative block"
              >
                {/* Active bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-white rounded-r-full shadow-lg shadow-white/30" />
                )}

                <div
                  className={`
                    relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold
                    transition-all duration-300 ease-out mx-1
                    ${
                      isActive
                        ? "bg-white/15 text-white shadow-lg shadow-blue-900/20 backdrop-blur-sm"
                        : "text-blue-100/60 hover:text-white hover:bg-white/8"
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                      flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300
                      ${
                        isActive
                          ? "bg-white text-blue-700 shadow-md shadow-white/20"
                          : "bg-white/5 text-blue-200/50"
                      }
                    `}
                  >
                    <item.icon
                      className="w-[18px] h-[18px]"
                      strokeWidth={isActive ? 2.5 : 1.8}
                    />
                  </div>

                  {/* Label */}
                  <span className="flex-1">{item.name}</span>

                  {/* Badge */}
                  {item.badge && (
                    <span
                      className={`
                        inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-lg text-[10px] font-bold
                        transition-all duration-300
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white/8 text-blue-200/50"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Arrow */}
                  <ChevronRight
                    className={`
                      w-4 h-4 transition-all duration-300
                      ${
                        isActive
                          ? "text-white/50 opacity-100"
                          : "opacity-0 -translate-x-2"
                      }
                      ${hoveredItem === item.name && !isActive ? "opacity-40 translate-x-0" : ""}
                    `}
                  />
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="px-6 py-2">
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        {/* User Profile */}
        <div className="px-4 py-5">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/8 border border-white/8 hover:bg-white/12 hover:border-white/15 transition-all duration-300 group">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-300 to-indigo-400 flex items-center justify-center text-sm font-extrabold text-blue-900 shadow-lg shadow-sky-400/20">
                {getInitials(user?.name)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-[2.5px] border-blue-800 shadow-sm" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate leading-tight">
                {user?.name || "Guest User"}
              </p>
              <p className="text-[11px] text-blue-200/40 truncate mt-0.5">
                {user?.email || getRoleDisplay(user?.role)}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 hover:bg-red-500/30 flex items-center justify-center transition-colors duration-200">
                <LogOut className="w-4 h-4 text-blue-200/60 hover:text-red-300 transition-colors duration-200" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;