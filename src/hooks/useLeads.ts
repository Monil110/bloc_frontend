'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import api from '@/lib/api';

export function useLeads() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                const res = await api.get('/leads');
                setLeads(res.data);
            } catch (err) {
                console.error('Error fetching leads:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();

        socket.on('lead:new', (data) => {
            setLeads((prev) => [data.lead, ...prev]);
        });

        socket.on('lead:updated', (updatedLead) => {
            setLeads((prev) =>
                prev.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead))
            );
        });

        return () => {
            socket.off('lead:new');
            socket.off('lead:updated');
        };
    }, []);

    return { leads, loading };
}
