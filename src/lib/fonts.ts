import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";

// Fonts for the dark "Kỉ Niệm" / "Nhật kí" pages.
export const serif = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

export const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-vn",
});
