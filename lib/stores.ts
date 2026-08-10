// Liens publics du produit, en UN SEUL endroit.
//
// Utilises par les DEUX pages publiques :
//   - app/page.tsx        cibles de la redirection selon l appareil, plus les
//                         badges et les QR de la landing ;
//   - app/r/[id]/page.tsx badges et QR du bas de la page de partage.
//
// Cette derniere portait ses propres constantes, marquees TODO et pointant sur
// la page d accueil faute de liens stores a l epoque ; elles ont ete supprimees
// au profit de ce module. Une fiche qui change ne se corrige donc qu ici.

/** Page d accueil publique. */
export const HOME_URL = "https://hearthatlas.lodestar-studio.com";

/** Fiche App Store (iOS / iPadOS). */
export const APP_STORE_URL = "https://apps.apple.com/app/id6785052951";

/** Fiche Google Play (Android). */
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.hearthatlas.app";
