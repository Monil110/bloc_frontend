export interface Lead {
    id: string;
    name: string;
    phone: string;
    email: string;
    state: string;
    status: "new" | "assigned" | "contacted" | "qualified" | "closed" | "lost";
    assignedTo: string | null;
    callerId?: string;
    createdAt: string;
    value: number;
}

export interface Caller {
    id: string;
    name: string;
    avatar: string;
    status: "active" | "busy" | "offline";
    dailyLimit: number;
    leadsToday: number;
    states: string[];
    languages: string[];
    closedDeals: number;
    role?: string;
    dailyLeadLimit?: number;
    assignedStates?: string[];
}

export const mockLeads: Lead[] = [
    { id: "L001", name: "Arjun Sharma", phone: "+91-98765-43210", email: "arjun@example.com", state: "Maharashtra", status: "new", assignedTo: null, createdAt: "2026-02-24T10:30:00Z", value: 45000 },
    { id: "L002", name: "Priya Patel", phone: "+91-87654-32109", email: "priya@example.com", state: "Gujarat", status: "assigned", assignedTo: "C001", createdAt: "2026-02-24T10:25:00Z", value: 72000 },
    { id: "L003", name: "Rahul Verma", phone: "+91-76543-21098", email: "rahul@example.com", state: "Delhi", status: "contacted", assignedTo: "C002", createdAt: "2026-02-24T10:20:00Z", value: 38000 },
    { id: "L004", name: "Sneha Reddy", phone: "+91-65432-10987", email: "sneha@example.com", state: "Karnataka", status: "qualified", assignedTo: "C001", createdAt: "2026-02-24T10:15:00Z", value: 95000 },
    { id: "L005", name: "Vikram Singh", phone: "+91-54321-09876", email: "vikram@example.com", state: "Rajasthan", status: "closed", assignedTo: "C003", createdAt: "2026-02-24T10:10:00Z", value: 120000 },
    { id: "L006", name: "Ananya Gupta", phone: "+91-43210-98765", email: "ananya@example.com", state: "Maharashtra", status: "new", assignedTo: null, createdAt: "2026-02-24T10:05:00Z", value: 55000 },
    { id: "L007", name: "Karthik Nair", phone: "+91-32109-87654", email: "karthik@example.com", state: "Kerala", status: "lost", assignedTo: "C002", createdAt: "2026-02-24T10:00:00Z", value: 0 },
    { id: "L008", name: "Meera Joshi", phone: "+91-21098-76543", email: "meera@example.com", state: "Pune", status: "assigned", assignedTo: "C003", createdAt: "2026-02-24T09:55:00Z", value: 67000 },
];

export const mockCallers: Caller[] = [
    { id: "C001", name: "Ravi Kumar", avatar: "RK", status: "active", dailyLimit: 25, leadsToday: 12, states: ["Maharashtra", "Gujarat"], languages: ["Hindi", "English", "Marathi"], closedDeals: 48 },
    { id: "C002", name: "Sanya Mishra", avatar: "SM", status: "busy", dailyLimit: 20, leadsToday: 19, states: ["Delhi", "UP", "Kerala"], languages: ["Hindi", "English", "Malayalam"], closedDeals: 62 },
    { id: "C003", name: "Amit Desai", avatar: "AD", status: "active", dailyLimit: 30, leadsToday: 8, states: ["Rajasthan", "Gujarat", "Pune"], languages: ["Hindi", "English", "Gujarati"], closedDeals: 35 },
    { id: "C004", name: "Pooja Rao", avatar: "PR", status: "offline", dailyLimit: 20, leadsToday: 0, states: ["Karnataka", "Tamil Nadu"], languages: ["English", "Kannada", "Tamil"], closedDeals: 27 },
];

export const liveFeedItems = [
    { id: 1, message: "New lead from Maharashtra — Arjun Sharma", time: "Just now", type: "new" as const },
    { id: 2, message: "Lead assigned to Ravi Kumar — Priya Patel", time: "2m ago", type: "assigned" as const },
    { id: 3, message: "Deal closed by Amit Desai — ₹1,20,000", time: "5m ago", type: "closed" as const },
    { id: 4, message: "Lead contacted — Rahul Verma", time: "8m ago", type: "contacted" as const },
    { id: 5, message: "New lead from Delhi — Vikram Singh", time: "12m ago", type: "new" as const },
    { id: 6, message: "Lead qualified — Sneha Reddy", time: "15m ago", type: "qualified" as const },
];
