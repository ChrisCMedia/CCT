import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMsg;
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || res.statusText;
    } catch {
      errorMsg = res.statusText || `HTTP-Fehler: ${res.status}`;
    }
    throw new Error(`${res.status}: ${errorMsg}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`Anfrage: ${method} ${url}`);
  
  const headers: HeadersInit = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Wichtig für Cookies
      mode: "cors", // CORS explizit aktivieren
    });
    
    console.log(`Antwort: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      await throwIfResNotOk(res);
    }
    
    return res;
  } catch (error) {
    console.error(`API Request Fehler: ${error}`);
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
        credentials: "include",
        mode: "cors",
      });
      
      console.log(`Antwort: ${res.status} ${res.statusText}`);

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
