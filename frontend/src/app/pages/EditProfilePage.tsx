import { useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Camera } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useAuth0 } from "@auth0/auth0-react";
import { BottomNav } from "../components/BottomNav";
import { useLanguage } from "../context/LanguageContext";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loadMe, saveMeProfile } from "../store/userSlice";

interface EditProfileValues {
  name: string;
  email: string;
  phone: string;
}

const editProfileSchema = Yup.object({
  name: Yup.string().trim().min(2, "Name is too short").max(120, "Name is too long").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string().trim().min(7, "Phone is too short").max(30, "Phone is too long").nullable(),
});

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { t } = useLanguage();
  const dispatch = useAppDispatch();
  const me = useAppSelector((state) => state.user.me);

  useEffect(() => {
    if (!me) {
      dispatch(loadMe());
    }
  }, [dispatch, me]);

  const initialValues: EditProfileValues = {
    name: me?.user.full_name || user?.name || "",
    email: me?.user.email || user?.email || "",
    phone: me?.user.phone || "",
  };

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <h1 className="text-xl">{t("editProfile")}</h1>

          <div className="w-12" />
        </div>
      </div>

      <Formik<EditProfileValues>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={editProfileSchema}
        onSubmit={async (values) => {
          await dispatch(
            saveMeProfile({
              full_name: values.name.trim(),
              phone: values.phone.trim() || undefined,
            }),
          ).unwrap();
          navigate("/profile");
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="flex-1 overflow-y-auto">
            <div className="p-6 pb-24">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      className="size-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-24 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-4xl font-semibold text-white">
                      {initialValues.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <button
                    type="button"
                    className="absolute bottom-0 right-0 p-2 bg-[var(--bg-secondary)] rounded-full border-2 border-[var(--bg-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <Camera size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    {t("fullName")}
                  </label>
                  <Field
                    type="text"
                    name="name"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-4 px-4 focus:outline-none focus:border-[var(--brand-orange)]"
                  />
                  {touched.name && errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    {t("email")}
                  </label>
                  <Field
                    type="email"
                    name="email"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-4 px-4 opacity-70 cursor-not-allowed"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm text-[var(--text-secondary)] mb-2">
                    {t("phone")}
                  </label>
                  <Field
                    type="tel"
                    name="phone"
                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-4 px-4 focus:outline-none focus:border-[var(--brand-orange)]"
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full px-4 py-3 bg-[var(--brand-orange)] text-white rounded-xl hover:opacity-90 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <BottomNav />
    </div>
  );
}