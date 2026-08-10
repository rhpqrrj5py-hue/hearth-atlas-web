// Liens publics du produit, en UN SEUL endroit.
//
// app/r/[id]/page.tsx porte encore ses propres constantes APP_STORE_URL /
// PLAY_STORE_URL, marquees TODO et pointant sur la page d accueil (les liens
// stores n existaient pas quand cette page a ete ecrite). Elles sont
// volontairement laissees intactes ici : ce lot ne touche pas a la page de
// partage. A faire converger vers ce module dans un lot suivant, sinon les
// badges et QR de la page de partage continueront de renvoyer vers l accueil.

/** Page d accueil publique. */
export const HOME_URL = "https://hearthatlas.lodestar-studio.com";

/** Fiche App Store (iOS / iPadOS). */
export const APP_STORE_URL = "https://apps.apple.com/app/id6785052951";

/** Fiche Google Play (Android). */
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.hearthatlas.app";
