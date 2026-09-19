import "./globals.css";

export const metadata = {
    title: "NGINX Config Visualizer",
    description: "Educational NGINX configuration visualizer and request simulator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div className="h-screen w-screen">{children}</div>
            </body>
        </html>
    );
}
