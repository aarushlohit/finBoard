import { useAuth } from "../context/useAuth";
import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";
import { supabase } from "../lib/supabaseClient";
import { User, Mail, Calendar, TrendingUp, TrendingDown, PiggyBank, Receipt, Pencil, Check, X, Camera, Download, LogOut, Target } from "lucide-react"; export default function Profile() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate(); const { transactions, currency } = useContext(DataContext);
    const fileInputRef = useRef(null);

    const defaultName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
    const [displayName, setDisplayName] = useState(defaultName);
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(displayName);
    const [saving, setSaving] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [budgetCount, setBudgetCount] = useState(0);
    const [goalsTotal, setGoalsTotal] = useState(0);
    const [goalsCompleted, setGoalsCompleted] = useState(0);

    const displayEmail = user?.email || "";
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
        : "N/A";
    const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    const income = transactions.filter(t => t.Amount > 0).reduce((s, t) => s + Number(t.Amount), 0);
    const expenses = transactions.filter(t => t.Amount < 0).reduce((s, t) => s + Math.abs(Number(t.Amount)), 0);
    const savings = income - expenses;
    const symbol = currency?.symbol || "₹";

    // Load existing avatar
    useEffect(() => {
        if (!user) return;
        const path = `${user.id}/avatar`;
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        if (data?.publicUrl) {
            // Check if avatar actually exists
            fetch(data.publicUrl, { method: "HEAD" })
                .then(res => { if (res.ok) setAvatarUrl(data.publicUrl); })
                .catch(() => { });
        }
    }, [user]);
    useEffect(() => {
        async function fetchCounts() {
            if (!user) return;

            const { data: budgetData } = await supabase
                .from('budgets')
                .select('category')
                .eq('user_id', user.id);
            if (budgetData) setBudgetCount(budgetData.length);

            const { data: goalsData } = await supabase
                .from('goals')
                .select('*')
                .eq('user_id', user.id);
            if (goalsData) {
                setGoalsTotal(goalsData.length);
                const completed = goalsData.filter(g => savings >= g.target).length; setGoalsCompleted(completed);
            }
        }
        fetchCounts();
    }, [user, income]);
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        setUploadingAvatar(true);
        const path = `${user.id}/avatar`;
        const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
        if (!error) {
            const { data } = supabase.storage.from("avatars").getPublicUrl(path);
            setAvatarUrl(data.publicUrl + "?t=" + Date.now());
        }
        setUploadingAvatar(false);
    };

    const handleSaveName = async () => {
        if (!editValue.trim()) return;
        setSaving(true);
        await supabase.auth.updateUser({ data: { full_name: editValue.trim() } });
        setDisplayName(editValue.trim());
        setEditing(false);
        setSaving(false);
    };

    const handleCancelEdit = () => {
        setEditValue(displayName);
        setEditing(false);
    };
    const handleExportCSV = () => {
        const headers = ["Date", "Description", "Amount", "Currency"];
        const rows = transactions.map(t => [
            t.Date,
            t.Description,
            t.Amount,
            currency?.code || "INR"
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(val => `"${val}"`).join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `finboard-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const stats = [
        { label: "Total Income", value: `${symbol}${income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-400/10 border border-emerald-400/20" },
        { label: "Total Expenses", value: `${symbol}${expenses.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, icon: TrendingDown, color: "text-red-400", bg: "bg-red-400/10 border border-red-400/20" },
        { label: "Total Savings", value: `${symbol}${savings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`, icon: PiggyBank, color: savings >= 0 ? "text-emerald-400" : "text-red-400", bg: savings >= 0 ? "bg-emerald-400/10 border border-emerald-400/20" : "bg-red-400/10 border border-red-400/20" },
        { label: "Transactions", value: transactions.length, icon: Receipt, color: "text-[var(--color-fin-accent)]", bg: "bg-[var(--color-fin-accent)]/10 border border-[var(--color-fin-accent)]/20" },
        { label: "Budgets Created", value: budgetCount, icon: PiggyBank, color: "text-blue-400", bg: "bg-blue-400/10 border border-blue-400/20" },
        { label: "Goals Created", value: goalsTotal, icon: Target, color: "text-purple-400", bg: "bg-purple-400/10 border border-purple-400/20" },
        { label: "Goals Completed", value: goalsCompleted, icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10 border border-emerald-400/20" },
    ];

    return (
        <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-8">

            {/* Profile Hero Card */}
            <div className="theme-card p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-20 opacity-20"
                    style={{ background: "linear-gradient(135deg, var(--color-fin-accent), transparent)" }} />

                <div className="relative flex items-center gap-5">
                    {/* Avatar with upload */}
                    <div className="relative shrink-0 group">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center text-2xl font-bold text-white"
                            style={{ background: "linear-gradient(135deg, var(--color-fin-accent), #f97316)" }}>
                            {avatarUrl
                                ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                                : initials}
                        </div>
                        {/* Upload overlay */}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingAvatar}
                            className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            {uploadingAvatar
                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <Camera size={18} className="text-white" />}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                    </div>

                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                        {/* Editable Name */}
                        {editing ? (
                            <div className="flex items-center gap-2">
                                <input
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    className="text-lg font-bold bg-transparent border-b border-[var(--color-fin-accent)] text-[var(--color-fin-text)] outline-none w-full"
                                    autoFocus
                                    onKeyDown={e => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") handleCancelEdit(); }}
                                />
                                <button onClick={handleSaveName} disabled={saving} className="p-1 rounded-lg bg-emerald-400/20 text-emerald-400 hover:bg-emerald-400/30">
                                    <Check size={15} />
                                </button>
                                <button onClick={handleCancelEdit} className="p-1 rounded-lg bg-red-400/20 text-red-400 hover:bg-red-400/30">
                                    <X size={15} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold text-[var(--color-fin-text)]">{displayName}</h2>
                                <button onClick={() => { setEditing(true); setEditValue(displayName); }}
                                    className="p-1 rounded-lg text-[var(--color-fin-muted)] hover:text-[var(--color-fin-accent)] hover:bg-[var(--color-fin-accent)]/10 transition-colors">
                                    <Pencil size={13} />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-sm text-[var(--color-fin-muted)]">
                            <Mail size={13} />
                            <span className="truncate">{displayEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--color-fin-muted)]">
                            <Calendar size={13} />
                            <span>Member since {memberSince}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Summary */}
            <div>
                <h3 className="text-xs font-semibold text-[var(--color-fin-muted)] mb-3 uppercase tracking-widest px-1">
                    Financial Summary
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {stats.map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className={`theme-card p-4 flex flex-col gap-3 ${bg}`}>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[var(--color-fin-muted)]">{label}</p>
                                <div className={`p-1.5 rounded-lg ${bg}`}>
                                    <Icon size={14} className={color} />
                                </div>
                            </div>
                            <p className={`text-xl font-bold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Account Info */}
            <div>
                <h3 className="text-xs font-semibold text-[var(--color-fin-muted)] mb-3 uppercase tracking-widest px-1">
                    Account Info
                </h3>
                <div className="theme-card divide-y divide-[var(--color-fin-border)]">
                    {[
                        { label: "Display Name", value: displayName, icon: User },
                        { label: "Email Address", value: displayEmail, icon: Mail },
                        { label: "Member Since", value: memberSince, icon: Calendar },
                    ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="flex items-center gap-4 px-5 py-4">
                            <div className="p-2 rounded-lg bg-[var(--color-fin-accent)]/10">
                                <Icon size={15} className="text-[var(--color-fin-accent)]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--color-fin-muted)]">{label}</p>
                                <p className="text-sm font-medium text-[var(--color-fin-text)] truncate">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Export Data */}
            <div>
                <h3 className="text-xs font-semibold text-[var(--color-fin-muted)] mb-3 uppercase tracking-widest px-1">
                    Data
                </h3>
                <div className="theme-card p-5">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-[var(--color-fin-accent)]/10">
                            <Download size={18} className="text-[var(--color-fin-accent)]" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--color-fin-text)]">Export Transactions</p>
                            <p className="text-xs text-[var(--color-fin-muted)] mt-0.5">Download all your transactions as a CSV file</p>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                            style={{ background: "linear-gradient(135deg, var(--color-fin-accent), #f97316)" }}
                        >
                            <Download size={13} />
                            Export
                        </button>
                    </div>
                </div>
            </div>
            {/* Danger Zone */}
            <div>
                <h3 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-widest px-1">
                    Danger Zone
                </h3>
                <div className="theme-card p-5 border border-red-400/20">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl bg-red-400/10">
                            <LogOut size={18} className="text-red-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-[var(--color-fin-text)]">Sign Out</p>
                            <p className="text-xs text-[var(--color-fin-muted)] mt-0.5">Sign out from your current session</p>
                        </div>
                        <button
                            onClick={async () => { await signOut(); navigate("/signin"); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
                        >
                            <LogOut size={13} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}