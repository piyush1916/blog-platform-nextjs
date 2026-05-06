import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import Providers from "./providers";
import "../styles/globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "Nebula Notes",
  description: "A glassmorphism blog platform powered by Next.js and React Query.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body>
        <div className="orb orb--one" />
        <div className="orb orb--two" />
        <div className="orb orb--three" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Providers>
            <div className="relative z-10 min-h-screen">{children}</div>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
