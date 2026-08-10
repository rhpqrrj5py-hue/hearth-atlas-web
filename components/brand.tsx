// Habillage de marque Hearth Atlas, partage entre les pages publiques.
//
// PROVENANCE : ces composants sont repris a l identique de
// app/r/[id]/page.tsx (lignes 294-390), ou ils vivaient en local, non exportes.
// Ils y sont laisses en place : ce lot ne modifie pas la page de partage, qui
// fonctionne et est en production. La duplication est assumee et temporaire —
// faire pointer r/[id] vers ce module est un lot de refactorisation a part,
// avec sa propre verification visuelle.
//
// Rendu STRICTEMENT identique : memes classes, memes valeurs hexadecimales,
// memes polices. Une seule difference fonctionnelle, `LogoHeader.href`, rendu
// optionnel — sur la page d accueil, un lien vers la page d accueil n a pas de
// sens.
//
// Composants SERVEUR : pas de "use client". qrSvg utilise la bibliotheque
// `qrcode` (Node) et ne doit jamais partir dans le bundle navigateur.

import { Fraunces, Inter } from "next/font/google";
import QRCode from "qrcode";

// Charte : cream #FFF8F1 · orange #F28705 · blue #5171FF · purple #2F0168 · teal #0EA5A4

// Warm serif for headings, clean sans for body.
export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
});
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

/**
 * En-tete : globe + wordmark + tagline.
 * `href` absent => rendu non cliquable (cas de la page d accueil).
 */
export function LogoHeader({ href }: { href?: string }) {
  const content = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/globe.png"
        alt=""
        aria-hidden
        className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
      />
      <span className="flex flex-col">
        <span
          className={`${fraunces.className} text-2xl font-semibold leading-none text-[#2F0168] sm:text-3xl`}
        >
          Hearth Atlas
        </span>
        <span className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#C26A00] sm:text-xs">
          Crave it. Cook it. Learn the world.
        </span>
      </span>
    </>
  );

  return (
    <header className="flex justify-center py-9">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 sm:gap-4"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4">{content}</div>
      )}
    </header>
  );
}

export const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.51 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

export const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
    <path d="M3 2.5v19a1 1 0 0 0 1.5.87l16.5-9.5a1 1 0 0 0 0-1.74L4.5 1.63A1 1 0 0 0 3 2.5z" />
  </svg>
);

export function StoreBadge({
  href,
  icon,
  top,
  main,
}: {
  href: string;
  icon: React.ReactNode;
  top: string;
  main: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-xl bg-[#2F0168] px-5 py-2.5 text-white shadow-sm transition-opacity hover:opacity-90"
    >
      {icon}
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-white/70">
          {top}
        </span>
        <span className={`${fraunces.className} text-base font-semibold`}>
          {main}
        </span>
      </span>
    </a>
  );
}

/** A QR code as an inline SVG string (server-side, no client JS). Purple modules on
 *  a transparent background so it sits cleanly on the white card. */
export async function qrSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#2F0168", light: "#00000000" },
  });
}

export function QrCode({ svg, caption }: { svg: string; caption: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-[120px] w-[120px] rounded-lg bg-white p-2 shadow-sm [&_svg]:h-full [&_svg]:w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <span className="text-xs font-medium text-[#5C544E]">{caption}</span>
    </div>
  );
}
