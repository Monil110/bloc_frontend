import React from 'react';
import AppSidebar from './AppSidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <main className="ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
