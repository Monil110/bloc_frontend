'use client';

import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import { Lead, Caller } from '@/lib/mockData';

export interface FeedItem {
    id: string;
    message: string;
    time: string;
    type: 'new' | 'assigned' | 'closed' | 'contacted' | 'qualified';
}

export function useLiveFeed(initialLeads: Lead[], callers: Caller[]) {
    const [feed, setFeed] = useState<FeedItem[]>([]);

    useEffect(() => {
        // Generate initial feed from existing leads
        const initialFeed: FeedItem[] = initialLeads
            .slice(0, 5)
            .map((lead) => {
                const caller = callers.find(c => c.id === lead.assignedTo || c.id === lead.callerId);
                let message = `New lead from ${lead.state || 'Unknown'} — ${lead.name}`;
                let type: FeedItem['type'] = 'new';

                if (lead.status === 'closed') {
                    message = `Deal closed ${caller ? `by ${caller.name}` : ''} — ${lead.name}`;
                    type = 'closed';
                } else if (lead.status === 'assigned' || lead.assignedTo) {
                    message = `Lead assigned ${caller ? `to ${caller.name}` : ''} — ${lead.name}`;
                    type = 'assigned';
                } else if (lead.status === 'contacted') {
                    message = `Lead contacted — ${lead.name}`;
                    type = 'contacted';
                }

                return {
                    id: `init-${lead.id}`,
                    message,
                    time: new Date(lead.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    type
                };
            });

        setFeed(initialFeed);
    }, [initialLeads.length, callers.length]);

    useEffect(() => {
        const handleNewLead = (data: { lead: Lead }) => {
            const newItem: FeedItem = {
                id: `new-${data.lead.id}-${Date.now()}`,
                message: `New lead from ${data.lead.state || 'Unknown'} — ${data.lead.name}`,
                time: "Just now",
                type: 'new'
            };
            setFeed(prev => [newItem, ...prev].slice(0, 10));
        };

        const handleUpdateLead = (lead: Lead) => {
            let message = "";
            let type: FeedItem['type'] = 'new';

            if (lead.status === 'closed') {
                message = `Deal closed — ${lead.name}`;
                type = 'closed';
            } else if (lead.status === 'assigned' || lead.assignedTo) {
                const caller = callers.find(c => c.id === lead.assignedTo || c.id === lead.callerId);
                message = `Lead assigned ${caller ? `to ${caller.name}` : ''} — ${lead.name}`;
                type = 'assigned';
            } else if (lead.status === 'contacted') {
                message = `Lead contacted — ${lead.name}`;
                type = 'contacted';
            }

            if (message) {
                const newItem: FeedItem = {
                    id: `upd-${lead.id}-${Date.now()}`,
                    message,
                    time: "Just now",
                    type
                };
                setFeed(prev => [newItem, ...prev].slice(0, 10));
            }
        };

        socket.on('lead:new', handleNewLead);
        socket.on('lead:updated', handleUpdateLead);

        return () => {
            socket.off('lead:new');
            socket.off('lead:updated');
        };
    }, [callers]);

    return { feed };
}
