

## Project info: Sprint Flow Board

A Jira-style sprint clone board template 


Sprint Board UI: Kanban-style columns (Backlog, To Do, In Progress, Completed) with drag‑and‑drop support.

Task Progress: Dynamic progress bar showing completed vs. total tasks.

Priority Visualization: Bar chart of tasks by priority (High, Medium, Low).

Search & Filter: Full-text search, priority filter, and due‑date picker.

Data Persistence: Supabase backend for real‑time storage of tasks and user sessions.

Responsive Design: Mobile‑friendly layout powered by Tailwind CSS.

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

![Screenshot 2025-04-29 at 9 58 30 PM](https://github.com/user-attachments/assets/3ef3740a-bd1e-4e3b-9b54-26949499c2f7)
  

Prerequisites

Node.js v16.x or v18.x

npm, yarn, or pnpm

Git for source control

Supabase account and project credentials

(Optional) Supabase CLI for local emulation

Usage

Create a new task: Click New Task, fill in title, description, due date, and priority.

Move tasks: Drag cards between columns to update status.

Search & filter: Use the search bar, priority dropdown, or date picker to narrow down tasks.

View analytics: Check the progress bar and priority chart at the top.

Customization

Columns: Update column names or add new statuses in components/BoardColumn.tsx.

Styles: Modify Tailwind classes in JSX or update tailwind.config.js.

Data model: Adjust Supabase table schema (tasks table) to add fields.

Charts: Customize priority chart in components/PriorityChart.tsx using Chart.js props.


