import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CleanItUp",
    short_name: "CleanItUp",
    description: "Know Your Waste. Do the Right Thing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f5ef",
    theme_color: "#0e9f6e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
