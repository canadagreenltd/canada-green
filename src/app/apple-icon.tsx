import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1b4332",
          borderRadius: 36,
        }}
      >
        <svg
          width="110"
          height="110"
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
      </div>
    ),
    { ...size }
  );
}
