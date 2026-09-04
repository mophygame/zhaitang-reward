import type { Metadata } from "next";
import "./globals.css";
import "./phone.css";
import "./gallery.css";
import "./browser.css";
import "./article.css";
import "./article-images.css";
import "./google-logo.css";
import "./computer.css";
import "./ghost-game.css";
import "./desktop-files.css";
import "./desktop-taskbar.css";
import "./yellow-folders.css";
import "./connection-status.css";
import "./computer-height.css";
import "./web-app-layout.css";
import "./office.css";
import "./voicemail.css";
import "./cinematic.css";
import "./wallpapers.css";
import "./phone-home.css";
import "./app-icons.css";
import "./map.css";
import "./phone-widgets.css";
import "./phone-swipe.css";
import "./messages.css";
import "./messages-readable.css";
import "./contact-avatars.css";
import "./birthday.css";
import "./petitions.css";
import "./desktop-drag.css";
import "./desktop-windows.css";
import "./login.css";
import "./loading-screen.css";
import "./pdf-viewer.css";
import "./xlsx-viewer.css";
import "./docx-viewer.css";
import "./image-viewer.css";
import "./text-viewer.css";
import "./video-viewer.css";
import "./folder-password.css";
import "./music.css";
import "./desktop-browser.css";

export const metadata: Metadata = {
  title: "齋堂全通關｜消失的老闆",
  description: "探索午未老闆的辦公室，破解手機密碼，找出消失的老闆。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preload" href="/ui/bg_login_desktop.png" as="image" media="(min-width: 701px)"/>
        <link rel="preload" href="/ui/bg_login_mobile.png" as="image" media="(max-width: 700px)"/>
        <link rel="preload" href="/ui/bg_office.webp" as="image" media="(min-width: 701px)"/>
        <link rel="preload" href="/ui/bg_office_mobile.png" as="image" media="(max-width: 700px)"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
