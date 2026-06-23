import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME}｜年収手取り・住宅ローン・税金を無料で計算`,
    short_name: SITE_NAME,
    description:
      "年収手取り・住宅ローン・ふるさと納税・NISA・iDeCo・相続税など、お金の計算を無料でまとめて。",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#10b981",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
