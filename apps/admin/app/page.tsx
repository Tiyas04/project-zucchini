"use client";

import Link from "next/link";
import { Users, Gavel, TrendingUp, ArrowRight, CheckCircle, Clock, Share2 } from "lucide-react";
import { useNitrutsavStats, useMunStats, useReferralLeaderboard } from "@/lib/queries";

function DashboardCard({
  title,
  stats,
  href,
  icon: Icon,
  color,
}: {
  title: string;
  stats: { label: string; value: number }[];
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:border-zinc-700 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-3 ${color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { data: nitrutsavStats, isLoading: nitrutsavLoading } = useNitrutsavStats();
  const { data: munStats, isLoading: munLoading } = useMunStats();
  const { data: referralData, isLoading: referralLoading } = useReferralLeaderboard();

  const loading = nitrutsavLoading || munLoading || referralLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const totalRegistrations = (nitrutsavStats?.total || 0) + (munStats?.total || 0);
  const totalVerified = (nitrutsavStats?.verified || 0) + (munStats?.verified || 0);
  const totalPending = (nitrutsavStats?.pending || 0) + (munStats?.pending || 0);

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Overview of all registrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-linear-to-br from-blue-900/30 to-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-400" />
            <p className="text-sm text-zinc-400">Total Registrations</p>
          </div>
          <p className="text-4xl font-bold text-white">{totalRegistrations}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-linear-to-br from-emerald-900/30 to-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <p className="text-sm text-zinc-400">Payment Verified</p>
          </div>
          <p className="text-4xl font-bold text-white">{totalVerified}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-linear-to-br from-amber-900/30 to-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-zinc-400">Payment Pending</p>
          </div>
          <p className="text-4xl font-bold text-white">{totalPending}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {nitrutsavStats && (
          <DashboardCard
            title="NITRUTSAV"
            href="/nitrutsav"
            icon={Users}
            color="bg-blue-500/20 text-blue-400"
            stats={[
              { label: "Total", value: nitrutsavStats.total },
              { label: "NITR Students", value: nitrutsavStats.nitrStudents },
              { label: "Male", value: nitrutsavStats.male },
              { label: "Female", value: nitrutsavStats.female },
            ]}
          />
        )}
        {munStats && (
          <DashboardCard
            title="MUN"
            href="/mun"
            icon={Gavel}
            color="bg-purple-500/20 text-purple-400"
            stats={[
              { label: "Total", value: munStats.total },
              { label: "Teams", value: munStats.teams },
              { label: "Male", value: munStats.male },
              { label: "Female", value: munStats.female },
            ]}
          />
        )}
        {referralData && (
          <DashboardCard
            title="Referrals"
            href="/referrals"
            icon={Share2}
            color="bg-amber-500/20 text-amber-400"
            stats={[
              { label: "Total Referrals", value: referralData.totalReferrals },
              { label: "Active Referrers", value: referralData.totalReferrers },
            ]}
          />
        )}
      </div>
    </div>
  );
}
