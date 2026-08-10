// Reconnaissance d appareil a partir du user-agent, pour la redirection de la
// page d accueil vers la bonne boutique.
//
// Module a part, et non exporte depuis app/page.tsx : un fichier de route Next
// n admet qu un jeu fixe d exports (default, metadata, revalidate...), et la
// validation de types de `next build` rejette les autres. Ici, la logique est
// aussi isolee et testable.

// Robots d indexation et generateurs d apercu de lien. Ils doivent voir la
// LANDING, jamais une redirection : sans cette liste, les vignettes Open Graph
// partagees sur Slack, WhatsApp ou X pointeraient vers l App Store et le
// referencement du domaine se ferait sur une page de boutique.
const BOT =
  /bot|crawler|spider|crawling|facebookexternalhit|slackbot|twitterbot|whatsapp|telegrambot|discordbot|linkedinbot|embedly|pinterest|redditbot|applebot|googlebot|bingbot|duckduckbot|baiduspider|yandex|headlesschrome|lighthouse|preview/i;

// iPhone et iPod se reconnaissent sans ambiguite.
//
// L iPad, LUI, NE SE DETECTE PAS de facon fiable : depuis iPadOS 13, Safari
// annonce par defaut un user-agent de Macintosh. Un iPad tombera donc le plus
// souvent sur la landing. Ce n est pas bloquant — elle porte les deux badges,
// l utilisateur atteint la boutique en un clic — et le seul contournement
// (Macintosh + navigator.maxTouchPoints) exigerait du JavaScript client, donc
// le scintillement qu on cherche precisement a eviter. On garde /ipad/ pour le
// cas ou le mode « site mobile » est actif.
const IOS = /iphone|ipod|ipad/i;
const ANDROID = /android/i;

export type Target = "ios" | "android" | "landing";

/** La destination pour un user-agent donne. */
export function targetFor(userAgent: string | null | undefined): Target {
  if (!userAgent) return "landing"; // en-tete absent : on n invente rien
  if (BOT.test(userAgent)) return "landing";
  if (ANDROID.test(userAgent)) return "android"; // avant iOS : « Android » est sans equivoque
  if (IOS.test(userAgent)) return "ios";
  return "landing"; // ordinateur, ou appareil inconnu
}
