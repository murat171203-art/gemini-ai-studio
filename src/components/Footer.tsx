import { useLanguage } from "@/contexts/LanguageContext";
import { FileText } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="font-bold text-sm">
            <span className="neon-text">Manas</span>Doc
          </span>
        </div>
        <p className="text-muted-foreground text-xs text-center">
          © {new Date().getFullYear()} ManasDoc. {t.footer.rights}. {t.footer.manas}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
