import React, { createContext, useContext, useState, useCallback } from "react";
import { Language, translations, languageNames, languageFlags } from "@/i18n/translations";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations["ky"];
  languageNames: typeof languageNames;
  languageFlags: typeof languageFlags;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem("manasdoc-lang") as Language;
    return stored && translations[stored] ? stored : "ky";
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("manasdoc-lang", newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang], languageNames, languageFlags }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
