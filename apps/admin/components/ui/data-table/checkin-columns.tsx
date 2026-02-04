"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CheckinRow = {
  id: number;
  checkInBy: {
    name: string;
    phone: string;
  };
  regType: "nu" | "mun";
  timestamp: string;
  participant: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
};

export const checkinColumns: ColumnDef<CheckinRow>[] = [
  {
    accessorKey: "participant.id",
    header: "Reg ID",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-100">{row.original.participant.id}</span>
    ),
  },
  {
    accessorKey: "participant.name",
    header: "Participant Name",
    cell: ({ row }) => (
      <span className="font-medium text-zinc-100">{row.original.participant.name}</span>
    ),
  },
  {
    accessorKey: "participant.phone",
    header: "Participant Phone",
    cell: ({ row }) => (
      <span className="tabular-nums text-zinc-300">{row.original.participant.phone}</span>
    ),
  },
  {
    accessorKey: "regType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("regType") as string;
      return (
        <span
          className={`text-xs font-medium px-2 py-1 rounded uppercase ${
            type === "nu" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "checkInBy.name",
    header: "Checked In By",
    cell: ({ row }) => <span className="text-zinc-300">{row.original.checkInBy.name}</span>,
  },
  {
    accessorKey: "checkInBy.phone",
    header: "Operator Phone",
    cell: ({ row }) => (
      <span className="tabular-nums text-zinc-400">{row.original.checkInBy.phone}</span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-0 text-zinc-300 hover:text-white"
      >
        Time
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));
      return (
        <span className="text-zinc-400">
          {date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          })}{" "}
          {date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    },
  },
];
