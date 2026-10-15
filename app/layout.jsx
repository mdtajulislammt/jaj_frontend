import "./globals.css";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata = {
  title: "Mona POS · Retail & Superstore Console",
  description: "Cloud POS for retail & superstores — IMEI tracking, warranty, EMI/Due.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="relative min-h-screen bg-[#F7FAF4] text-slate-800 antialiased selection:bg-[#64BD0B] selection:text-white">
        {/* ━━ Ambient Glassmorphic Background Orbs ━━━━━━━━━━━━━ */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#64BD0B]/12 blur-[110px]" />
          <div className="absolute top-1/4 -right-20 w-[460px] h-[460px] rounded-full bg-[#64BD0B]/10 blur-[130px]" />
          <div className="absolute bottom-10 left-1/3 w-[520px] h-[520px] rounded-full bg-[#84DB1B]/8 blur-[140px]" />
          <div className="absolute -bottom-28 right-16 w-[360px] h-[360px] rounded-full bg-[#64BD0B]/12 blur-[100px]" />
        </div>

        <Providers>
          <div className="relative z-10 flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <Topbar />
              <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
