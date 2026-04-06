import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout.tsx";
import { ProtectedRoute } from "./components/ProtectedRoutes.tsx";

import { HomePage } from "./pages/HomePage.tsx";
import { LoginPage } from "./pages/LoginPage.tsx";
import { SignupPage } from "./pages/SignupPage.tsx";
import { VendorDetailPage } from "./pages/VendorDetailPage.tsx";
import { ReelsPage } from "./pages/ReelsPage.tsx";
import { CommunityPage } from "./pages/CommunityPage.tsx";
import { ProfilePage } from "./pages/ProfilePage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import { SearchPage } from "./pages/SearchPage.tsx";
import { FavoritesPage } from "./pages/FavoritesPage.tsx";
import { NotificationsPage } from "./pages/NotificationsPage.tsx";
import { HelpPage } from "./pages/HelpPage.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { PrivacyPage } from "./pages/PrivacyPage.tsx";
import { TermsPage } from "./pages/TermsPage.tsx";
import { VendorDashboardPage } from "./pages/VendorDashboardPage.tsx";
import { EditProfilePage } from "./pages/EditProfilePage.tsx";
import { OnboardingPage } from "./pages/OnboardingPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { VendorOnboardingPage } from "./pages/VendorOnboardingPage.tsx";
import { CreatePostPage } from "./pages/CreatePostPage.tsx";
import { CreateReelPage } from "./pages/CreateReelPage.tsx";
import { SavedAddressesPage } from "./pages/SavedAddressesPage.tsx";
import { FavoriteVendorsPage } from "./pages/FavoriteVendorsPage.tsx";
import { MyReviewsPage } from "./pages/MyReviewsPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: OnboardingPage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      {
        path: "home",
        Component: () => (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor/:id",
        Component: () => (
          <ProtectedRoute>
            <VendorDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reels",
        Component: () => (
          <ProtectedRoute>
            <ReelsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "reels/create",
        Component: () => (
          <ProtectedRoute>
            <CreateReelPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "community",
        Component: () => (
          <ProtectedRoute>
            <CommunityPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "community/create",
        Component: () => (
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        Component: () => (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/edit",
        Component: () => (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/addresses",
        Component: () => (
          <ProtectedRoute>
            <SavedAddressesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/favorites",
        Component: () => (
          <ProtectedRoute>
            <FavoriteVendorsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile/reviews",
        Component: () => (
          <ProtectedRoute>
            <MyReviewsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        Component: () => (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        Component: () => (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "favorites",
        Component: () => (
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        Component: () => (
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor-dashboard",
        Component: () => (
          <ProtectedRoute>
            <VendorDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vendor-onboarding",
        Component: () => (
          <ProtectedRoute>
            <VendorOnboardingPage />
          </ProtectedRoute>
        ),
      },
      { path: "help", Component: HelpPage },
      { path: "about", Component: AboutPage },
      { path: "privacy", Component: PrivacyPage },
      { path: "terms", Component: TermsPage },

      { path: "*", Component: NotFoundPage },
    ],
  },
]);
