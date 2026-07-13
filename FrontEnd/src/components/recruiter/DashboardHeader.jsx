import {
  Bell,
  Search,
  UserCircle,
  CheckCheck,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

export default function DashboardHeader() {
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState([]);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const notificationRef = useRef(null);

  // ============================================================
  // Fetch Notifications
  // ============================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const { data } = await api.get(
        "/notification"
      );

      setNotifications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Notification error:",
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // ============================================================
  // Close Dropdown When Clicking Outside
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // Unread Count
  // ============================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.isRead
    ).length;

  // ============================================================
  // Open Notification Dropdown
  // ============================================================

  const toggleNotifications = () => {
    setShowNotifications(
      (previous) => !previous
    );

    if (!showNotifications) {
      fetchNotifications();
    }
  };

  // ============================================================
  // Mark One Notification as Read
  // ============================================================

  const markAsRead = async (
    notificationId
  ) => {
    try {
      await api.put(
        `/notification/${notificationId}/read`
      );

      setNotifications(
        (previousNotifications) =>
          previousNotifications.map(
            (notification) =>
              notification._id ===
              notificationId
                ? {
                    ...notification,
                    isRead: true,
                  }
                : notification
          )
      );
    } catch (error) {
      console.error(
        "Mark notification error:",
        error
      );
    }
  };

  // ============================================================
  // Mark All as Read
  // ============================================================

  const markAllAsRead = async () => {
    try {
      await api.put(
        "/notification/read-all"
      );

      setNotifications(
        (previousNotifications) =>
          previousNotifications.map(
            (notification) => ({
              ...notification,
              isRead: true,
            })
          )
      );
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error
      );
    }
  };

  // ============================================================
  // Notification Time
  // ============================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(
      date
    ).toLocaleString();
  };

  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-slate-700 px-8 py-6">

      {/* Left */}

      <div>
        <h1 className="text-4xl font-bold text-white">
          Recruiter Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back,{" "}
          {user?.name || "Recruiter"} 👋
        </p>
      </div>


      {/* Right */}

      <div className="flex items-center gap-4 flex-wrap">

        {/* Search */}

        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search jobs or applicants..."
            className="w-72 md:w-80 bg-[#111827] border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
          />
        </div>


        {/* Notification */}

        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            onClick={toggleNotifications}
            className="relative w-12 h-12 rounded-xl bg-[#111827] border border-slate-700 flex items-center justify-center hover:border-indigo-500 hover:bg-slate-800 transition"
          >
            <Bell
              size={20}
              className="text-slate-300"
            />

            {/* Unread Badge */}

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-6 h-6 px-1.5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-[#0f172a]">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>


          {/* Notification Dropdown */}

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-96 max-w-[90vw] bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden">

              {/* Dropdown Header */}

              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">

                <div>
                  <h3 className="text-lg font-bold text-white">
                    Notifications
                  </h3>

                  <p className="text-xs text-slate-400">
                    {unreadCount} unread
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    <CheckCheck size={17} />
                    Mark all read
                  </button>
                )}
              </div>


              {/* Notification List */}

              <div className="max-h-96 overflow-y-auto">

                {loading &&
                notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    Loading notifications...
                  </div>
                ) : notifications.length ===
                  0 ? (
                  <div className="p-8 text-center">
                    <Bell
                      size={35}
                      className="mx-auto text-slate-600 mb-3"
                    />

                    <p className="text-white font-semibold">
                      No Notifications
                    </p>

                    <p className="text-sm text-slate-400 mt-1">
                      New applications will
                      appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map(
                    (notification) => (
                      <button
                        key={
                          notification._id
                        }
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                        className={`w-full text-left px-5 py-4 border-b border-slate-800 hover:bg-slate-800 transition ${
                          !notification.isRead
                            ? "bg-indigo-500/10"
                            : ""
                        }`}
                      >
                        <div className="flex gap-3">

                          {/* Unread Indicator */}

                          <div className="pt-2">
                            <span
                              className={`block w-2.5 h-2.5 rounded-full ${
                                notification.isRead
                                  ? "bg-slate-600"
                                  : "bg-indigo-500"
                              }`}
                            />
                          </div>

                          <div className="flex-1">

                            <p className="text-white font-semibold">
                              {
                                notification.title
                              }
                            </p>

                            <p className="text-sm text-slate-400 mt-1">
                              {
                                notification.message
                              }
                            </p>

                            <p className="text-xs text-slate-500 mt-2">
                              {formatTime(
                                notification.createdAt
                              )}
                            </p>

                          </div>
                        </div>
                      </button>
                    )
                  )
                )}
              </div>
            </div>
          )}
        </div>


        {/* User */}

        <div className="flex items-center gap-3 bg-[#111827] border border-slate-700 rounded-xl px-4 py-2">

          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-600 to-blue-500 flex items-center justify-center">
            <UserCircle
              size={24}
              className="text-white"
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              {user?.name ||
                "Recruiter"}
            </p>

            <p className="text-xs text-slate-400">
              Recruiter
            </p>
          </div>

        </div>
      </div>
    </header>
  );
}