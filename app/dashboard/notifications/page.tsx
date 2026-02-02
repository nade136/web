"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseUser } from "@/lib/supabaseClient";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
};

export default function DashboardNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadNotifications = async () => {
      const { data: authData } = await supabaseUser.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) {
        setError("Please sign in to view notifications.");
        setIsLoading(false);
        return;
      }

      const { data, error: loadError } = await supabaseUser
        .from("notifications")
        .select("id,title,message,type,created_at,is_read")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (loadError) {
        setError(loadError.message);
      } else {
        setNotifications((data ?? []) as NotificationItem[]);
      }
      setIsLoading(false);
    };

    loadNotifications();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Notifications
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Alerts and updates for your account activity.
        </p>
      </div>

      <Card className="rounded-3xl border-slate-200/70 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#1a0f2b] dark:text-white dark:shadow-[0_18px_45px_rgba(4,10,22,0.6)]">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">
            All Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-400">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200/70 bg-rose-50 px-6 py-4 text-center text-sm text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
              {error}
            </div>
          ) : notifications.length ? (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50 px-5 py-4 text-sm text-slate-600 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        setDeletingId(item.id);
                        const { error: deleteError } = await supabaseUser
                          .from("notifications")
                          .delete()
                          .eq("id", item.id);
                        setDeletingId(null);
                        if (deleteError) {
                          setError(deleteError.message);
                          return;
                        }
                        setNotifications((prev) =>
                          prev.filter((row) => row.id !== item.id)
                        );
                        window.dispatchEvent(
                          new CustomEvent("notifications-updated")
                        );
                      }}
                      disabled={deletingId === item.id}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200/70 text-xs text-slate-500 transition hover:border-rose-200/70 hover:text-rose-400 dark:border-white/10 dark:text-slate-400 dark:hover:border-rose-500/30 dark:hover:text-rose-300"
                      aria-label="Delete notification"
                    >
                      {deletingId === item.id ? "…" : "×"}
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500 dark:border-white/10 dark:bg-[#0f1118] dark:text-slate-400">
              You do not have any notifications yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
