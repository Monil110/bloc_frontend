'use client';

import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
    return (
        <header className="h-16 glass border-b border-border flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
            <div className="flex items-center flex-1 max-w-md bg-accent/50 rounded-full px-4 py-2 border border-border">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search leads, callers..."
                    className="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder:text-muted-foreground"
                />
            </div>

            <div className="flex items-center space-x-6">
                <div className="relative">
                    <Bell className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-background" />
                </div>

                <div className="flex items-center space-x-3 pl-6 border-l border-border">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                </div>
            </div>
        </header>
    );
}
