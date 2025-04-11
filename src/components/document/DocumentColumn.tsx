
import { Document } from "@/models/document";

export interface DocumentColumn<TData> {
  accessorKey?: string;
  id?: string;
  header: string | ((props: { column: any }) => React.ReactNode);
  cell: (props: { row: { original: TData } }) => React.ReactNode;
}
