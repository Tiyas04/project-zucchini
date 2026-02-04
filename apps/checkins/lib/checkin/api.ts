export interface CheckinRequest {
  userId: number;
  type: "nu" | "mun";
  checkInBy: {
    name: string;
    phone: string;
  };
  timestamp: string;
}

export interface ParticipantData {
  id: number;
  name: string;
  email: string;
  phone: string;
  idCard: string;
}

export interface CheckinSuccessResponse {
  success: true;
  participant: ParticipantData;
}

export interface CheckinErrorResponse {
  success: false;
  error: "not_found" | "not_verified" | "already_checked_in" | "validation_error" | "server_error";
  message: string;
}

export type CheckinResponse = CheckinSuccessResponse | CheckinErrorResponse;

export async function performCheckin(data: CheckinRequest): Promise<CheckinResponse> {
  const res = await fetch("/api/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
