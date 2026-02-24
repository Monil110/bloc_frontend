'use client';

import React, { useState } from 'react';
import { useLeads } from '@/hooks/useLeads';
import { useCallers } from '@/hooks/useCallers';
import {
    Search,
    Filter,
    UserPlus,
    MapPin,
    Calendar,
    Phone,
    MoreVertical,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ManualAssignModal } from '@/components/ui/ManualAssignModal';

export default function LeadsPage() {
    const { leads, loading: leadsLoading } = useLeads();
    const { callers } = useCallers();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search);
        const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleManualAssign = (lead: any) => {
        setSelectedLead(lead);
        setIsAssignModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Manage Leads</h2>
                    <p className="text-muted-foreground mt-1">View and track all incoming leads in real-time.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex items-center space-x-4 bg-accent/30 px-4 py-2 rounded-xl border border-border">
                    <Search className="w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent border-none outline-none py-1 text-sm w-full"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none bg-accent/30 border border-border rounded-xl px-4 py-2.5 pr-10 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-primary transition-all"
                        >
                            <option value="all">All Status</option>
                            <option value="new">New</option>
                            <option value="assigned">Assigned</option>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-border/50">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-accent/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                <th className="px-6 py-4">Lead Info</th>
                                <th className="px-6 py-4">State</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {leadsLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">
                                        Fetching records...
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground">
                                        No leads found.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead, idx) => (
                                    <motion.tr
                                        key={lead.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-accent/20 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                    {lead.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm">{lead.name}</p>
                                                    <div className="flex items-center text-xs text-muted-foreground space-x-2">
                                                        <Phone className="w-3 h-3" />
                                                        <span>{lead.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm">
                                                <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                                                {lead.state || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {lead.leadSource || 'Meta Ads'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {lead.assignedCaller ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                    <span className="text-sm font-medium">{lead.assignedCaller.name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs italic text-muted-foreground">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider",
                                                lead.status === 'new' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                                                    lead.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                                        'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                            )}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-[10px]">
                                                <span className="text-foreground font-medium">
                                                    {new Date(lead.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleManualAssign(lead)}
                                                className="p-2 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-all"
                                                title="Manual Assign"
                                            >
                                                <UserPlus className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ManualAssignModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onSuccess={() => {/* Hook handles real-time update */ }}
                lead={selectedLead}
                callers={callers}
            />
        </div>
    );
}
