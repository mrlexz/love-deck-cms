import { Clock, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import {
  logout,
  getRemainingLoginTime,
  formatRemainingTime,
} from "@/utils/auth";
import { Button } from "@/components/ui/button";
import { Menu } from "./Menu";

const Layout = () => {
  const [remainingTime, setRemainingTime] = useState<string>("");
  useEffect(() => {
    // Update remaining time
    const updateRemainingTime = () => {
      const remaining = getRemainingLoginTime();
      setRemainingTime(formatRemainingTime(remaining));
    };

    updateRemainingTime();
    // Update every minute
    const interval = setInterval(updateRemainingTime, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <header>
        <div className="flex justify-between mb-4">
          <Menu />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Phiên đăng nhập còn: {remainingTime}</span>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
                  logout();
                }
              }}
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
