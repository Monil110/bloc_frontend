'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import api from '@/lib/api';

export function useCallers() {
    const [callers, setCallers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCallers = async () => {
            try {
                const res = await api.get('/callers');
                setCallers(res.data.data || []);
            } catch (err) {
                console.error('Error fetching callers:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCallers();

        socket.on('caller:updated', (updatedCaller) => {
            setCallers((prev) =>
                prev.map((caller) => (caller.id === updatedCaller.id ? updatedCaller : caller))
            );
        });

        return () => {
            socket.off('caller:updated');
        };
    }, []);

    return { callers, loading, setCallers };
}
