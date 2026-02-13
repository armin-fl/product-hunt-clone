import { ImageResponse } from "next/og";

import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} Twitter card`;
export const size = {
  width: 1200,
  height: 600
};
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    // Next.js 16 file-based Twitter image route to match summary_large_image cards.
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(120deg, #0f172a 0%, #1d4ed8 45%, #ea580c 100%)",
          color: "#f8fafc",
          fontSize: 74,
          fontWeight: 700,
          letterSpacing: -1
        }}
      >
        {SITE_NAME}
      </div>
    ),
    size
  );
}
