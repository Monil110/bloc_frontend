export interface AssignmentHistory {
    id: string;
    leadId: string;
    callerId: string | null;
    assignedBy: string;
    prevCallerId: string | null;
    timestamp: string;
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    state: string | null;
    city?: string | null;
    leadSource: string;
    status: "new" | "contacted" | "closed" | "unassigned" | "pending";
    assignedCallerId: string | null;
    assignedTo?: string | null; // legacy fallback
    callerId?: string | null;   // legacy fallback
    assignedCaller?: { id: string; name: string; role: string } | null;
    createdAt: string;
    metadata?: any;
    timestamp?: string;
    value?: number; // for revenue calculation
    assignmentHistory?: AssignmentHistory[];
}

export interface Caller {
    id: string;
    name: string;
    role: string;
    languages: string[];
    dailyLeadLimit: number;
    assignedStates: string[];
    states?: string[]; // legacy fallback
    isActive: boolean;
    createdAt: string;
    status?: "active" | "busy" | "offline"; // computed/virtual field
    todayLeadCount: number;
}
