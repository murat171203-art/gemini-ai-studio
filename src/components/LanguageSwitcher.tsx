import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/i18n/translations";

const languages: Language[] = ["ky", "tr", "ru", "en"];

const LanguageSwitcher = () => {
  const { lang, setLang, languageFlags } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {languages.map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2 py-1 text-sm rounded-md transition-all duration-200 ${
            lang === l
              ? "glass neon-border text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span className="mr-1">{languageFlags[l]}</span>
          <span className="hidden sm:inline">{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
