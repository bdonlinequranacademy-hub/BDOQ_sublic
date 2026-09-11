import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () =>
      apiFetch<{ data: { isTeacherApplicationOpen: boolean } }>("/site-settings").then(
        (res) => res.data
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
