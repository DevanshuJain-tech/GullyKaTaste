import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Image, MapPin, X } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";
import { createPost, uploadFileToProvider } from "../lib/api";

interface CreatePostFormValues {
  content: string;
  location_text: string;
  lat: number | null;
  lng: number | null;
  mediaUrls: string[];
}

const createPostSchema = Yup.object({
  content: Yup.string().trim().min(1, "Post content is required").max(4000, "Too long").required("Post content is required"),
  location_text: Yup.string().trim().max(300, "Location is too long"),
  lat: Yup.number().nullable(),
  lng: Yup.number().nullable(),
  mediaUrls: Yup.array().of(Yup.string().url("Invalid media URL")),
});

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { error?: string } | undefined)?.error ||
      error.message ||
      "Request failed"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed";
}

export function CreatePostPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth0();

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaUrls: string[],
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(
        Array.from(files).map((file) => uploadFileToProvider(file, "image")),
      );

      setFieldValue("mediaUrls", [...mediaUrls, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} image(s) uploaded`);
    } catch (error) {
      toast.error(`Image upload failed: ${getErrorMessage(error)}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDetectLocation = (setFieldValue: (field: string, value: unknown) => void) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFieldValue("lat", position.coords.latitude);
        setFieldValue("lng", position.coords.longitude);
      },
      () => {
        toast.error("Unable to access location");
      },
    );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-color)] z-10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">
            {language === "en" ? "Create Post" : "Create Post"}
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <Formik<CreatePostFormValues>
        initialValues={{
          content: "",
          location_text: "",
          lat: null,
          lng: null,
          mediaUrls: [],
        }}
        validationSchema={createPostSchema}
        onSubmit={async (values, helpers) => {
          try {
            await createPost({
              content: values.content,
              location_text: values.location_text.trim() || null,
              lat: values.lat ?? null,
              lng: values.lng ?? null,
              media: values.mediaUrls.map((url) => ({ url, type: "image" as const })),
            });

            toast.success("Post created successfully");
            helpers.resetForm();
            navigate("/community");
          } catch (error) {
            toast.error(`Failed to create post: ${getErrorMessage(error)}`);
          }
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xl font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold">{user?.name || "User"}</p>
                <button
                  type="button"
                  onClick={() => handleDetectLocation(setFieldValue)}
                  className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-orange)]"
                >
                  <MapPin size={14} />
                  {values.location_text || (language === "en" ? "Add location" : "Add location")}
                </button>
              </div>
            </div>

            <Field
              as="textarea"
              name="content"
              placeholder={language === "en" ? "Share your food discovery..." : "Share your food discovery..."}
              className="w-full bg-transparent border-none outline-none resize-none text-lg"
              rows={8}
              autoFocus
            />
            {touched.content && errors.content && (
              <p className="text-sm text-red-500 -mt-4">{errors.content}</p>
            )}

            <input
              type="text"
              value={values.location_text}
              onChange={(event) => setFieldValue("location_text", event.target.value)}
              placeholder="Location (optional)"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4"
            />

            {values.mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {values.mediaUrls.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={image} alt="Uploaded" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue(
                          "mediaUrls",
                          values.mediaUrls.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--brand-orange)] transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => handleImageUpload(event, values.mediaUrls, setFieldValue)}
                className="hidden"
                disabled={uploading}
              />
              <Image size={24} className="text-[var(--text-secondary)]" />
              <span className="text-[var(--text-secondary)]">
                {uploading
                  ? "Uploading images..."
                  : language === "en"
                    ? "Add photos"
                    : "Add photos"}
              </span>
            </label>

            <button
              type="submit"
              disabled={!values.content.trim() || isSubmitting || uploading}
              className="w-full px-6 py-3 bg-[var(--brand-orange)] text-white rounded-full font-semibold hover:bg-[var(--brand-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : language === "en" ? "Post" : "Post"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
