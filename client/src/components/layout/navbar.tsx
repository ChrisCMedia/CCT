import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  CalendarDays, 
  CheckSquare, 
  Mail, 
  Home,
  LogOut 
} from "lucide-react";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/">
              <a className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ClientComm
              </a>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link href="/">
                <a className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                  <Home size={18} />
                  Dashboard
                </a>
              </Link>
              <Link href="/todos">
                <a className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                  <CheckSquare size={18} />
                  Todos
                </a>
              </Link>
              <Link href="/posts">
                <a className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                  <CalendarDays size={18} />
                  Posts
                </a>
              </Link>
              <Link href="/newsletter">
                <a className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary">
                  <Mail size={18} />
                  Newsletter
                </a>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.username}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
