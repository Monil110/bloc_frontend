"use client";

import { motion } from "framer-motion";
import { Users, UserPlus, Clock, CheckCircle, Activity, PhoneCall } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import { useLeads } from "@/hooks/useLeads";
import { useCallers } from "@/hooks/useCallers";
import { useLiveFeed, FeedItem } from "@/hooks/useLiveFeed";
import { Lead, Caller } from "@/types";

export default function Dashboard() {
  const { leads, loading: leadsLoading } = useLeads();
  const { callers, loading: callersLoading } = useCallers();
  const { feed } = useLiveFeed(leads, callers);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l: Lead) => l.status === "new").length;
  const pending = leads.filter((l: Lead) => l.status === "assigned").length;
  const closedLeads = leads.filter((l: Lead) => l.status === "closed");
  const closed = closedLeads.length;
  const totalRevenue = closedLeads.reduce((acc: number, curr: Lead) => acc + (curr.value || 0), 0);
  const activeCallers = callers.filter((c: Caller) => c.status !== "offline").length;

  const feedTypeColors: Record<string, string> = {
    new: "bg-primary",
    assigned: "bg-warning",
    closed: "bg-success",
    contacted: "text-secondary-foreground bg-secondary",
    qualified: "bg-primary/60",
  };

  if (leadsLoading || callersLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time sales pipeline overview</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard title="Total Leads" value={totalLeads} icon={Users} trend="Current pipeline" />
        <StatsCard title="New Leads" value={newLeads} icon={UserPlus} trend={`${newLeads > 0 ? 'Action required' : 'All caught up'}`} trendUp={newLeads > 0} />
        <StatsCard title="Pending Assignment" value={pending} icon={Clock} />
        <StatsCard title="Closed Deals" value={closed} icon={CheckCircle} trend={`₹${(totalRevenue / 1000).toFixed(1)}K revenue`} trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Feed */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Live Feed</h2>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow ml-auto" />
          </div>
          <div className="space-y-3">
            {feed.map((item: FeedItem, i: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className={`w-2 h-2 rounded-full ${feedTypeColors[item.type] || "bg-muted-foreground"}`} />
                <span className="text-sm text-foreground flex-1">{item.message}</span>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Callers */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <PhoneCall className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Active Callers</h2>
            <span className="ml-auto text-xs text-muted-foreground">{activeCallers}/{callers.length}</span>
          </div>
          <div className="space-y-3">
            {callers.map((caller: Caller, i: number) => (
              <motion.div
                key={caller.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {caller.name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{caller.name}</p>
                  <p className="text-xs text-muted-foreground">{(caller.leadsToday || 0)}/{(caller.dailyLimit || caller.dailyLeadLimit || 0)} leads</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${caller.status === "active" ? "bg-success" : caller.status === "busy" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
