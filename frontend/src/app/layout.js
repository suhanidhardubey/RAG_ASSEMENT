import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata = {
  title: "RAG Assistant — Study Companion",
  description:
    "Local AI-powered Study Companion with Document Processing, Flashcards, Quiz Modules, and Leaderboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#FFF5F8] text-[#4A1525]">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
