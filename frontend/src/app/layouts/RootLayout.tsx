import { Outlet } from "react-router";
import { LanguageProvider } from "../context/LanguageContext";
import { ThemeProvider } from "../context/ThemeContext";
import { AuthBootstrap } from "../components/AuthBootstrap";
import { Toaster } from "../components/ui/sonner";

export function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="size-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <AuthBootstrap />
          <Outlet />
          <Toaster richColors closeButton />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}