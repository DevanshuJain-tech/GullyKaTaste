import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Chrome } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
export function SignupPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);
  const handleSignup = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
      appState: { returnTo: "/home" },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] flex flex-col p-6">
      <button
        onClick={() => navigate("/")}
        className="self-start mb-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      >
        ← {t("home")}
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div>
          <h1 className="text-4xl mb-2 text-[var(--text-primary)]">
            {t("welcome")}
          </h1>

          <p className="text-[var(--text-secondary)] mb-8">
            {language === "en"
              ? "Create your account to start discovering"
              : "खोज शुरू करने के लिए अपना खाता बनाएं"}
          </p>

          <button
            type="button"
            onClick={handleSignup}
            disabled={isLoading}
            className="w-full bg-[var(--brand-orange)] text-white py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Chrome className="size-5" />
            {isLoading ? "Redirecting..." : "Sign up"}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full mt-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] py-4 rounded-2xl border border-white/20 hover:opacity-80"
          >
            {t("alreadyHaveAccount")} → {t("login")}
          </button>

          <p className="text-center text-[var(--text-secondary)] mt-6 text-sm">
            {language === "en" ? "Secure signup " : "सुरक्षित साइनअप"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
