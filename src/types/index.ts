export interface Lead {
    id: string;
    name: string;
    phone: string;
    state: string;
    city?: string;
    leadSource: string;
    status: "new" | "contacted" | "closed" | "unassigned" | "pending";
    assignedCallerId: string | null;
    assignedCaller?: { id: string; name: string; role: string } | null;
    createdAt: string;
    metadata?: any;
    timestamp?: string;
}

export interface Caller {
    id: string;
    name: string;
    role: string;
    languages: string[];
    dailyLeadLimit: number;
    assignedStates: string[];
    isActive: boolean;
    createdAt: string;
    todayLeadCount: number;
}
