import { Link, useLocation } from "react-router-dom";
import { Home, User, Bookmark, Users, Settings } from "lucide-react";
import { useUserStore } from "@/store/stores/useUserStore";
import { cn } from "../lib/utils";

const Sidebar = () => {
  const { currentUser,following,followers } = useUserStore();
  const location = useLocation();

  if (!currentUser) return null;

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: User, label: "Profile", path: `/profile/${currentUser.username}` },
    { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
    { icon: Users, label: "Following", path: "/following" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-800/50 backdrop-blur-md border-r border-slate-700/50 p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50",
                isActive
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-300 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h3 className="text-sm font-semibold text-blue-400 mb-2">
          Quick Stats
        </h3>
        <div className="space-y-1 text-sm text-slate-300">
          <div>Following: {following.length}</div>
          <div>Followers: {followers.length}</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
