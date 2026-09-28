import { ImageResponse } from "next/og";

export const alt = "Canada Green — EV charging and agriculture investment";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #081c15 0%, #1b4332 55%, #2d6a4f 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 28,
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C12 2 7 7.5 7 12.5C7 16.09 9.91 19 13.5 19C14.5 19 15.4 18.7 16.15 18.2C15.1 20.4 12.8 22 10 22C5.58 22 2 18.42 2 14C2 8 8 3 12 2Z"
              fill="#95d5b2"
            />
            <path
              d="M14 4C14 4 18 8 18 12C18 14.76 16.24 17 13.5 17C12.12 17 10.9 16.36 10.15 15.4C11.35 14.55 12.1 13.15 12.1 11.55C12.1 8.5 14 4 14 4Z"
              fill="#d8f3dc"
            />
          </svg>
          <div style={{ fontSize: 42, fontWeight: 700, letterSpacing: -0.5 }}>
            Canada Green
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 600,
            lineHeight: 1.25,
            maxWidth: 900,
          }}
        >
          Crowdfunding for EV charging and agriculture projects in Canada
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          Investing in Canada&apos;s Sustainable Future
        </div>
      </div>
    ),
    { ...size }
  );
}
