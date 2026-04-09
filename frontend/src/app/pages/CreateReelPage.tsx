import { useNavigate } from "react-router";
import { ArrowLeft, X, Upload } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";
import { createReel, uploadFileToProvider } from "../lib/api";
import {useState} from 'react'
interface CreateReelFormValues {
  description: string;
  video_url: string;
}

const createReelSchema = Yup.object({
  description: Yup.string().trim().max(2000, "Description is too long"),
  video_url: Yup.string().url("Upload a valid video URL").required("Video is required"),
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

export function CreateReelPage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user } = useAuth0();

  const [uploading, setUploading] = useState(false);

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const uploadedUrl = await uploadFileToProvider(file, "video");
      setFieldValue("video_url", uploadedUrl);
      toast.success("Video uploaded");
    } catch (error) {
      toast.error(`Video upload failed: ${getErrorMessage(error)}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
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
            {language === "en" ? "Create Reel" : "Create Reel"}
          </h1>
          <div className="w-16" />
        </div>
      </div>

      <Formik<CreateReelFormValues>
        initialValues={{ description: "", video_url: "" }}
        validationSchema={createReelSchema}
        onSubmit={async (values, helpers) => {
          try {
            await createReel({
              video_url: values.video_url,
              thumbnail_url: null,
              description: values.description.trim() || null,
            });

            toast.success("Reel posted successfully");
            helpers.resetForm();
            navigate("/reels");
          } catch (error) {
            toast.error(`Failed to post reel: ${getErrorMessage(error)}`);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form className="max-w-2xl mx-auto p-6 space-y-6">
            {!values.video_url ? (
              <label className="block aspect-[9/16] max-h-[600px] mx-auto border-2 border-dashed border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--brand-orange)] transition-colors">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(event) => handleVideoUpload(event, setFieldValue)}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="size-full flex flex-col items-center justify-center">
                  <Upload size={64} className="text-[var(--text-secondary)] mb-4" />
                  <p className="text-lg font-medium mb-2">
                    {uploading
                      ? "Uploading video..."
                      : language === "en"
                        ? "Upload Video"
                        : "Upload Video"}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {language === "en" ? "Click to select a video" : "Click to select a video"}
                  </p>
                </div>
              </label>
            ) : (
              <div className="relative aspect-[9/16] max-h-[600px] mx-auto rounded-2xl overflow-hidden bg-black">
                <video src={values.video_url} controls className="size-full object-contain" />
                <button
                  type="button"
                  onClick={() => setFieldValue("video_url", "")}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            )}

            {values.video_url && (
              <>
                <div className="flex items-center gap-3">
                  <div className="size-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xl font-semibold text-white">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <p className="font-semibold">{user?.name || "User"}</p>
                </div>

                <Field
                  as="textarea"
                  name="description"
                  placeholder={language === "en" ? "Add a description..." : "Add a description..."}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
                  rows={4}
                />
                {touched.description && errors.description && (
                  <p className="text-sm text-red-500 -mt-2">{errors.description}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || uploading || !values.video_url}
                  className="w-full px-6 py-3 bg-[var(--brand-orange)] text-white rounded-full font-semibold hover:bg-[var(--brand-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Posting..."
                    : language === "en"
                      ? "Post Reel"
                      : "Post Reel"}
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
