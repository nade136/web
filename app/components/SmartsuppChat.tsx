"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SmartsuppChat() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Skip admin routes
    if (pathname.startsWith("/admin")) return;

    // Avoid duplicate injection
    if (typeof window !== "undefined") {
      const w = window as any;
      if (w.smartsupp || w._smartsupp) return;

      w._smartsupp = w._smartsupp || {};
      w._smartsupp.key = "8bdfa8ae1979f3f2c3e7b6280a361c344b6f1fda";

      (function (d: Document) {
        const s = d.getElementsByTagName("script")[0];
        const c = d.createElement("script");
        c.type = "text/javascript";
        c.charset = "utf-8";
        (c as any).async = true;
        (c as HTMLScriptElement).src = "https://www.smartsuppchat.com/loader.js?";
        s.parentNode?.insertBefore(c, s);
      })(document);
    }
  }, [pathname]);

  return null;
}
