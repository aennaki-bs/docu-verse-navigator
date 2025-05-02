# DataTable Component

The DataTable component is a reusable table implementation with built-in support for:

- Pagination
- Row selection and bulk actions
- Customizable columns and actions
- Theme support (light/dark mode)
- Consistent styling across the application

## Basic Usage

```tsx
import { DataTable } from "@/components/table/DataTable";
import { Eye, Edit, Trash } from "lucide-react";

// Define your data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Sample data
const users: User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
];

// Define table columns
const columns = [
  { header: "Name", key: "name" },
  { header: "Email", key: "email" },
  { header: "Role", key: "role" },
  { header: "Actions", key: "actions", width: "w-24" },
];

// Define row actions
const actions = [
  {
    label: "View",
    icon: <Eye className="h-4 w-4 mr-2" />,
    onClick: (user) => console.log("View user", user),
    color: "blue",
  },
  {
    label: "Edit",
    icon: <Edit className="h-4 w-4 mr-2" />,
    onClick: (user) => console.log("Edit user", user),
    color: "amber",
  },
  {
    label: "Delete",
    icon: <Trash className="h-4 w-4 mr-2" />,
    onClick: (user) => console.log("Delete user", user),
    color: "red",
  },
];

// Define bulk actions
const bulkActions = [
  {
    label: "Delete Selected",
    icon: <Trash className="h-3.5 w-3.5 mr-1.5" />,
    onClick: (ids) => console.log("Delete users", ids),
    color: "red",
  },
];

// Render the table
function UserTable() {
  return (
    <DataTable<User>
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      actions={actions}
      bulkActions={bulkActions}
    />
  );
}
```

## Props

### `DataTable<T>` Component Props

| Prop           | Type                  | Required | Description                                           |
| -------------- | --------------------- | -------- | ----------------------------------------------------- |
| `data`         | `T[]`                 | Yes      | Array of data items to display in the table           |
| `columns`      | `Column<T>[]`         | Yes      | Array of column definitions                           |
| `getRowId`     | `(item: T) => number` | Yes      | Function to extract a unique ID from each item        |
| `actions`      | `Action<T>[]`         | No       | Array of actions to show in the actions dropdown      |
| `bulkActions`  | `BulkAction[]`        | No       | Array of bulk actions to show when items are selected |
| `isSimpleUser` | `boolean`             | No       | If true, hides certain actions for simple users       |

### `Column<T>` Interface

| Property | Type                     | Required | Description                                                                           |
| -------- | ------------------------ | -------- | ------------------------------------------------------------------------------------- |
| `header` | `string`                 | Yes      | Column header text                                                                    |
| `key`    | `keyof T \| "actions"`   | Yes      | Key of the data object to display in this column, or "actions" for the actions column |
| `cell`   | `(item: T) => ReactNode` | No       | Custom cell renderer                                                                  |
| `width`  | `string`                 | No       | CSS width class for the column                                                        |

### `Action<T>` Interface

| Property  | Type                                                                      | Required | Description                                                        |
| --------- | ------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| `label`   | `string`                                                                  | Yes      | Action label                                                       |
| `icon`    | `ReactNode`                                                               | Yes      | Icon to display next to the label                                  |
| `onClick` | `(item: T) => void`                                                       | Yes      | Function to call when the action is clicked                        |
| `color`   | `'blue' \| 'green' \| 'red' \| 'indigo' \| 'purple' \| 'amber' \| 'cyan'` | No       | Color scheme for the action                                        |
| `show`    | `(item: T) => boolean`                                                    | No       | Function to determine if this action should be shown for this item |

### `BulkAction` Interface

| Property  | Type                                                                      | Required | Description                                     |
| --------- | ------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| `label`   | `string`                                                                  | Yes      | Action label                                    |
| `icon`    | `ReactNode`                                                               | Yes      | Icon to display next to the label               |
| `onClick` | `(selectedIds: number[]) => void`                                         | Yes      | Function to call with the IDs of selected items |
| `color`   | `'blue' \| 'green' \| 'red' \| 'indigo' \| 'purple' \| 'amber' \| 'cyan'` | No       | Color scheme for the action                     |

## Custom Cell Rendering

You can customize how a cell is rendered by providing a `cell` function in the column definition:

```tsx
const columns = [
  {
    header: "Status",
    key: "status",
    cell: (item) => (
      <Badge
        variant={item.isActive ? "default" : "secondary"}
        className={
          item.isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-700"
        }
      >
        {item.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  // Other columns...
];
```

## Conditional Actions

You can conditionally show or hide actions based on the current item:

```tsx
const actions = [
  {
    label: "Edit",
    icon: <Edit className="h-4 w-4 mr-2" />,
    onClick: (user) => console.log("Edit user", user),
    color: "amber",
    show: (user) => user.role !== "Admin", // Only show edit for non-admin users
  },
];
```
