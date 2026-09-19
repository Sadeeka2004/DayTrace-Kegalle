import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  Image as ImageIcon,
  Link as LinkIcon,
  LoaderCircle,
  RotateCcw,
  Upload,
} from "lucide-react";
import AdminHeader from "../components/admin/AdminHeader";
import DayTraceLogo from "../components/brand/DayTraceLogo";
import useAdminAuth from "../hooks/useAdminAuth";
import useBranding from "../hooks/useBranding";
import {
  resetBrandingLogo,
  updateBrandingLogoUrl,
  uploadBrandingLogo,
} from "../services/api";

const allowedLogoTypes = ["image/jpeg", "image/png", "image/webp"];
const maximumLogoSize = 2 * 1024 * 1024;

function BrandingSettingsPage() {
  const { token } = useAdminAuth();
  const { branding, applyBranding } = useBranding();
  const previewUrlRef = useRef("");

  const [updateMethod, setUpdateMethod] = useState("upload");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleLogoFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    clearMessages();

    if (!selectedFile) {
      return;
    }

    if (!allowedLogoTypes.includes(selectedFile.type)) {
      setErrorMessage("Please select a JPG, PNG or WebP logo image.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > maximumLogoSize) {
      setErrorMessage("Logo image must be 2 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(selectedFile);
    previewUrlRef.current = previewUrl;

    setLogoFile(selectedFile);
    setLogoPreviewUrl(previewUrl);
    event.target.value = "";
  };

  const handleSave = async () => {
    clearMessages();

    if (updateMethod === "upload" && !logoFile) {
      setErrorMessage("Please select a logo image first.");
      return;
    }

    if (updateMethod === "url" && !logoUrl.trim()) {
      setErrorMessage("Please enter a logo image URL.");
      return;
    }

    try {
      setIsSaving(true);

      const response =
        updateMethod === "upload"
          ? await uploadBrandingLogo(logoFile, token)
          : await updateBrandingLogoUrl(logoUrl.trim(), token);

      applyBranding(response.branding);
      setSuccessMessage(response.message);
      setLogoFile(null);
      setLogoPreviewUrl("");
      setLogoUrl("");

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    const shouldReset = window.confirm(
      "Restore the original DayTrace logo across the website?",
    );

    if (!shouldReset) {
      return;
    }

    try {
      setIsSaving(true);
      clearMessages();

      const response = await resetBrandingLogo(token);

      applyBranding(response.branding);
      setSuccessMessage(response.message);
      setLogoFile(null);
      setLogoPreviewUrl("");
      setLogoUrl("");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8f7]">
      <AdminHeader
        title="Website Branding"
        description="Manage the logo shown across DayTrace Kegalle"
      />

      <section className="px-5 py-10 sm:px-8 lg:py-14">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
              Brand management
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              Change website logo
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              Update the logo displayed in the public navigation, footer and
              administrator header.
            </p>
          </div>

          {successMessage && (
            <div
              role="status"
              className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800"
            >
              <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
              <p className="font-medium">{successMessage}</p>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="mt-7 rounded-2xl border border-rose-200 bg-rose-50 p-5 font-medium text-rose-700"
            >
              {errorMessage}
            </div>
          )}

          <div className="mt-8 grid gap-7 lg:grid-cols-[340px_1fr]">
            <section className="rounded-3xl border border-slate-200 bg-slate-950 p-7 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-300">
                Current logo
              </p>

              <div className="mt-7 flex min-h-48 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.07] p-8">
                <DayTraceLogo
                  appearance="light"
                  size="large"
                  showText={false}
                />
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-300">
                Source: {branding.logoSource || "default"}
              </p>

              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving || branding.logoSource === "default"}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw size={18} />
                Restore Default Logo
              </button>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex rounded-2xl bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setUpdateMethod("upload");
                    clearMessages();
                  }}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
                    updateMethod === "upload"
                      ? "bg-white text-teal-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Upload size={17} />
                  Upload Image
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUpdateMethod("url");
                    clearMessages();
                  }}
                  className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
                    updateMethod === "url"
                      ? "bg-white text-teal-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <LinkIcon size={17} />
                  Image URL
                </button>
              </div>

              {updateMethod === "upload" ? (
                <div className="mt-7">
                  <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-7 text-center transition hover:border-teal-500 hover:bg-teal-50/50">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleLogoFileChange}
                      className="sr-only"
                    />

                    {logoPreviewUrl ? (
                      <img
                        src={logoPreviewUrl}
                        alt="Selected logo preview"
                        className="mx-auto h-32 w-32 rounded-3xl bg-white object-contain p-2 shadow-lg"
                      />
                    ) : (
                      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                        <ImageIcon size={28} />
                      </span>
                    )}

                    <span className="mt-5 block font-bold text-slate-950">
                      {logoFile ? logoFile.name : "Choose a logo image"}
                    </span>

                    <span className="mt-2 block text-sm text-slate-500">
                      JPG, PNG or WebP · Maximum 2 MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="mt-7">
                  <label className="block">
                    <span className="text-sm font-bold text-slate-700">
                      Direct logo image URL
                    </span>

                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(event) => {
                        setLogoUrl(event.target.value);
                        clearMessages();
                      }}
                      placeholder="https://example.com/daytrace-logo.png"
                      className="mt-2 min-h-12 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                    />
                  </label>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Use a permanent HTTPS image URL. If the external image is
                    removed later, DayTrace automatically shows its default
                    logo.
                  </p>
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
                Recommended: a square logo with a transparent background,
                ideally 512 × 512 pixels.
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-teal-700 px-6 font-bold text-white transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Saving Logo...
                  </>
                ) : (
                  <>
                    <Upload size={19} />
                    Save Website Logo
                  </>
                )}
              </button>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BrandingSettingsPage;
