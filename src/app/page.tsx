'use client';

import React from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useCallers } from '@/hooks/useCallers';
import {
  TrendingUp,
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { leads, loading: leadsLoading } = useLeads();
  const { callers, loading: callersLoading } = useCallers();

  const stats = [
    {
      label: 'Total Leads',
      value: leads.length,
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'New Leads',
      value: leads.filter(l => l.status === 'new').length,
      icon: UserPlus,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Pending Assignment',
      value: leads.filter(l => l.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      label: 'Closed Deals',
      value: leads.filter(l => l.status === 'closed').length,
      icon: CheckCircle2,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Real-time overview of your sales performance.</p>
        </div>
        <div className="flex items-center space-x-2 bg-accent/50 px-4 py-2 rounded-lg border border-border">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium">Live System</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={cn("inline-flex p-3 rounded-xl mb-4 transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <h3 className="text-muted-foreground text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <stat.icon className="w-24 h-24" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-2xl flex flex-col h-[500px]">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-semibold">Live Lead Feed</h3>
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">RECENT</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {leadsLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in zoom-in duration-500">
                <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                <p>No leads recorded yet.</p>
              </div>
            ) : (
              leads.slice(0, 10).map((lead, idx) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent/30 border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-bold">{lead.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.phone} • {lead.state || 'Unknown State'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                      lead.status === 'new' ? 'bg-emerald-500/20 text-emerald-500' :
                        lead.status === 'pending' ? 'bg-amber-500/20 text-amber-500' :
                          'bg-blue-500/20 text-blue-500'
                    )}>
                      {lead.status}
                    </span>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="glass rounded-2xl flex flex-col h-[500px]">
          <div className="p-6 border-b border-border">
            <h3 className="text-xl font-semibold">Active Callers</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {callersLoading ? (
              <p className="text-center text-muted-foreground mt-4">Loading callers...</p>
            ) : (
              callers.filter(c => c.isActive).map((caller) => (
                <div key={caller.id} className="p-4 rounded-xl bg-accent/20 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{caller.name}</p>
                    <span className="text-[10px] text-muted-foreground">{caller.role}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Lead Limit</span>
                      <span>{caller.dailyLeadLimit || 60}</span>
                    </div>
                    <div className="w-full bg-accent/50 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: '45%' }} // Placeholder progress
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
