"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Users, Share2 } from "lucide-react";
import { useReferralLeaderboard } from "@/lib/queries";

export default function ReferralsPage() {
  const { data, isLoading, error } = useReferralLeaderboard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Failed to load referral data</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-white">Referral Leaderboard</h1>
        <p className="text-zinc-400 mt-1">Track referral performance</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-zinc-800 bg-linear-to-br from-purple-900/30 to-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-5 w-5 text-purple-400" />
            <p className="text-sm text-zinc-400">Total Referrals</p>
          </div>
          <p className="text-4xl font-bold text-white">{data?.totalReferrals || 0}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-linear-to-br from-amber-900/30 to-zinc-900 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Share2 className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-zinc-400">Active Referrers</p>
          </div>
          <p className="text-4xl font-bold text-white">{data?.totalReferrers || 0}</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Top Referrers</h2>
        </div>

        {data?.leaderboard && data.leaderboard.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  Referrals
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {data.leaderboard.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                        index === 0
                          ? "bg-amber-500/20 text-amber-400"
                          : index === 1
                            ? "bg-zinc-400/20 text-zinc-300"
                            : index === 2
                              ? "bg-orange-700/20 text-orange-400"
                              : "bg-zinc-700/50 text-zinc-400"
                      }`}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                    {entry.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="px-2 py-1 rounded bg-zinc-800 text-purple-400 text-sm font-mono">
                      {entry.referralCode || "N/A"}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-2xl font-bold text-white">{entry.referralCount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="px-6 py-12 text-center text-zinc-400">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No referrals yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Referrals will appear here once users start referring others
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
