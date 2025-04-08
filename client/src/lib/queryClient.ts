import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMsg;
    let errorData;
    try {
      errorData = await res.json();
      errorMsg = errorData.message || res.statusText;
    } catch {
      errorMsg = res.statusText || `HTTP-Fehler: ${res.status}`;
    }
    const error = new Error(`${res.status}: ${errorMsg}`);
    (error as any).status = res.status;
    (error as any).data = errorData;
    throw error;
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    console.log(`API Request: ${method} ${endpoint}`);
    if (data) {
      console.log('Request data:', JSON.stringify(data).substring(0, 500) + (JSON.stringify(data).length > 500 ? '...' : ''));
    }
    
    const response = await fetch(endpoint, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
      credentials: 'include',
    });

    if (!response.ok && response.status !== 401) {
      console.error(`API Error (${response.status}): ${endpoint}`);
      try {
        const errorData = await response.clone().json();
        console.error('Error response:', errorData);
      } catch (e) {
        console.error('Failed to parse error response');
      }
    }

    return response;
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const url = queryKey[0] as string;
      console.log(`Abfrage: GET ${url}`);
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "include",
        mode: "cors",
      });
      
      console.log(`Antwort: ${res.status} ${res.statusText}`);
      console.log("Response Headers:", [...res.headers.entries()].map(([k, v]) => `${k}: ${v}`).join(", "));

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.error(`Query Fehler: ${error}`);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
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
