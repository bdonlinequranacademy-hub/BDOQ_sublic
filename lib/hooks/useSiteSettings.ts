import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: () =>
      apiFetch<{ data: { isTeacherApplicationOpen: boolean } }>("/public/site-settings", {
        cache: "no-store"
      }).then(
        (res) => res.data
      ),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
}
