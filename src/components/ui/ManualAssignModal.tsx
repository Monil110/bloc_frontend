'use client';

import React, { useState } from 'react';
import { X, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Lead, Caller } from '@/types';

interface ManualAssignModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lead: Lead | null;
    callers: Caller[];
}

export function ManualAssignModal({ isOpen, onClose, onSuccess, lead, callers }: ManualAssignModalProps) {
    const [selectedCallerId, setSelectedCallerId] = useState('');
    const [loading, setLoading] = useState(false);

    const isReassign = !!lead?.assignedCallerId;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCallerId || !lead) return;

        setLoading(true);
        try {
            await api.patch(`/leads/${lead.id}/assign`, { callerId: selectedCallerId });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error assigning lead:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md glass bg-background rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-xl font-bold">{isReassign ? 'Reassign Lead' : 'Assign Lead'}</h3>

                            <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-6 p-4 rounded-xl bg-accent/30 border border-border/50">
                                <p className="text-sm text-muted-foreground">Assigning Lead:</p>
                                <p className="font-bold text-lg">{lead?.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{lead?.phone} • {lead?.state}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Select Sales Caller</label>
                                    <div className="relative">
                                        <select
                                            required
                                            value={selectedCallerId}
                                            onChange={(e) => setSelectedCallerId(e.target.value)}
                                            className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary outline-none transition-all appearance-none text-foreground"
                                        >
                                            <option value="" disabled className="bg-background">Choose a caller...</option>
                                            {callers.filter(c => c.isActive).map(caller => (
                                                <option key={caller.id} value={caller.id} className="bg-background">
                                                    {caller.name} ({caller.role || 'Sales'})
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {callers.filter(c => c.isActive).length === 0 && (
                                        <p className="text-xs text-warning mt-1">No active callers available right now.</p>
                                    )}
                                </div>

                                <div className="pt-4 flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl border border-border font-semibold hover:bg-accent transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !selectedCallerId}
                                        className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2 shadow-lg shadow-primary/20"
                                    >
                                        <UserCheck className="w-5 h-5" />
                                        <span>{loading ? 'Assigning...' : isReassign ? 'Confirm Reassignment' : 'Confirm Assignment'}</span>
                                    </button>

                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
