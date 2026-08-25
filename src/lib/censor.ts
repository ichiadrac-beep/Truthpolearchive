const HARD =
  /\b(fuck(?:ing|ed|er|s)?|shit(?:ty|s)?|cunt(?:s)?|bitch(?:es|ing)?|assholes?|motherfuck(?:ing|er|ers)?|nigg(?:er|a|ers)|faggot(?:s)?|retard(?:ed|s)?)\b/gi;

const GRAPHIC =
  /\b(dicks?|pussy|pussies|cocks?|sluts?|whores?|blowjobs?|handjobs?|rapes?|raping|porn(?:o|ography)?|semen|anal|boobs?|tits?|bastards?)\b/gi;

function mask(text: string, pattern: RegExp) {
  return text.replace(pattern, (word) => "•".repeat(Math.min(12, Math.max(3, word.length))));
}

/** Always applied on send. Hard swears and slurs. */
export function censorHard(text: string) {
  return mask(text, HARD).replace(/\s+/g, " ").trim().slice(0, 240);
}

/** Extra pass for viewers who filter graphic language. */
export function censorGraphic(text: string) {
  return mask(text, GRAPHIC);
}

export function displayPoleBody(body: string, graphicFilter: boolean) {
  const hard = censorHard(body);
  return graphicFilter ? censorGraphic(hard) : hard;
}
