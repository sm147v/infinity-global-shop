"use client";
import Script from "next/script";

// G-... = Google Analytics (medir visitas)
// AW-... = Google Ads (medir conversiones/ventas para optimizar la pauta)
export function GoogleAnalytics() {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-VDKVC6WVWZ" strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-VDKVC6WVWZ', {
            page_path: window.location.pathname,
          });
          gtag('config', 'AW-18266991654');
        `}
      </Script>
    </>
  );
}
