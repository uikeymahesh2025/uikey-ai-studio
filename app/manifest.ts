import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UIKEY AI Studio",
    short_name: "UIKEY Studio",
    description: "Shoot se delivery tak, photographers ka intelligent workspace.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#09090B",
    theme_color: "#18181B",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
