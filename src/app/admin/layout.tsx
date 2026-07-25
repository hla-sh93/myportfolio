import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "../globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = { title: "Admin | حلا شندية" };

/**
 * /admin lives outside the [locale] tree, so this layout must supply the
 * <html>/<body> shell itself (the root layout is a pass-through).
 * The auth gate + sidebar live in the (panel) route group so /admin/login
 * can render without a session.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={`${poppins.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
