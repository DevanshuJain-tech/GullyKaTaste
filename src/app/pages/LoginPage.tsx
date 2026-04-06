import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Chrome } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
export function LoginPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

useEffect(() => {
  if (isAuthenticated) {
    navigate("/home");
  }
}, [isAuthenticated]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] flex flex-col p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="self-start mb-8 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        ← {t("home")}
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div>
          <h1 className="text-4xl mb-2 text-[var(--text-primary)]">
            {t("welcomeBack")}
          </h1>

          <p className="text-[var(--text-secondary)] mb-8">
            {language === "en"
              ? "Continue with your account to explore amazing vendors"
              : "अद्भुत विक्रेताओं की खोज जारी रखने के लिए जारी रखें"}
          </p>

          <button
            type="button"
            onClick={() =>
              loginWithRedirect({
                appState: { returnTo: "/home" },
              })
            }
            disabled={isLoading}
            className="w-full bg-[var(--brand-orange)] text-white py-4 rounded-2xl font-semibold text-lg hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
          >
            <Chrome className="size-5" />
            {isLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          <p className="text-center text-[var(--text-secondary)] mt-6 text-sm">
            {language === "en"
              ? "Login to continue with the app"
              : "सुरक्षित लॉगिन"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
