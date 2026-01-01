import { useQuery } from "@tanstack/react-query";
import {
  fetchNitrutsavStats,
  fetchMunStats,
  fetchNitrutsavRegistrations,
  fetchMunTeams,
  fetchMunRegistrations,
  fetchReferralLeaderboard,
} from "./api";

export const queryKeys = {
  nitrutsavStats: ["nitrutsav", "stats"] as const,
  munStats: ["mun", "stats"] as const,
  nitrutsavRegistrations: ["nitrutsav", "registrations"] as const,
  munTeams: ["mun", "teams"] as const,
  munRegistrations: ["mun", "registrations"] as const,
  referralLeaderboard: ["referrals", "leaderboard"] as const,
};

export function useNitrutsavStats() {
  return useQuery({
    queryKey: queryKeys.nitrutsavStats,
    queryFn: fetchNitrutsavStats,
  });
}

export function useMunStats() {
  return useQuery({
    queryKey: queryKeys.munStats,
    queryFn: fetchMunStats,
  });
}

export function useNitrutsavRegistrations() {
  return useQuery({
    queryKey: queryKeys.nitrutsavRegistrations,
    queryFn: fetchNitrutsavRegistrations,
  });
}

export function useMunTeams() {
  return useQuery({
    queryKey: queryKeys.munTeams,
    queryFn: fetchMunTeams,
  });
}

export function useMunRegistrations() {
  return useQuery({
    queryKey: queryKeys.munRegistrations,
    queryFn: fetchMunRegistrations,
  });
}

export function useReferralLeaderboard() {
  return useQuery({
    queryKey: queryKeys.referralLeaderboard,
    queryFn: fetchReferralLeaderboard,
  });
}
