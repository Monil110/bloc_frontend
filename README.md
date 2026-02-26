# Bloc Sales CRM Frontend

A premium, real-time Sales CRM dashboard built with Next.js, Tailwind CSS v4, and Socket.io. This application provides a high-performance interface for lead ingestion, sales team management, and automated lead assignment with manual overrides.

## Features

- **Real-Time Dashboard**: Live stats and activity feed powered by WebSockets.
- **Pure API Architecture**: No dummy data; all leads and callers are fetched from your PostgreSQL database (integrated via Google Sheets & n8n).
- **Dual Assignment System**:
  - **Automated**: Backend automatically assigns leads on ingestion based on state and caller capacity.
  - **Manual Override**: Managers can manually assign or reassign any lead directly from the UI.
- **Enhanced Lead Tracking**: Detailed leads table with Source, City, State, and real-time status updates.
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
- `leads/page.tsx`: Leads Page. Comprehensive table for tracking leads with Source, City, and Manual Reassignment capabilities.
- `callers/page.tsx`: Callers Page. Manages the sales team with status indicators and daily capacity tracking.

### `src/components` (UI System)
- `dashboard/StatsCard.tsx`: Reusable card for displaying KPIs with trends and icons.
- `ui/ManualAssignModal.tsx`: Interface for manually overriding lead assignments.
- `ui/CallerModal.tsx`: Form for adding or editing sales caller details.

### `src/hooks` (Data & Logic)
- `useLeads.ts`: Custom hook for fetching real-time lead data and handling WebSocket updates.
- `useCallers.ts`: Manages live caller statuses and capacity tracking.
- `useLiveFeed.ts`: Derives a human-readable activity feed from incoming system events.

### `src/types` (Type System)
- `index.ts`: Centralized TypeScript interfaces for `Lead` and `Caller`, replacing legacy mock data structures.

### `src/lib` (Utilities & Config)
- `api.ts`: Axios instance for secure API communication.
- `socket.ts`: Socket.io client for real-time synchronization.

## Tech Stack

- **Next.js 15**: App Router architecture.
- **Tailwind CSS v4**: Advanced CSS-first styling.
- **Framer Motion**: Smooth interface transitions and micro-interactions.
- **Socket.io Client**: Real-time synchronization with the Sales CRM backend.
- **Axios**: Promised-based HTTP client for API requests.

