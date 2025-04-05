import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lunch Planner",
  description: "Plan your meals and generate shopping lists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="p-4" style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
          <div className="container">
            <p>© {new Date().getFullYear()} Lunch Planner App</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
