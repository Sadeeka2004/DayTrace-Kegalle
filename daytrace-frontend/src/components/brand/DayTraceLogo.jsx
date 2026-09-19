import { useId, useState } from "react";
import useBranding from "../../hooks/useBranding";

const logoSizes = {
  small: {
    icon: "h-9 w-9",
    title: "text-base",
    subtitle: "text-[9px]",
  },
  medium: {
    icon: "h-11 w-11",
    title: "text-lg",
    subtitle: "text-[10px]",
  },
  large: {
    icon: "h-14 w-14",
    title: "text-xl",
    subtitle: "text-[11px]",
  },
};

function DayTraceLogo({
  appearance = "dark",
  size = "medium",
  showText = true,
  subtitle = "Kegalle",
  className = "",
}) {
  const { branding } = useBranding();
  const generatedId = useId().replaceAll(":", "");
  const [failedLogoUrl, setFailedLogoUrl] = useState("");

  const gradientId =
    `daytrace-logo-gradient-${generatedId}`;

  const selectedSize =
    logoSizes[size] || logoSizes.medium;

  const usesLightText = appearance === "light";
  const customLogoUrl = branding.logoUrl?.trim();
  const shouldShowCustomLogo =
    Boolean(customLogoUrl) && failedLogoUrl !== customLogoUrl;

  return (
    <span
      className={`inline-flex items-center gap-3 ${className}`}
      aria-label={
        showText ? undefined : "DayTrace Kegalle"
      }
    >
      {shouldShowCustomLogo ? (
        <img
          src={customLogoUrl}
          alt={showText ? "" : "DayTrace Kegalle"}
          className={`${selectedSize.icon} shrink-0 rounded-2xl bg-white object-contain p-1 shadow-lg transition duration-300 group-hover:scale-105`}
          onError={() => setFailedLogoUrl(customLogoUrl)}
        />
      ) : (
        <svg
          viewBox="0 0 64 64"
          className={`${selectedSize.icon} shrink-0 overflow-visible drop-shadow-lg transition duration-300 group-hover:scale-105`}
          aria-hidden={showText ? "true" : undefined}
          role={showText ? undefined : "img"}
        >
        <defs>
          <linearGradient
            id={gradientId}
            x1="8"
            y1="6"
            x2="56"
            y2="58"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#2dd4bf" />
            <stop offset="0.55" stopColor="#0d9488" />
            <stop offset="1" stopColor="#0891b2" />
          </linearGradient>
        </defs>

        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="18"
          fill={`url(#${gradientId})`}
        />

        <circle
          cx="18"
          cy="17"
          r="5"
          fill="#fbbf24"
        />

        <path
          d="M8 42L20 27L29 37L37 26L56 47V54H8V42Z"
          fill="#ecfeff"
          fillOpacity="0.28"
        />

        <path
          d="M12 50C19 45 21 39 29 40C36 41 34 49 45 49"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="4 5"
        />

        <path
          d="M45 13C38.9 13 34 17.8 34 23.8C34 32.1 45 42 45 42C45 42 56 32.1 56 23.8C56 17.8 51.1 13 45 13Z"
          fill="#0f172a"
          stroke="#ffffff"
          strokeWidth="2"
        />

        <circle
          cx="45"
          cy="24"
          r="4"
          fill="#5eead4"
        />
        </svg>
      )}

      {showText && (
        <span>
          <span
            className={`block ${selectedSize.title} font-black leading-none tracking-tight ${
              usesLightText
                ? "text-white"
                : "text-slate-950"
            }`}
          >
            DayTrace
          </span>

          <span
            className={`mt-1 block ${selectedSize.subtitle} font-bold uppercase tracking-[0.24em] ${
              usesLightText
                ? "text-teal-300"
                : "text-teal-700"
            }`}
          >
            {subtitle}
          </span>
        </span>
      )}
    </span>
  );
}

export default DayTraceLogo;
