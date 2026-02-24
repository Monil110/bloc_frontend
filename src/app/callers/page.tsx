'use client';

import React, { useState } from 'react';
import { useCallers } from '@/hooks/useCallers';
import { Plus, Edit2, Trash2, Shield, Languages, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CallerModal } from '@/components/ui/CallerModal';
import api from '@/lib/api';

export default function CallersPage() {
    const { callers, loading, setCallers } = useCallers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCaller, setSelectedCaller] = useState<any>(null);
    const [search, setSearch] = useState('');

    const handleEdit = (caller: any) => {
        setSelectedCaller(caller);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setSelectedCaller(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to deactivate this caller?')) {
            try {
                await api.delete(`/callers/${id}`);
                setCallers(prev => prev.map(c => c.id === id ? { ...c, isActive: false } : c));
            } catch (err) {
                console.error('Error deleting caller:', err);
            }
        }
    };

    const filteredCallers = callers.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.role.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Sales Callers</h2>
                    <p className="text-muted-foreground mt-1">Manage your team and their lead assignment rules.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Caller</span>
                </button>
            </div>

            <div className="flex items-center space-x-4 bg-accent/30 p-2 rounded-xl border border-border max-w-md">
                <Search className="w-5 h-5 ml-2 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Filter callers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent border-none outline-none py-2 text-sm w-full"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center py-20 text-muted-foreground">Loading callers data...</p>
                ) : filteredCallers.length === 0 ? (
                    <div className="col-span-full text-center py-20 glass rounded-2xl">
                        <p className="text-muted-foreground">No callers found matching your search.</p>
                    </div>
                ) : (
                    filteredCallers.map((caller, index) => (
                        <motion.div
                            key={caller.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={cn(
                                "glass rounded-2xl p-6 relative group transition-all duration-300",
                                !caller.isActive && "opacity-60 grayscale"
                            )}
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                        {caller.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{caller.name}</h3>
                                        <p className="text-sm text-muted-foreground">{caller.role}</p>
                                    </div>
                                </div>
                                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(caller)}
                                        className="p-2 hover:bg-accent rounded-lg text-primary transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(caller.id)}
                                        className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                                    <span className="flex-1">Lead Limit:</span>
                                    <span className="text-foreground font-medium">{caller.dailyLeadLimit} / day</span>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Languages className="w-4 h-4 mr-2 text-emerald-500" />
                                    <span className="flex-1">Languages:</span>
                                    <span className="text-foreground font-medium">{caller.languages?.join(', ') || 'None'}</span>
                                </div>
                                <div className="flex items-start text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-amber-500" />
                                    <span className="flex-1">Assigned States:</span>
                                    <span className="text-foreground font-medium text-right max-w-[150px]">
                                        {caller.assignedStates?.join(', ') || 'Global'}
                                    </span>
                                </div>
                            </div>

                            {!caller.isActive && (
                                <div className="absolute top-4 right-4 bg-destructive/20 text-destructive text-[10px] font-bold px-2 py-1 rounded">
                                    INACTIVE
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            <CallerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {/* Hook handles updates via Socket */ }}
                caller={selectedCaller}
            />
        </div>
    );
}
