import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { submitVendorOnboarding, uploadFileToProvider } from "../lib/api";

interface MenuDraftItem {
  name: string;
  price: string;
  is_veg: boolean;
  available: boolean;
}

interface VendorFormValues {
  stall_name: string;
  description: string;
  phone: string;
  open_time: string;
  close_time: string;
  location_text: string;
  food_types: string[];
  photos: string[];
  menu_items: MenuDraftItem[];
}

const foodTypeOptions = [
  "street-food",
  "chai",
  "snacks",
  "sweets",
  "meals",
  "juice",
];

const vendorOnboardingSchema = Yup.object({
  stall_name: Yup.string().trim().min(2, "Stall name is too short").max(120).required("Stall name is required"),
  description: Yup.string().trim().max(1000),
  phone: Yup.string().trim().max(30),
  open_time: Yup.string().matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time"),
  close_time: Yup.string().matches(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time"),
  location_text: Yup.string().trim().max(500),
  food_types: Yup.array().of(Yup.string()).max(20),
  photos: Yup.array().of(Yup.string().url("Invalid photo URL")),
  menu_items: Yup.array().of(
    Yup.object({
      name: Yup.string().trim().max(120).required("Name required"),
      price: Yup.string().test("price-positive", "Price must be > 0", (value) => {
        if (!value) return true;
        return Number(value) > 0;
      }),
      is_veg: Yup.boolean().required(),
      available: Yup.boolean().required(),
    }),
  ),
});

export function VendorOnboardingPage() {
  const navigate = useNavigate();
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploadingPhotos(true);
    try {
      return await Promise.all(
        Array.from(files).map((file) => uploadFileToProvider(file, "image")),
      );
    } finally {
      setUploadingPhotos(false);
      event.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-color)] z-10 p-4">
        <div className="flex items-center max-w-4xl mx-auto gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Become a Vendor</h1>
            <p className="text-sm text-[var(--text-secondary)]">Complete your profile to get listed</p>
          </div>
        </div>
      </div>

      <Formik<VendorFormValues>
        initialValues={{
          stall_name: "",
          description: "",
          phone: "",
          open_time: "09:00",
          close_time: "21:00",
          location_text: "",
          food_types: [],
          photos: [],
          menu_items: [],
        }}
        validationSchema={vendorOnboardingSchema}
        onSubmit={async (values, helpers) => {
          const parsedMenuItems = values.menu_items
            .filter((item) => item.name.trim() && Number(item.price) > 0)
            .map((item) => ({
              name: item.name.trim(),
              price: Number(item.price),
              is_veg: item.is_veg,
              available: item.available,
            }));

          await submitVendorOnboarding({
            stall_name: values.stall_name,
            description: values.description.trim() || null,
            food_types: values.food_types,
            phone: values.phone.trim() || null,
            open_time: values.open_time || null,
            close_time: values.close_time || null,
            location: values.location_text.trim()
              ? {
                  address_text: values.location_text.trim(),
                }
              : null,
            photos: values.photos.map((url, index) => ({ url, sort_order: index })),
            menu_items: parsedMenuItems,
          });

          toast.success("Vendor profile submitted");
          helpers.resetForm();
          navigate("/vendor-dashboard");
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors, touched }) => (
          <Form className="max-w-3xl mx-auto p-6 space-y-8 pb-28">
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <Field
                name="stall_name"
                placeholder="Stall Name"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4"
              />
              {touched.stall_name && errors.stall_name && (
                <p className="text-sm text-red-500">{errors.stall_name}</p>
              )}

              <Field
                as="textarea"
                name="description"
                placeholder="Describe your stall"
                rows={3}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 resize-none"
              />

              <Field
                name="phone"
                placeholder="Phone Number"
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4"
              />

              <Field
                as="textarea"
                name="location_text"
                placeholder="Address"
                rows={2}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 resize-none"
              />

              <div className="grid grid-cols-2 gap-3">
                <Field
                  type="time"
                  name="open_time"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4"
                />
                <Field
                  type="time"
                  name="close_time"
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4"
                />
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Food Types</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {foodTypeOptions.map((type) => {
                  const selected = values.food_types.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setFieldValue(
                          "food_types",
                          selected
                            ? values.food_types.filter((item) => item !== type)
                            : [...values.food_types, type],
                        );
                      }}
                      className={`p-3 rounded-xl border transition-colors ${
                        selected
                          ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10"
                          : "border-[var(--border-color)] bg-[var(--bg-secondary)]"
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Stall Photos</h2>
              <label className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--brand-orange)] transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (event) => {
                    const uploaded = await handlePhotoUpload(event);
                    if (uploaded && uploaded.length) {
                      setFieldValue("photos", [...values.photos, ...uploaded]);
                      toast.success(`${uploaded.length} photo(s) uploaded`);
                    }
                  }}
                  className="hidden"
                  disabled={uploadingPhotos}
                />
                <Upload size={22} className="text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">
                  {uploadingPhotos ? "Uploading photos..." : "Upload photos"}
                </span>
              </label>

              {values.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {values.photos.map((photo, index) => (
                    <div key={`${photo}-${index}`} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={photo} alt="Stall" className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "photos",
                            values.photos.filter((_, i) => i !== index),
                          )
                        }
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Menu Items</h2>
                <button
                  type="button"
                  onClick={() =>
                    setFieldValue("menu_items", [
                      ...values.menu_items,
                      { name: "", price: "", is_veg: true, available: true },
                    ])
                  }
                  className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] flex items-center gap-2"
                >
                  <Plus size={16} /> Add
                </button>
              </div>

              {values.menu_items.length === 0 ? (
                <p className="text-[var(--text-secondary)] text-sm">No menu items yet.</p>
              ) : (
                <div className="space-y-3">
                  {values.menu_items.map((item, index) => (
                    <div key={index} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={item.name}
                          onChange={(event) =>
                            setFieldValue(
                              "menu_items",
                              values.menu_items.map((m, i) =>
                                i === index ? { ...m, name: event.target.value } : m,
                              ),
                            )
                          }
                          placeholder="Item name"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 px-3"
                        />
                        <input
                          value={item.price}
                          onChange={(event) =>
                            setFieldValue(
                              "menu_items",
                              values.menu_items.map((m, i) =>
                                i === index ? { ...m, price: event.target.value } : m,
                              ),
                            )
                          }
                          placeholder="Price"
                          type="number"
                          min="0"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 px-3"
                        />
                      </div>

                      <div className="flex gap-3 items-center">
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "menu_items",
                              values.menu_items.map((m, i) =>
                                i === index ? { ...m, is_veg: !m.is_veg } : m,
                              ),
                            )
                          }
                          className={`px-3 py-1 rounded-lg text-sm ${
                            item.is_veg ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}
                        >
                          {item.is_veg ? "Veg" : "Non-veg"}
                        </button>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={item.available}
                            onChange={(event) =>
                              setFieldValue(
                                "menu_items",
                                values.menu_items.map((m, i) =>
                                  i === index ? { ...m, available: event.target.checked } : m,
                                ),
                              )
                            }
                          />
                          Available
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            setFieldValue(
                              "menu_items",
                              values.menu_items.filter((_, i) => i !== index),
                            )
                          }
                          className="ml-auto text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {touched.menu_items && typeof errors.menu_items === "string" && (
                <p className="text-sm text-red-500">{errors.menu_items}</p>
              )}
            </section>

            <button
              type="submit"
              disabled={isSubmitting || uploadingPhotos || !values.stall_name.trim()}
              className="w-full py-3 rounded-2xl font-semibold bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)] disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Vendor Profile"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}