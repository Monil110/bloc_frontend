"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, UserPlus } from "lucide-react";
import { useLeads } from "@/hooks/useLeads";
import { useCallers } from "@/hooks/useCallers";
import { ManualAssignModal } from "@/components/ui/ManualAssignModal";

import { Lead } from "@/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const statusColors: Record<string, string> = {
    new: "bg-primary/20 text-primary",
    contacted: "bg-secondary text-secondary-foreground",
    closed: "bg-success/20 text-success",
    unassigned: "bg-warning/20 text-warning",
    pending: "bg-destructive/20 text-destructive",
};

export default function LeadsPage() {
    const { leads, loading: leadsLoading } = useLeads();
    const { callers, loading: callersLoading } = useCallers();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const handleOpenAssign = (lead: Lead) => {
        setSelectedLead(lead);
        setIsAssignModalOpen(true);
    };

    const handleAssignSuccess = () => {
        setIsAssignModalOpen(false);
        setSelectedLead(null);
    };


    const filtered = leads.filter((lead: any) => {
        const matchSearch =
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search) ||
            lead.status.includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || lead.status === statusFilter;
        return matchSearch && matchStatus;
    });

    if (leadsLoading || callersLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-2xl font-bold text-foreground">Leads</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage and assign incoming leads</p>
            </motion.div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-muted/30 border-border"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40 bg-muted/30 border-border">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="unassigned">Unassigned</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lead</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">State</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Source</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">City</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Assigned To</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                                <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No leads found
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((lead: Lead, i: number) => {
                                    return (
                                        <motion.tr
                                            key={lead.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="border-b border-border/50 hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="p-4">
                                                <p className="text-sm font-medium text-foreground">{lead.name}</p>
                                                <p className="text-xs text-muted-foreground">{lead.phone}</p>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">{lead.state}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{lead.leadSource || "—"}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{lead.city || "—"}</td>
                                            <td className="p-4 text-sm text-muted-foreground">{lead.assignedCaller?.name || "—"}</td>
                                            <td className="p-4">
                                                <Badge variant="secondary" className={`${statusColors[lead.status] || "bg-muted text-muted-foreground"} border-0 text-xs capitalize`}>
                                                    {lead.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleOpenAssign(lead)}
                                                    className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors"
                                                >
                                                    <UserPlus className="w-3.5 h-3.5" />
                                                    {lead.assignedCallerId ? "Reassign" : "Assign"}
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            <ManualAssignModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onSuccess={handleAssignSuccess}
                lead={selectedLead}
                callers={callers}
            />
        </div>
    );
}
