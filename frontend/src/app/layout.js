import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata = {
  title: "RAGora — Next-Gen AI Study Agora & Companion",
  description:
    "RAGora: AI Study Agora with Document RAG, Gemini AI, 3D Flashcards, Timed Quizzes, and Live Leaderboard.",
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
