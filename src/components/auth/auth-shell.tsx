import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Brand } from "@/components/shared/brand";

interface AuthShellProps {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
}

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <div className="hero-surface flex min-h-screen flex-col bg-background">
      <div className="px-4 py-6 sm:px-6">
        <Brand />
      </div>
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="mt-6">{children}</div>
          <div className="mt-6 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            {footer}
          </div>
        </div>
      </main>
      <footer className="px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        <Link to="/" className="transition-colors hover:text-foreground">
          Back to surveyflow.app
        </Link>
      </footer>
    </div>
  );
}