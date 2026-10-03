"use client";

import React, { useEffect, useState } from "react";

export function MswProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    async function startWorker() {
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        try {
          const { worker } = await import("@/mocks/browser");
          await worker.start({
            onUnhandledFrame: "bypass",
            serviceWorker: {
              url: "/mockServiceWorker.js",
            },
          });
          console.info("[MSW] Mock Service Worker started successfully for mock REST endpoints.");
        } catch (err) {
          console.warn("[MSW] Warning: Service Worker registration deferred or unhandled:", err);
        }
      }
      setIsReady(true);
    }

    startWorker();
  }, []);

  return <>{children}</>;
}
