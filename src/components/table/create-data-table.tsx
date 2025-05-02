import { ReactNode } from "react";
import { DataTable, Column, Action, BulkAction } from "./DataTable";

/**
 * Creates a pre-typed DataTable component for a specific data type.
 * This avoids issues with TypeScript generics in JSX.
 */
export function createDataTable<T extends object>() {
  return function TypedDataTable({
    data,
    columns,
    getRowId,
    actions = [],
    bulkActions = [],
    isSimpleUser = false,
  }: {
    data: T[];
    columns: Column<T>[];
    getRowId: (item: T) => number;
    actions?: Action<T>[];
    bulkActions?: BulkAction[];
    isSimpleUser?: boolean;
  }) {
    return (
      <DataTable
        data={data}
        columns={columns}
        getRowId={getRowId}
        actions={actions}
        bulkActions={bulkActions}
        isSimpleUser={isSimpleUser}
      />
    );
  };
}
