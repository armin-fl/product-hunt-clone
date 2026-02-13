import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME} social preview`;
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    // Next.js 16 file-based OG image route for consistent social sharing previews.
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 15% 20%, #f7d8b8 0, rgba(247, 216, 184, 0) 40%), linear-gradient(120deg, #0f172a 0%, #1e293b 45%, #ea580c 120%)",
          color: "#f8fafc",
          padding: "56px"
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            opacity: 0.85
          }}
        >
          Daily launches
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "980px" }}>
          <div style={{ fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>{SITE_NAME}</div>
          <div style={{ fontSize: 36, lineHeight: 1.3, opacity: 0.92 }}>{SITE_DESCRIPTION}</div>
        </div>
      </div>
    ),
    size
  );
}
