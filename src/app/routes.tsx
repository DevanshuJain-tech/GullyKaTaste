// Application routing configuration
import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { SignupPage } from './pages/SignupPage.tsx';
import { VendorDetailPage } from './pages/VendorDetailPage.tsx';
import { ReelsPage } from './pages/ReelsPage.tsx';
import { CommunityPage } from './pages/CommunityPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { SearchPage } from './pages/SearchPage.tsx';
import { FavoritesPage } from './pages/FavoritesPage.tsx';
import { NotificationsPage } from './pages/NotificationsPage.tsx';
import { HelpPage } from './pages/HelpPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { PrivacyPage } from './pages/PrivacyPage.tsx';
import { TermsPage } from './pages/TermsPage.tsx';
import { VendorDashboardPage } from './pages/VendorDashboardPage.tsx';
import { EditProfilePage } from './pages/EditProfilePage.tsx';
import { OnboardingPage } from './pages/OnboardingPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';
import { VendorOnboardingPage } from './pages/VendorOnboardingPage.tsx';
import { CreatePostPage } from './pages/CreatePostPage.tsx';
import { CreateReelPage } from './pages/CreateReelPage.tsx';
import { SavedAddressesPage } from './pages/SavedAddressesPage.tsx';
import { FavoriteVendorsPage } from './pages/FavoriteVendorsPage.tsx';
import { MyReviewsPage } from './pages/MyReviewsPage.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: OnboardingPage },
      { path: 'home', Component: HomePage },
      { path: 'login', Component: LoginPage },
      { path: 'signup', Component: SignupPage },
      { path: 'vendor/:id', Component: VendorDetailPage },
      { path: 'reels', Component: ReelsPage },
      { path: 'reels/create', Component: CreateReelPage },
      { path: 'community', Component: CommunityPage },
      { path: 'community/create', Component: CreatePostPage },
      { path: 'profile', Component: ProfilePage },
      { path: 'profile/edit', Component: EditProfilePage },
      { path: 'profile/addresses', Component: SavedAddressesPage },
      { path: 'profile/favorites', Component: FavoriteVendorsPage },
      { path: 'profile/reviews', Component: MyReviewsPage },
      { path: 'settings', Component: SettingsPage },
      { path: 'search', Component: SearchPage },
      { path: 'favorites', Component: FavoritesPage },
      { path: 'notifications', Component: NotificationsPage },
      { path: 'help', Component: HelpPage },
      { path: 'about', Component: AboutPage },
      { path: 'privacy', Component: PrivacyPage },
      { path: 'terms', Component: TermsPage },
      { path: 'vendor-dashboard', Component: VendorDashboardPage },
      { path: 'vendor-onboarding', Component: VendorOnboardingPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);
