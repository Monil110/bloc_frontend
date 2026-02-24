# Bloc Sales CRM Frontend

A premium, real-time Sales CRM dashboard built with Next.js, Tailwind CSS v4, and Socket.io. This application provides a high-performance interface for lead ingestion, sales team management, and automated lead assignment.

## Features

- **Real-Time Dashboard**: Live stats and activity feed powered by WebSockets.
- **Lead Management**: Filterable list of leads with state-based sorting.
- **Caller Management**: Track sales caller performance, capacity, and assigned states.
- **Glassmorphism Design**: Sleek, modern dark-themed UI with subtle animations and glows.

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Project Structure

### `src/app` (Next.js App Router)
- `page.tsx`: The Dashboard. Displays real-time metrics (Total Leads, Revenue, Active Callers) and a live activity feed.
- `leads/page.tsx`: Leads Page. A comprehensive table for searching, filtering, and assigning leads.
- `callers/page.tsx`: Callers Page. Manages the sales team with status indicators and daily capacity tracking.
- `layout.tsx`: The root layout that wraps all pages with the AppSidebar.
- `globals.css`: Contains the Tailwind v4 @theme configuration and custom glassmorphism utilities (`.glass`, `.glow-primary`).

### `src/components` (UI System)
- `dashboard/StatsCard.tsx`: Reusable card for displaying key performance indicators with trends and icons.
- `layout/AppSidebar.tsx`: The primary navigation bar with route-aware active states.
- `layout/AppLayout.tsx`: Orchestrates the main layout structure (Sidebar + Scrollable Content).
- `ui/`: Modular, low-level components like Badge, Input, Progress, Select, and the CallerModal.

### `src/hooks` (Data & Logic)
- `useLeads.ts`: Custom hook for fetching leads and subscribing to real-time `lead:new` events.
- `useCallers.ts`: Manages caller data and real-time status updates via WebSockets.
- `useLiveFeed.ts`: Custom logic that derives a human-readable activity feed from incoming lead and caller updates.

### `src/lib` (Utilities & Config)
- `api.ts`: Centralized Axios instance for HTTP requests to the backend.
- `socket.ts`: Socket.io client configuration for real-time bidirectional communication.
- `mockData.ts`: Defines core TypeScript interfaces (Lead, Caller) and provides fallback mock data for development.
- `utils.ts`: Helper functions like `cn` for conditional Tailwind class merging.

## Tech Stack

- **Next.js 15**: App Router architecture.
- **Tailwind CSS v4**: Advanced CSS-first styling.
- **Framer Motion**: Smooth interface transitions and micro-interactions.
- **Lucide React**: Premium icon set.
- **Socket.io Client**: Real-time synchronization.
