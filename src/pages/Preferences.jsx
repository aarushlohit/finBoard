import { useTheme } from "../context/ThemeContext";
import { SunMedium, MoonStar, Bell, BellOff, Palette, Target, PiggyBank, BarChart2 } from "lucide-react";
import { useState } from "react";

export default function Preferences() {
  const { theme, toggleTheme } = useTheme();

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("finboard-notifications");
    return saved ? JSON.parse(saved) : {
      budgetAlerts: true,
      weeklySummary: true,
      goalMilestones: false,
    };
  });

  const toggleNotification = (key) => {
    setNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem("finboard-notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const notificationItems = [
    {
      key: "budgetAlerts",
      label: "Budget Alerts",
      desc: "Get notified when you're close to your budget limit",
      icon: PiggyBank,
    },
    {
      key: "weeklySummary",
      label: "Weekly Summary",
      desc: "Receive a weekly overview of your financial activity",
      icon: BarChart2,
    },
    {
      key: "goalMilestones",
      label: "Goal Milestones",
      desc: "Celebrate when you hit a savings goal milestone",
      icon: Target,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">

      {/* Theme Section */}
      <div>
        <h3 className="text-xs font-semibold text-[var(--color-fin-muted)] mb-3 uppercase tracking-widest px-1">
          Appearance
        </h3>
        <div className="theme-card p-5">
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-[var(--color-fin-accent)]/10">
              <Palette size={18} className="text-[var(--color-fin-accent)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-[var(--color-fin-text)]">Theme</p>
              <p className="text-xs text-[var(--color-fin-muted)] mt-0.5">
                Currently using <span className="font-medium capitalize">{theme}</span> mode
              </p>
            </div>

            {/* Toggle Pills */}
            <div className="flex items-center gap-1 p-1 rounded-full border border-[var(--color-fin-border)] bg-[var(--color-fin-surface)]">
              <button
                onClick={() => theme === "dark" && toggleTheme()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${theme === "light"
                  ? "bg-[var(--color-fin-accent)] text-white shadow"
                  : "text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)]"
                  }`}
              >
                <SunMedium size={13} /> Light
              </button>
              <button
                onClick={() => theme === "light" && toggleTheme()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${theme === "dark"
                  ? "bg-[var(--color-fin-accent)] text-white shadow"
                  : "text-[var(--color-fin-muted)] hover:text-[var(--color-fin-text)]"
                  }`}
              >
                <MoonStar size={13} /> Dark
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div>
        <h3 className="text-xs font-semibold text-[var(--color-fin-muted)] mb-3 uppercase tracking-widest px-1">
          Notifications
        </h3>
        <div className="theme-card divide-y divide-[var(--color-fin-border)]">
          {notificationItems.map(({ key, label, desc, icon: Icon }) => {
            const enabled = notifications[key];
            return (
              <div key={key} className="flex items-center gap-4 px-5 py-4">
                <div className={`p-2 rounded-lg transition-colors ${enabled ? "bg-[var(--color-fin-accent)]/10" : "bg-[var(--color-fin-surface)]"}`}>
                  {enabled
                    ? <Icon size={15} className="text-[var(--color-fin-accent)]" />
                    : <BellOff size={15} className="text-[var(--color-fin-muted)]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-fin-text)]">{label}</p>
                  <p className="text-xs text-[var(--color-fin-muted)] mt-0.5">{desc}</p>
                </div>
                {/* Toggle Switch */}
                <button
                  onClick={() => toggleNotification(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${enabled ? "bg-[var(--color-fin-accent)]" : "bg-[var(--color-fin-border)]"
                    }`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${enabled ? "left-6" : "left-1"
                    }`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}