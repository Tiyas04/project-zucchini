import { useMutation } from "@tanstack/react-query";
import { performCheckin, type CheckinRequest, type CheckinResponse } from "./api";

export function useCheckinMutation() {
  return useMutation<CheckinResponse, Error, CheckinRequest>({
    mutationFn: performCheckin,
  });
}
