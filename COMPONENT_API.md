# Component API Documentation

## KanbanBoard

Main orchestrator component for the Kanban board.

### Props
```typescript
interface KanbanBoardProps {
  initialTasks: Task[];
}
```

### State
- `tasks`: Task[] - All tasks
- `isModalOpen`: boolean - Modal visibility state
- `selectedColumn`: TaskStatus - Currently selected column for adding task

### Features
- Renders 4 columns with tasks organized by status
- Handles task creation via modal
- Automatically updates task list on new task addition

### Usage
```tsx
<KanbanBoard initialTasks={DUMMY_TASKS} />
```

---

## TaskColumn

Displays a single column with its tasks.

### Props
```typescript
interface TaskColumnProps {
  title: string;              // Column title (e.g., "To Do")
  tasks: Task[];              // Tasks to display in column
  onAddTask: () => void;      // Callback when + button is clicked
}
```

### Features
- Shows task count badge
- Add task button in header
- Scrollable area for overflow
- Empty state message

### Usage
```tsx
<TaskColumn
  title="To Do"
  tasks={todoTasks}
  onAddTask={() => handleAddTask()}
/>
```

---

## TaskCard

Displays a single task card.

### Props
```typescript
interface TaskCardProps {
  task: Task;  // The task to display
}
```

### Features
- Shows task title (clipped to 2 lines)
- Shows task description (clipped to 2 lines)
- Priority badge with color coding
- Assignee avatars with initials
- Hover effects and grab cursor for drag preparation

### Usage
```tsx
<TaskCard task={task} />
```

---

## AddTaskModal

Modal form for creating new tasks.

### Props
```typescript
interface AddTaskModalProps {
  isOpen: boolean;                          // Modal visibility
  onClose: () => void;                      // Close callback
  onAddTask: (task: TaskInput) => void;     // Add task callback
  defaultStatus?: TaskStatus;               // Pre-selected status
}
```

### Form Fields
1. **Title** (required, text input)
   - Min: 1 character
   - Placeholder: "Enter task title"

2. **Description** (optional, textarea)
   - Rows: 3
   - Placeholder: "Enter task description"

3. **Status** (select dropdown)
   - Options: To Do, In Progress, Ready, Production
   - Default: Pre-selected from defaultStatus prop

4. **Priority** (select dropdown)
   - Options: Low, Medium, High, Urgent
   - Default: Medium

5. **Assignees** (checkbox list)
   - Multiple selection
   - Scrollable if many items
   - Lists all team members from DUMMY_ASSIGNEES

### Callbacks

**onAddTask** receives:
```typescript
{
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
}
```

### Usage
```tsx
<AddTaskModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onAddTask={handleAddTask}
  defaultStatus="todo"
/>
```

---

## Type Definitions

### Task
```typescript
interface Task {
  id: string;                    // Unique identifier
  title: string;                 // Task title
  description: string;           // Task description
  status: TaskStatus;            // Current status
  priority: TaskPriority;        // Priority level
  assignees: string[];           // Assigned team members
  createdAt: Date;              // Creation timestamp
}
```

### TaskStatus
```typescript
type TaskStatus = "todo" | "in-progress" | "ready" | "production";
```

### TaskPriority
```typescript
type TaskPriority = "low" | "medium" | "high" | "urgent";
```

### TaskInput (for new tasks)
```typescript
interface TaskInput {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[];
}
```

---

## Styling Reference

### Priority Badge Colors
- **Low**: `bg-blue-100 text-blue-800`
- **Medium**: `bg-yellow-100 text-yellow-800`
- **High**: `bg-orange-100 text-orange-800`
- **Urgent**: `bg-red-100 text-red-800`

### Layout
- **Main Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` (4 columns on desktop)
- **Column Height**: Responsive with scroll
- **Column Gap**: `gap-6`
- **Task Gap**: `gap-3`

### Responsive Breakpoints
- **Mobile**: 1 column
- **Tablet (md)**: 2 columns
- **Desktop (lg)**: 4 columns

---

## State Management Pattern

The app uses local React state (`useState`) for:
- Tasks list
- Modal visibility
- Selected column for adding task

For future enhancements:
- Consider using Redux/Zustand for complex state
- Add localStorage persistence
- Implement API calls for backend sync

---

## Constants

### Task Statuses
```typescript
const statusLabels: Record<TaskStatus, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "ready": "Ready",
  "production": "Production",
};
```

### Priority Levels
```typescript
const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};
```

### Team Members
```typescript
const DUMMY_ASSIGNEES = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "Tom Brown",
  "Alex Chen",
  "Emma Davis",
  "Chris Lee",
];
```

---

## Performance Considerations

1. **Memoization**: TaskColumn and TaskCard can be wrapped with `memo()` if needed
2. **Virtual Scrolling**: For 100+ tasks, consider `react-window`
3. **Filtering**: Tasks are filtered by status on each render - efficient for current data size
4. **Event Handlers**: `useCallback` used in KanbanBoard to prevent unnecessary re-renders

---

## Accessibility Features

- ✅ Semantic HTML (buttons, form elements)
- ✅ Proper form labels
- ✅ Focus management
- ✅ ARIA titles on avatars showing full assignee name
- ✅ Keyboard navigation support
- ✅ Color-coded badges for clarity

---

## Extension Points

### Adding Filters
```tsx
<KanbanBoard 
  initialTasks={DUMMY_TASKS} 
  filters={{ priority: 'high' }}
/>
```

### Adding Drag & Drop
Wrap TaskColumn in `@dnd-kit` droppable zones and TaskCard in draggable zones.

### Adding Database
Replace dummy tasks with API calls:
```tsx
const [tasks, setTasks] = useState<Task[]>([]);

useEffect(() => {
  fetchTasks().then(setTasks);
}, []);
```

### Adding Persistence
Add localStorage sync:
```tsx
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);
```

---

## Troubleshooting

### Modal doesn't open
- Check `isModalOpen` state
- Verify `onAddTask` callback is passed

### Tasks not showing
- Check task status matches column id
- Verify tasks array is populated
- Check browser console for errors

### Styling issues
- Ensure Tailwind CSS is properly configured
- Check `tailwind.config.js` is present
- Rebuild after changes: `npm run dev`

### TypeScript errors
- Run `npm run lint` to check
- Ensure all types are properly imported
- Check `tsconfig.json` configuration
