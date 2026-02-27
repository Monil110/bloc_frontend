'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Caller } from "@/types";
import api from '@/lib/api';

interface CallerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    caller?: Caller;
}

export function CallerModal({ isOpen, onClose, onSuccess, caller }: CallerModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        languages: '',
        dailyLeadLimit: 60,
        assignedStates: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (caller) {
            setFormData({
                name: caller.name || '',
                role: caller.role || '',
                languages: caller.languages?.join(', ') || '',
                dailyLeadLimit: caller.dailyLeadLimit || 60,
                assignedStates: (caller.assignedStates || caller.states || []).join(', ') || '',
            });
        } else {
            setFormData({
                name: '',
                role: '',
                languages: '',
                dailyLeadLimit: 60,
                assignedStates: '',
            });
        }
    }, [caller, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
                assignedStates: formData.assignedStates.split(',').map((s) => s.trim()).filter(Boolean),
                dailyLeadLimit: Number(formData.dailyLeadLimit),
            };

            if (caller) {
                await api.put(`/callers/${caller.id}`, payload);
            } else {
                await api.post('/callers', payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error saving caller:', err);
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
                        className="relative w-full max-w-lg glass bg-background rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="text-xl font-bold">{caller ? 'Edit Caller' : 'Add New Caller'}</h3>
                            <button onClick={onClose} className="p-2 hover:bg-accent rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        placeholder="e.g. Senior Sales"
                                        className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted-foreground">Daily Lead Limit</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.dailyLeadLimit}
                                        onChange={(e) => setFormData({ ...formData, dailyLeadLimit: Number(e.target.value) })}
                                        className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Languages (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.languages}
                                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                                    placeholder="e.g. English, Hindi, Marathi"
                                    className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground">Assigned States (comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.assignedStates}
                                    onChange={(e) => setFormData({ ...formData, assignedStates: e.target.value })}
                                    placeholder="e.g. Maharashtra, Gujarat, Karnataka"
                                    className="w-full bg-accent/50 border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                                />
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
                                    disabled={loading}
                                    className="flex-1 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : caller ? 'Update Caller' : 'Create Caller'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
