'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import api from '@/lib/api';
import { Lead } from '@/types';

export function useLeads() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                setLeads(res.data.data || res.data || []);
            } catch (err) {

                console.error('Error fetching leads:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();

        socket.on('lead:new', (lead) => {
            setLeads((prev) => [lead, ...prev]);
        });

        socket.on('lead:updated', (updatedLead) => {
            setLeads((prev) =>
                prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
            );
        });

        socket.on('lead:unassigned', (lead) => {
            setLeads((prev) => [lead, ...prev]);
        });

        return () => {
            socket.off('lead:new');
            socket.off('lead:updated');
            socket.off('lead:unassigned');
        };
    }, []);

    return { leads, loading };
}
