import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

export const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: 1,
    onError: (error) => {
      console.error("Fehler beim Laden des Benutzers:", error);
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Login-Versuch:", credentials.username);
      try {
        const res = await apiRequest("POST", "/api/login", credentials);
        const userData = await res.json();
        console.log("Login erfolgreich:", userData);
        return userData;
      } catch (error) {
        console.error("Login fehlgeschlagen:", error);
        throw error;
      }
    },
    onSuccess: (user: SelectUser) => {
      console.log("Login-Benutzer in Query-Cache gesetzt");
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Login erfolgreich",
        description: `Willkommen zurück, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Login-Mutation Fehler:", error);
      toast({
        title: "Login fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      console.log("Registrierungsversuch:", credentials.username);
      try {
        const res = await apiRequest("POST", "/api/register", credentials);
        const userData = await res.json();
        console.log("Registrierung erfolgreich:", userData);
        return userData;
      } catch (error) {
        console.error("Registrierung fehlgeschlagen:", error);
        throw error;
      }
    },
    onSuccess: (user: SelectUser) => {
      console.log("Registrierter Benutzer in Query-Cache gesetzt");
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Registrierung erfolgreich",
        description: `Willkommen, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Registrierungs-Mutation Fehler:", error);
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Logout-Versuch");
      await apiRequest("POST", "/api/logout");
      console.log("Logout erfolgreich");
    },
    onSuccess: () => {
      console.log("Benutzer aus Query-Cache entfernt");
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout erfolgreich",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
    },
    onError: (error: Error) => {
      console.error("Logout-Fehler:", error);
      toast({
        title: "Logout fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
