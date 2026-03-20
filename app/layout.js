import { Gaegu, Gowun_Dodum } from "next/font/google";
import "./globals.css";

const bodyFont = Gowun_Dodum({
  variable: "--font-body",
  subsets: ["latin", "korean"],
  weight: "400"
});

const titleFont = Gaegu({
  variable: "--font-title",
  subsets: ["latin", "korean"],
  weight: ["400", "700"]
});

export const metadata = {
  title: "독서탑 노트",
  description: "책 제목과 메모를 차곡차곡 쌓는 독서탑 사이트"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.variable} ${titleFont.variable}`}>{children}</body>
    </html>
  );
}
