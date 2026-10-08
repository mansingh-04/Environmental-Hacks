import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CleanItUp",
    short_name: "CleanItUp",
    description: "Know Your Waste. Do the Right Thing.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f1ea",
    theme_color: "#1b1a17",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
