export type NitrutsavStats = {
  total: number;
  male: number;
  female: number;
  verified: number;
  pending: number;
  nitrStudents: number;
};

export type MunStats = {
  total: number;
  male: number;
  female: number;
  verified: number;
  pending: number;
  teams: number;
};

export type NitrutsavRegistration = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  institute: string;
  university: string | null;
  rollNumber: string | null;
  referralCode: string | null;
  isNitrStudent: boolean;
  isVerified: boolean;
  isPaymentVerified: boolean;
  registeredAt: string;
};

export type TeamMember = {
  id: number;
  name: string;
  email: string;
  phone: string;
  gender: string;
  institute: string;
  city: string;
  state: string;
  isTeamLeader: boolean;
  studentType: string;
  committeeChoice: string;
  isNitrStudent: boolean;
  registeredAt: string;
};

export type Team = {
  teamId: string;
  committeeChoice: string;
  studentType: string;
  isPaymentVerified: boolean;
  paymentAmount: number;
  members: TeamMember[];
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return res.json();
}

export async function fetchNitrutsavStats(): Promise<NitrutsavStats> {
  const data = await fetchJson<{ success: boolean; data: { stats: NitrutsavStats } }>(
    "/api/registrations/nitrutsav?stats=true&pageSize=1"
  );
  return data.data.stats;
}

export async function fetchMunStats(): Promise<MunStats> {
  const data = await fetchJson<{ success: boolean; data: { stats: MunStats } }>(
    "/api/registrations/mun?stats=true&pageSize=1"
  );
  return data.data.stats;
}

export async function fetchNitrutsavRegistrations(): Promise<{
  registrations: NitrutsavRegistration[];
  stats: NitrutsavStats;
}> {
  const data = await fetchJson<{
    success: boolean;
    data: { registrations: NitrutsavRegistration[]; stats: NitrutsavStats };
  }>("/api/registrations/nitrutsav?stats=true&pageSize=300");
  return data.data;
}

export async function fetchMunTeams(): Promise<{ teams: Team[]; stats: MunStats }> {
  const data = await fetchJson<{
    success: boolean;
    data: { teams: Team[]; stats: MunStats };
  }>("/api/registrations/mun?stats=true&groupByTeam=true");
  return data.data;
}

export async function fetchMunRegistrations(): Promise<{
  registrations: TeamMember[];
  stats: MunStats;
}> {
  const data = await fetchJson<{
    success: boolean;
    data: { registrations: TeamMember[]; stats: MunStats };
  }>("/api/registrations/mun?stats=true&pageSize=300");
  return data.data;
}

export async function searchNitrutsavUsers(query: string): Promise<NitrutsavRegistration[]> {
  const data = await fetchJson<{
    success: boolean;
    data: { registrations: NitrutsavRegistration[] };
  }>(`/api/registrations/nitrutsav?search=${encodeURIComponent(query)}`);
  return data.data.registrations;
}

export async function searchMunUsers(query: string): Promise<TeamMember[]> {
  const data = await fetchJson<{
    success: boolean;
    data: { registrations: TeamMember[] };
  }>(`/api/registrations/mun?search=${encodeURIComponent(query)}`);
  return data.data.registrations;
}

// Referral types
export type ReferralLeaderboardEntry = {
  id: number;
  name: string;
  referralCode: string | null;
  referralCount: number;
};

export type ReferralLeaderboardData = {
  leaderboard: ReferralLeaderboardEntry[];
  totalReferrals: number;
  totalReferrers: number;
};

export async function fetchReferralLeaderboard(): Promise<ReferralLeaderboardData> {
  const data = await fetchJson<{
    success: boolean;
    data: ReferralLeaderboardData;
  }>("/api/registrations/referrals");
  return data.data;
}
