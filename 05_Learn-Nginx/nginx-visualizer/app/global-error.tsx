"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
                <div className="max-w-xl rounded-xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl">
                    <h2 className="text-xl font-semibold text-rose-300">Global application error</h2>
                    <p className="mt-3 text-sm text-slate-300">{error.message}</p>
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="mt-4 rounded bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400"
                    >
                        Restart app
                    </button>
                </div>
            </body>
        </html>
    );
}
