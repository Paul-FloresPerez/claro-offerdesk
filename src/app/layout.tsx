import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeInitializationScript } from "@/components/theme/ThemeInitializationScript";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Claro OfferDesk",
  description: "Consola interna para consulta comercial de promociones Claro.",
};

const themeInitializationScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t!=="light"&&t!=="dark")t="dark";var d=document.documentElement;d.classList.toggle("dark",t==="dark");d.setAttribute("data-theme",t);d.style.colorScheme=t}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={cn(
        "dark h-full scroll-pt-20 font-sans antialiased",
        inter.variable
      )}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <ThemeInitializationScript html={themeInitializationScript} />
      </head>
      <body className="min-h-full">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
