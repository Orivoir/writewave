import dotenv from "dotenv";
import dbConnect from "../lib/mongoose";
import EbookTheme from "../models/EbookTheme";
import slugify from "slugify";

const path = process.env.NODE_ENV === "development" ? ".env.local" : ".env.prod";
dotenv.config({ path });

let hasEnsured = false;

export const defaultThemes = [
  {
    name: "Roman Classique",
    fontFamily: "'Georgia', serif",
    fontSize: "18px",
    lineHeight: "1.7",
    textColor: "#222222",
    titleColor: "#111111",
    subtitleColor: "#333333",
    linkColor: "#0a5daa",
    linkHoverColor: "#053f7a",
    backgroundColor: "#fdfcf9",
    borderColor: "#e1ded9",
    highlightColor: "#f5f3e7",
    borderRadius: "5px",
    boxShadow: "none",
    isPublic: true,
    author: null
  },
  {
    name: "Enfants & Jeunesse",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
    fontSize: "16px",
    lineHeight: "1.8",
    textColor: "#3a3a3a",
    titleColor: "#d45555",
    subtitleColor: "#7a3e3e",
    linkColor: "#f27c7c",
    linkHoverColor: "#b85151",
    backgroundColor: "#fff7f7",
    borderColor: "#f9dede",
    highlightColor: "#ffe6e6",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(210, 85, 85, 0.3)",
    isPublic: true,
    author: null
  },
  {
    name: "Science-Fiction",
    fontFamily: "'Courier New', monospace",
    fontSize: "16px",
    lineHeight: "1.6",
    textColor: "#00ffcc",
    titleColor: "#00b388",
    subtitleColor: "#009974",
    linkColor: "#00e6b8",
    linkHoverColor: "#00805a",
    backgroundColor: "#001a1a",
    borderColor: "#004d4d",
    highlightColor: "#003333",
    borderRadius: "4px",
    boxShadow: "0 0 15px #00ffcc",
    isPublic: true,
    author: null
  },
  {
    name: "Poésie Minimaliste",
    fontFamily: "'Palatino Linotype', serif",
    fontSize: "18px",
    lineHeight: "2.0",
    textColor: "#2b2b2b",
    titleColor: "#1a1a1a",
    subtitleColor: "#555555",
    linkColor: "#888888",
    linkHoverColor: "#555555",
    backgroundColor: "#ffffff",
    borderColor: "#eeeeee",
    highlightColor: "#f9f9f9",
    borderRadius: "0",
    boxShadow: "none",
    isPublic: true,
    author: null
  },
  {
    name: "Fantastique Médiéval",
    fontFamily: "'Garamond', serif",
    fontSize: "17px",
    lineHeight: "1.7",
    textColor: "#3b2e2e",
    titleColor: "#5a3a3a",
    subtitleColor: "#4a2d2d",
    linkColor: "#7a4545",
    linkHoverColor: "#532e2e",
    backgroundColor: "#faf3e0",
    borderColor: "#d6c8b8",
    highlightColor: "#f0e8d0",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(90, 58, 58, 0.3)",
    isPublic: true,
    author: null
  },
];

export async function ensureDefaultThemes() {
  if (hasEnsured) return;

  for (const themeData of defaultThemes) {
    const identifier = slugify(themeData.name, { lower: true, strict: true });
    const exists = await EbookTheme.findOne({ identifier });
    if (!exists) {
      await EbookTheme.create({ ...themeData, identifier });
      console.log(`🌱 Theme '${themeData.name}' seeded.`);
    } else {
      console.log(`✅ Theme '${themeData.name}' already exists.`);
    }
  }

  hasEnsured = true;
}

// Permet d'exécuter le script en CLI avec `npm run seed`
if (require.main === module) {
  dbConnect()
    .then(() => ensureDefaultThemes())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("❌ Failed to seed themes:", err);
      process.exit(1);
    });
}
