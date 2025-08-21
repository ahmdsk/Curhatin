const badwords = [
  "anjing", "bangsat", "kontol", "memek", "babi", "tolol", "goblok",
  "fuck", "shit", "bitch", "asshole", "dick", "bastard"
  // tambahin sesuai kebutuhan
];

function maskWord(word: string) {
  if (word.length <= 2) return "*".repeat(word.length);
  return word[0] + "*".repeat(word.length - 2) + word[word.length - 1];
}

export function filterBadwords(text: string) {
  const regex = new RegExp(`\\b(${badwords.join("|")})\\b`, "gi");
  return text.replace(regex, (match) => maskWord(match));
}
