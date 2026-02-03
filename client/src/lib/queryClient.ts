import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Static data mapping - API routes to JSON files
const staticDataMap: Record<string, string> = {
  "/api/tours": "/data/tours.json",
  "/api/testimonials": "/data/testimonials.json",
  "/api/testimonials/featured": "/data/testimonials.json",
};

// Static query function for fetching JSON data
export const getQueryFn: <T>(options: {
  on401?: "returnNull" | "throw";
}) => QueryFunction<T> =
  () =>
  async ({ queryKey }) => {
    const apiPath = queryKey.join("/") as string;
    const jsonPath = staticDataMap[apiPath];

    if (jsonPath) {
      const res = await fetch(jsonPath);
      if (!res.ok) {
        throw new Error(`Failed to load ${jsonPath}`);
      }
      const data = await res.json();

      // Handle featured testimonials filter
      if (apiPath === "/api/testimonials/featured") {
        return data.filter((t: any) => t.isFeatured && t.isApproved);
      }

      return data;
    }

    // Handle dynamic departures routes: /api/tours/{slug}/departures
    const departureMatcher = apiPath.match(/^\/api\/tours\/([^/]+)\/departures$/);
    if (departureMatcher) {
      const slug = departureMatcher[1];
      try {
        const res = await fetch("/data/departures.json");
        if (!res.ok) {
          throw new Error("Failed to load departures data");
        }
        const allDepartures = await res.json();
        return allDepartures[slug] || [];
      } catch (error) {
        console.error(`Failed to load departures for tour ${slug}:`, error);
        return [];
      }
    }

    // Fallback for non-mapped routes (shouldn't happen in static site)
    throw new Error(`No static data available for ${apiPath}`);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({}),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Legacy apiRequest kept for compatibility (will show toast for form submissions)
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // In static mode, this won't actually work - forms should use Google Form
  console.warn("API request attempted in static mode:", method, url);
  throw new Error("This is a static website. Please use the contact form or WhatsApp.");
}
