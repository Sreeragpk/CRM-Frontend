import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { socket } from "../socket";

import {
  fetchNotifications,
  markAsRead,
  addNotification,
  markAllAsReadLocal,
} from "../features/notifications/notificationSlice";

dayjs.extend(relativeTime);

const NotificationBell = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const { items } = useSelector((s) => s.notifications);

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("ALL");

  const unread = items.filter((n) => !n.isRead).length;

  // 🔄 Initial load
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // ⚡ Realtime
  useEffect(() => {
    socket.on("new_notification", (data) => {
      dispatch(addNotification(data));
      toast.success(data.title);
    });

    return () => socket.off("new_notification");
  }, [dispatch]);

  // ❌ Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 📅 Group notifications
  const today = [];
  const earlier = [];

  items.forEach((n) => {
    const isToday = dayjs(n.createdAt).isSame(dayjs(), "day");
    if (tab === "UNREAD" && n.isRead) return;

    isToday ? today.push(n) : earlier.push(n);
  });

  const handleNavigation = (n) => {
    switch (n.type) {
      case "TASK":
        navigate(`/tasks/${n.recordId}/edit`);
        break;
      default:
        navigate("/");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 Bell */}
      <Bell
        className="w-6 h-6 text-gray-600 cursor-pointer"
        onClick={() => setOpen(!open)}
      />

      {/* 🔴 Badge */}
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
          {unread}
        </span>
      )}

      {open && (
        <div className="absolute right-0 mt-3 w-96 bg-white shadow-2xl rounded-xl border z-50 animate-in fade-in slide-in-from-top-2">

          {/* HEADER */}
          <div className="sticky top-0 bg-white z-10 border-b px-4 py-3">

            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>

              {unread > 0 && (
                <button
                  onClick={() => {
                    dispatch(markAllAsReadLocal());
                    items.forEach((n) => dispatch(markAsRead(n.id)));
                  }}
                  className="text-xs text-blue-600 flex gap-1 items-center"
                >
                  <CheckCheck size={14} />
                  Mark all as read
                </button>
              )}
            </div>

            {/* TABS */}
            <div className="flex gap-4 mt-3 text-sm">
              <button
                onClick={() => setTab("ALL")}
                className={tab === "ALL" ? "font-semibold text-blue-600" : "text-gray-500"}
              >
                All
              </button>

              <button
                onClick={() => setTab("UNREAD")}
                className={tab === "UNREAD" ? "font-semibold text-blue-600" : "text-gray-500"}
              >
                Unread
              </button>
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-96 overflow-y-auto">

            {today.length > 0 && (
              <>
                <p className="px-4 py-2 text-xs text-gray-400">Today</p>
                {today.map((n) => (
                  <Item key={n.id} n={n} />
                ))}
              </>
            )}

            {earlier.length > 0 && (
              <>
                <p className="px-4 py-2 text-xs text-gray-400">Earlier</p>
                {earlier.map((n) => (
                  <Item key={n.id} n={n} />
                ))}
              </>
            )}

            {today.length === 0 && earlier.length === 0 && (
              <div className="p-10 text-center text-gray-400 text-sm">
                🔔 No notifications
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-2 border-t text-center">
            <button
              onClick={() => navigate("/notifications")}
              className="text-sm text-blue-600 hover:underline"
            >
              View all
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function Item({ n }) {
    return (
      <div
        onClick={() => {
          dispatch(markAsRead(n.id));
          console.log("Notification clicked:", n);
          handleNavigation(n);
          setOpen(false);
        }}
        className={`px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition ${
          !n.isRead && "bg-blue-50"
        }`}
      >
        <p className="text-sm font-medium">{n.title}</p>
        <p className="text-xs text-gray-500">{n.message}</p>
        <p className="text-[11px] text-gray-400 mt-1">
          {dayjs(n.createdAt).fromNow()}
        </p>
      </div>
    );
  }
};

export default NotificationBell;