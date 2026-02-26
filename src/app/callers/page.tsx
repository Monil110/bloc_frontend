"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MapPin, Globe, BarChart3, Plus } from "lucide-react";
import { useCallers } from "@/hooks/useCallers";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CallerModal } from "@/components/ui/CallerModal";
import { Caller } from "@/types";

const statusStyle: Record<string, string> = {
    active: "bg-success/20 text-success",
    busy: "bg-warning/20 text-warning",
    offline: "bg-muted text-muted-foreground",
};

export default function CallersPage() {
    const { callers, loading } = useCallers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCaller, setSelectedCaller] = useState<Caller | undefined>(undefined);

    const handleAddCaller = () => {
        setSelectedCaller(undefined);
        setIsModalOpen(true);
    };

    const handleEditCaller = (caller: Caller) => {
        setSelectedCaller(caller);
        setIsModalOpen(true);
    };

    const handleSuccess = () => {
        setIsModalOpen(false);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    if (!loading && callers.length === 0) {
        return (
            <div className="p-8 space-y-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Callers</h1>
                        <p className="text-muted-foreground text-sm mt-1">Manage your sales team</p>
                    </div>
                    <button
                        onClick={handleAddCaller}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-4 h-4" />
                        Add Caller
                    </button>
                </motion.div>
                <div className="text-center text-muted-foreground py-10">
                    No callers found. Click "Add Caller" to get started!
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Callers</h1>
                    <p className="text-muted-foreground text-sm mt-1">Manage your sales team</p>
                </div>
                <button
                    onClick={handleAddCaller}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Caller
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {callers.map((caller: any, i: number) => {
                    const dailyLimit = caller.dailyLimit || caller.dailyLeadLimit || 60;
                    const leadsToday = caller.leadsToday || 0;
                    const capacityPct = Math.min(100, Math.round((leadsToday / dailyLimit) * 100));

                    return (
                        <motion.div
                            key={caller.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            onClick={() => handleEditCaller(caller)}
                            className="glass glass-hover rounded-xl p-6 glow-primary cursor-pointer"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
                                    {caller.avatar || (caller.name ? caller.name[0] : "?")}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-base font-semibold text-foreground truncate">{caller.name}</h3>
                                        <Badge variant="secondary" className={`${statusStyle[caller.status] || "bg-muted text-muted-foreground"} border-0 text-xs capitalize`}>
                                            {caller.status}
                                        </Badge>
                                    </div>

                                    <div className="mt-4 space-y-3">
                                        <div>
                                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                                <span>Daily Capacity</span>
                                                <span>{leadsToday}/{dailyLimit}</span>
                                            </div>
                                            <Progress value={capacityPct} className="h-1.5" />
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <BarChart3 className="w-3.5 h-3.5" />
                                                {caller.closedDeals || 0} deals
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {(caller.states || caller.assignedStates)?.length || 0} states
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Globe className="w-3.5 h-3.5" />
                                                {caller.languages?.length || 0} langs
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {(caller.states || caller.assignedStates || []).slice(0, 3).map((state: string) => (
                                                <span key={state} className="px-2 py-0.5 rounded text-[10px] bg-muted/50 text-muted-foreground">
                                                    {state}
                                                </span>
                                            ))}
                                            {(caller.states || caller.assignedStates || []).length > 3 && (
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-muted/50 text-muted-foreground">
                                                    +{(caller.states || caller.assignedStates).length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <CallerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleSuccess}
                caller={selectedCaller}
            />
        </div>
    );
}
