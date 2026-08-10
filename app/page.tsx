import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  AppleIcon,
  LogoHeader,
  PlayIcon,
  QrCode,
  StoreBadge,
  fraunces,
  inter,
  qrSvg,
} from "@/components/brand";
import { targetFor } from "@/lib/device";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/stores";

// Page d accueil publique. Deux roles en un :
//
//   - sur telephone, elle NE S AFFICHE PAS : l appareil est reconnu cote
//     serveur et redirige vers sa boutique. Aucun HTML n est envoye, donc
//     aucun scintillement — c est ce que la detection cote navigateur
//     (navigator.userAgent) n aurait pas permis.
//   - partout ailleurs — ordinateur, robot, appareil non reconnu — elle
//     presente la landing avec les deux badges et les deux QR codes.
//
// Composant SERVEUR. La lecture de headers() rend la route dynamique : elle
// n est plus prerendue ni mise en cache par le CDN, ce qui est la condition
// meme d une redirection dependant de l appareil.
//
// L habillage (logo, badges, QR, couleurs, polices) vient de
// components/brand.tsx, repris a l identique de app/r/[id]/page.tsx.

// app/layout.tsx porte encore les metadonnees du gabarit (« Create Next App ») ;
// elles ne sont pas modifiees ici, ce lot ne touche qu a la racine. Celles-ci
// les remplacent pour cette page.
export const metadata: Metadata = {
  title: "Hearth Atlas — Crave it. Cook it. Learn the world.",
  description:
    "Recipes from around the world, a cooking guide in your pocket. Download Hearth Atlas on the App Store or Google Play.",
  openGraph: {
    title: "Hearth Atlas",
    description:
      "Recipes from around the world, a cooking guide in your pocket.",
    type: "website",
  },
};

export default async function Home() {
  const target = targetFor((await headers()).get("user-agent"));

  // redirect() interrompt le rendu en levant : appele ici, hors de tout
  // try/catch, il produit une redirection HTTP 307 (temporaire — un 308 serait
  // mis en cache par le navigateur et figerait la destination par appareil).
  if (target === "ios") redirect(APP_STORE_URL);
  if (target === "android") redirect(PLAY_STORE_URL);

  // Ordinateur, robot, appareil non reconnu : la landing.
  const [appStoreQr, playStoreQr] = await Promise.all([
    qrSvg(APP_STORE_URL),
    qrSvg(PLAY_STORE_URL),
  ]);

  return (
    <div
      className={`${inter.className} flex min-h-screen flex-col bg-[#FFF8F1]`}
    >
      <LogoHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 pb-12">
        <div className="rounded-2xl bg-gradient-to-b from-[#F28705]/[0.08] to-[#F28705]/[0.03] px-6 py-9 text-center">
          <h1
            className={`${fraunces.className} text-2xl font-semibold text-[#2F0168]`}
          >
            Cook the world with Hearth Atlas
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-[#5C544E]">
            Recipes from around the world, a cooking guide in your pocket.
          </p>

          {/* Store badges — stack on narrow screens, side by side on wider ones. */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <StoreBadge
              href={APP_STORE_URL}
              icon={<AppleIcon />}
              top="Download on the"
              main="App Store"
            />
            <StoreBadge
              href={PLAY_STORE_URL}
              icon={<PlayIcon />}
              top="Get it on"
              main="Google Play"
            />
          </div>

          {/* QR codes to scan-and-install. */}
          <p className="mt-8 text-sm font-medium text-[#5C544E]">
            Scan to install Hearth Atlas
          </p>
          <div className="mt-4 flex flex-wrap items-start justify-center gap-6">
            <QrCode svg={appStoreQr} caption="App Store" />
            <QrCode svg={playStoreQr} caption="Google Play" />
          </div>
        </div>
      </main>
    </div>
  );
}
