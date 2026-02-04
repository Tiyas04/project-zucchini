"use client";

import { useMemo } from "react";
import { ClipboardCheck } from "lucide-react";
import Header from "@/components/header";
import { DataTable } from "@/components/ui/data-table/data-table";
import { checkinColumns, CheckinRow } from "@/components/ui/data-table/checkin-columns";
import { useCheckins } from "@/lib/queries";
import { StatCard } from "@/components/stat-card";

export default function CheckinsPage() {
  const { data, isLoading } = useCheckins();

  const checkins = useMemo(
    () => (data?.checkins || []) as unknown as CheckinRow[],
    [data?.checkins]
  );
  const stats = data?.stats;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        title="Check-ins"
        subtitle={stats ? `Total: ${stats.total} | NU: ${stats.nu} | MUN: ${stats.mun}` : undefined}
        Icon={ClipboardCheck}
      />

      <main className="mx-auto px-6 py-8">
        {stats && (
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Total Check-ins"
              value={stats.total}
              icon={ClipboardCheck}
              color="bg-blue-500/20 text-blue-400"
            />
            <StatCard
              title="NITRUTSAV"
              value={stats.nu}
              icon={ClipboardCheck}
              color="bg-emerald-500/20 text-emerald-400"
            />
            <StatCard
              title="MUN"
              value={stats.mun}
              icon={ClipboardCheck}
              color="bg-purple-500/20 text-purple-400"
            />
          </div>
        )}

        <DataTable
          columns={checkinColumns}
          data={checkins}
          exportable={true}
          exportFilename={`checkins-${new Date().toISOString().split("T")[0]}`}
        />
      </main>
    </div>
  );
}
