import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Management App",
  description: "Manage your projects efficiently",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Script
          id="hide-nextjs-dev-tools"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function hideNextLogo() {
                  const logo = document.getElementById('next-logo');
                  if (logo) {
                    logo.style.display = 'none';
                    logo.style.visibility = 'hidden';
                    logo.style.opacity = '0';
                    logo.style.pointerEvents = 'none';
                  }
                  const buttons = document.querySelectorAll('button[data-nextjs-dev-tools-button="true"]');
                  buttons.forEach(function(btn) {
                    btn.style.display = 'none';
                    btn.style.visibility = 'hidden';
                    btn.style.opacity = '0';
                    btn.style.pointerEvents = 'none';
                  });
                }
                hideNextLogo();
                var observer = new MutationObserver(hideNextLogo);
                observer.observe(document.body, { childList: true, subtree: true });
              })();
            `,
          }}
        />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
