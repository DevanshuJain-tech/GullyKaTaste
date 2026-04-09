import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

export interface ApiPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface UserProfile {
  id: number;
  auth0_sub: string;
  email: string | null;
  full_name: string | null;
  picture: string | null;
  phone: string | null;
  role: "user" | "vendor" | "admin";
  created_at: string;
  updated_at: string;
}

export interface MePayload {
  user: UserProfile;
  vendor: {
    id: string;
    stall_name: string;
    status: "draft" | "submitted" | "approved" | "rejected";
    created_at: string;
    updated_at: string;
  } | null;
  stats: {
    favorites_count: number;
    reviews_count: number;
  };
}

export interface VendorSummary {
  id: string;
  name: string;
  image: string | null;
  distance: number | null;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  tags: string[];
  isOpen: boolean;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  hours: string | null;
  status: string;
  isFavorite?: boolean;
}

export interface VendorReview {
  id: string;
  userName: string;
  userAvatar: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  date: string;
}

export interface VendorMenuItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  available: boolean;
}

export interface VendorDetail {
  id: string;
  owner_user_id: string;
  name: string;
  description: string | null;
  tags: string[];
  phone: string | null;
  open_time: string | null;
  close_time: string | null;
  hours: string | null;
  status: "draft" | "submitted" | "approved" | "rejected";
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  isOpen: boolean;
  isVeg: boolean;
  rating: number;
  reviewCount: number;
  image: string | null;
  images: string[];
  photos: Array<{ id: string; url: string; sort_order: number }>;
  menu: VendorMenuItem[];
  reviews: VendorReview[];
  isFavorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewListItem {
  id: string;
  vendorId: string;
  vendorName?: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

export interface FeedPost {
  id: string;
  content: string;
  location_text: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
  user: {
    name: string;
    avatar: string | null;
  };
  media: Array<{ id: string; url: string; type: "image" | "video" }>;
  comments_count: number;
  likes_count: number;
}

export interface PostComment {
  id: string;
  post_id: string;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

export interface ReelItem {
  id: string;
  vendorId: string | null;
  vendorName: string;
  user: {
    name: string;
    avatar: string | null;
  };
  videoUrl: string;
  thumbnailUrl: string | null;
  description: string | null;
  created_at: string;
  comments_count: number;
  likes_count: number;
}

export interface ReelComment {
  id: string;
  reel_id: string;
  comment: string;
  created_at: string;
  user: {
    name: string;
    avatar: string | null;
  };
}

export interface AddressItem {
  id: string;
  type: "home" | "work" | "other";
  label: string;
  address_text: string;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  is_read: boolean;
}

export interface VendorOnboardingPayload {
  stall_name: string;
  description?: string | null;
  food_types: string[];
  phone?: string | null;
  open_time?: string | null;
  close_time?: string | null;
  location?: {
    address_text: string;
    lat?: number;
    lng?: number;
  } | null;
  photos: Array<{ url: string; sort_order?: number }>;
  menu_items: Array<{
    name: string;
    price: number;
    is_veg: boolean;
    available?: boolean;
  }>;
}

type AccessTokenProvider = () => Promise<string>;

let accessTokenProvider: AccessTokenProvider | null = null;

export function setAccessTokenProvider(provider: AccessTokenProvider | null) {
  accessTokenProvider = provider;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function toErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage =
      (error.response?.data as { error?: string } | undefined)?.error;
    if (responseMessage) {
      return responseMessage;
    }

    if (error.response?.status === 401) {
      return "Your session expired. Please login again.";
    }

    if (error.response?.status === 429) {
      return "Too many requests. Please retry in a moment.";
    }

    if (error.response?.status && error.response.status >= 500) {
      return "Server error. Please try again.";
    }

    if (error.message) {
      return error.message;
    }
  }

  return "Something went wrong. Please try again.";
}

apiClient.interceptors.request.use(async (config) => {
  if (accessTokenProvider) {
    const token = await accessTokenProvider();
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as
      | (typeof error.config & { _retryCount?: number })
      | undefined;

    if (
      config &&
      (error?.response?.status >= 500 || error?.response?.status === 429) &&
      (config._retryCount ?? 0) < 1
    ) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      await new Promise((resolve) => setTimeout(resolve, 250));
      return apiClient(config);
    }

    if (!(config?.headers as Record<string, string | undefined>)?.["x-skip-toast"]) {
      toast.error(toErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

interface ApiResponse<T> {
  data: T;
  pagination?: ApiPagination;
}

function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

function withPagination<T>(response: { data: ApiResponse<T> }) {
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
}

export async function getMe() {
  const response = await apiClient.get<ApiResponse<MePayload>>("/api/v1/me", {
    headers: { "x-skip-toast": "true" },
  });
  return unwrap(response);
}

export async function patchMe(payload: { full_name?: string; phone?: string }) {
  const response = await apiClient.patch<ApiResponse<{ user: UserProfile }>>(
    "/api/v1/me",
    payload,
  );
  return unwrap(response).user;
}

export async function getVendors(params?: {
  page?: number;
  pageSize?: number;
  veg?: boolean;
  foodType?: string;
  query?: string;
  openNow?: boolean;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}) {
  const response = await apiClient.get<ApiResponse<VendorSummary[]>>("/api/v1/vendors", {
    params: {
      ...params,
      veg: params?.veg !== undefined ? String(params.veg) : undefined,
      openNow: params?.openNow !== undefined ? String(params.openNow) : undefined,
    },
  });

  return withPagination(response);
}

export async function getVendorById(vendorId: string) {
  const response = await apiClient.get<ApiResponse<VendorDetail>>(
    `/api/v1/vendors/${vendorId}`,
  );
  return unwrap(response);
}

export async function submitVendorOnboarding(payload: VendorOnboardingPayload) {
  const response = await apiClient.post<ApiResponse<VendorDetail>>(
    "/api/v1/vendor/onboarding/submit",
    payload,
  );
  return unwrap(response);
}

export async function getVendorMe() {
  const response = await apiClient.get<ApiResponse<VendorDetail | null>>(
    "/api/v1/vendor/me",
    { headers: { "x-skip-toast": "true" } },
  );
  return unwrap(response);
}

export async function patchVendorMe(payload: Partial<VendorOnboardingPayload> & { status?: "draft" | "submitted" }) {
  const response = await apiClient.patch<ApiResponse<VendorDetail>>(
    "/api/v1/vendor/me",
    payload,
  );
  return unwrap(response);
}

export async function getFavorites(params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<VendorSummary[]>>("/api/v1/favorites", {
    params,
  });
  return withPagination(response);
}

export async function addFavorite(vendorId: string) {
  const response = await apiClient.post<ApiResponse<{ vendor_id: string; favorited: boolean }>>(
    `/api/v1/favorites/${vendorId}`,
  );
  return unwrap(response);
}

export async function removeFavorite(vendorId: string) {
  const response = await apiClient.delete<ApiResponse<{ vendor_id: string; favorited: boolean }>>(
    `/api/v1/favorites/${vendorId}`,
  );
  return unwrap(response);
}

export async function getVendorReviews(vendorId: string, params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<ReviewListItem[]>>(
    `/api/v1/vendors/${vendorId}/reviews`,
    { params },
  );
  return withPagination(response);
}

export async function createVendorReview(vendorId: string, payload: { rating: number; comment?: string | null }) {
  const response = await apiClient.post<ApiResponse<ReviewListItem>>(
    `/api/v1/vendors/${vendorId}/reviews`,
    payload,
  );
  return unwrap(response);
}

export async function patchReview(reviewId: string, payload: { rating?: number; comment?: string | null }) {
  const response = await apiClient.patch<ApiResponse<ReviewListItem>>(
    `/api/v1/reviews/${reviewId}`,
    payload,
  );
  return unwrap(response);
}

export async function deleteReview(reviewId: string) {
  const response = await apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(
    `/api/v1/reviews/${reviewId}`,
  );
  return unwrap(response);
}

export async function getMyReviews(params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<ReviewListItem[]>>("/api/v1/reviews", {
    params: {
      ...params,
      user: "me",
    },
  });
  return withPagination(response);
}

export async function getPosts(params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<FeedPost[]>>("/api/v1/posts", {
    params,
  });
  return withPagination(response);
}

export async function createPost(payload: {
  content: string;
  location_text?: string | null;
  lat?: number | null;
  lng?: number | null;
  media?: Array<{ url: string; type: "image" | "video" }>;
}) {
  const response = await apiClient.post<ApiResponse<FeedPost>>("/api/v1/posts", payload);
  return unwrap(response);
}

export async function getPostComments(postId: string, params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<PostComment[]>>(
    `/api/v1/posts/${postId}/comments`,
    { params },
  );
  return withPagination(response);
}

export async function createPostComment(postId: string, payload: { comment: string }) {
  const response = await apiClient.post<ApiResponse<PostComment>>(
    `/api/v1/posts/${postId}/comments`,
    payload,
  );
  return unwrap(response);
}

export async function getReels(params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<ReelItem[]>>("/api/v1/reels", {
    params,
  });
  return withPagination(response);
}

export async function createReel(payload: {
  vendor_id?: number | null;
  video_url: string;
  thumbnail_url?: string | null;
  description?: string | null;
}) {
  const response = await apiClient.post<ApiResponse<ReelItem>>("/api/v1/reels", payload);
  return unwrap(response);
}

export async function getReelComments(reelId: string, params?: { page?: number; pageSize?: number }) {
  const response = await apiClient.get<ApiResponse<ReelComment[]>>(
    `/api/v1/reels/${reelId}/comments`,
    { params },
  );
  return withPagination(response);
}

export async function createReelComment(reelId: string, payload: { comment: string }) {
  const response = await apiClient.post<ApiResponse<ReelComment>>(
    `/api/v1/reels/${reelId}/comments`,
    payload,
  );
  return unwrap(response);
}

export async function getAddresses() {
  const response = await apiClient.get<ApiResponse<AddressItem[]>>("/api/v1/addresses");
  return unwrap(response);
}

export async function createAddress(payload: {
  type: "home" | "work" | "other";
  label: string;
  address_text: string;
  lat?: number | null;
  lng?: number | null;
  is_default?: boolean;
}) {
  const response = await apiClient.post<ApiResponse<AddressItem>>(
    "/api/v1/addresses",
    payload,
  );
  return unwrap(response);
}

export async function patchAddress(addressId: string, payload: Partial<{
  type: "home" | "work" | "other";
  label: string;
  address_text: string;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
}>) {
  const response = await apiClient.patch<ApiResponse<AddressItem>>(
    `/api/v1/addresses/${addressId}`,
    payload,
  );
  return unwrap(response);
}

export async function deleteAddress(addressId: string) {
  const response = await apiClient.delete<ApiResponse<{ id: string; deleted: boolean }>>(
    `/api/v1/addresses/${addressId}`,
  );
  return unwrap(response);
}

export async function setDefaultAddress(addressId: string) {
  const response = await apiClient.post<ApiResponse<AddressItem>>(
    `/api/v1/addresses/${addressId}/default`,
  );
  return unwrap(response);
}

export async function getNotifications(params?: { page?: number; pageSize?: number; unreadOnly?: boolean }) {
  const response = await apiClient.get<ApiResponse<NotificationItem[]>>(
    "/api/v1/notifications",
    {
      params: {
        ...params,
        unreadOnly: params?.unreadOnly !== undefined ? String(params.unreadOnly) : undefined,
      },
    },
  );
  return withPagination(response);
}

export async function markNotificationRead(notificationId: string) {
  const response = await apiClient.post<ApiResponse<NotificationItem>>(
    `/api/v1/notifications/${notificationId}/read`,
  );
  return unwrap(response);
}

export async function signUpload(resourceType: "image" | "video" | "raw" | "auto") {
  const response = await apiClient.post<
    ApiResponse<{
      provider: "cloudinary";
      upload_url: string;
      fields: Record<string, string>;
    }>
  >("/api/v1/uploads/sign", {
    resource_type: resourceType,
  });

  return unwrap(response);
}

export async function uploadFileToProvider(file: File, resourceType: "image" | "video") {
  const signed = await signUpload(resourceType);

  if (signed.provider !== "cloudinary") {
    throw new Error("Unsupported upload provider");
  }

  const formData = new FormData();
  Object.entries(signed.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append("file", file);

  const uploadResponse = await axios.post(signed.upload_url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const secureUrl =
    uploadResponse.data?.secure_url ??
    uploadResponse.data?.url ??
    uploadResponse.data?.data?.secure_url;

  if (!secureUrl) {
    throw new Error("Upload succeeded but no URL was returned");
  }

  return String(secureUrl);
}