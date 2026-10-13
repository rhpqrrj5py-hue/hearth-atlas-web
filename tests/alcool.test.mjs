// ACC-3 — le message sanitaire sur l'alcool sous les accords du Sommelier, mot pour mot comme
// dans l'app (src/i18n/locales/<langue>.ts, ai.alcoholWarning), dans les 16 langues.
//   node --test tests/
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import { CONTENT_LANGS, getChrome } from "../lib/chrome-i18n.ts";

// Copie exacte des textes de l'app (feature/journey, 13/10/2026).
const APP = {
  fr: "L'abus d'alcool est dangereux pour la santé. À consommer avec modération.",
  en: "Alcohol abuse is dangerous for your health. Drink responsibly.",
  es: "El abuso de alcohol es peligroso para la salud. Consúmelo con moderación.",
  de: "Übermäßiger Alkoholkonsum ist gesundheitsschädlich. Genieße Alkohol in Maßen.",
  it: "L'abuso di alcol è pericoloso per la salute. Bevi con moderazione.",
  pt: "O consumo abusivo de álcool é perigoso para a saúde. Beba com moderação.",
  ja: "お酒の飲み過ぎは健康を損なうおそれがあります。適量を守りましょう。",
  ar: "الإفراط في شرب الكحول خطر على الصحة. يُنصح بالاعتدال.",
  zh: "过量饮酒有害健康，请适量饮用。",
  ru: "Чрезмерное употребление алкоголя вредит здоровью. Пей умеренно.",
  hi: "शराब का अधिक सेवन सेहत के लिए खतरनाक है। संयम से पिएँ।",
  id: "Konsumsi alkohol berlebihan berbahaya bagi kesehatan. Minumlah secukupnya.",
  tr: "Aşırı alkol tüketimi sağlığa zararlıdır. Ölçülü tüket.",
  nl: "Overmatig alcoholgebruik is schadelijk voor de gezondheid. Drink met mate.",
  ko: "지나친 음주는 건강에 해롭습니다. 적당히 마시세요.",
  pl: "Nadużywanie alkoholu szkodzi zdrowiu. Pij z umiarem.",
};

test("textes : le message de l'app, mot pour mot, dans les 16 langues", () => {
  assert.deepEqual([...CONTENT_LANGS].sort(), Object.keys(APP).sort());
  for (const lang of CONTENT_LANGS) assert.equal(getChrome(lang).alcoholWarning, APP[lang], lang);
});

test("page : le message sous les accords, dans la partie Sommelier", () => {
  const src = readFileSync(new URL("../app/r/[id]/page.tsx", import.meta.url), "utf8");
  const som = src.slice(src.indexOf("{/* Sommelier */}"), src.indexOf("</article>"));
  const i = (s) => som.indexOf(s);
  assert.ok(i("{chrome.alcoholWarning}") > i("pairings.map("), "apres les accords");
  assert.ok(i("{chrome.alcoholWarning}") < i("</Card>"), "dans la carte du Sommelier");
});
