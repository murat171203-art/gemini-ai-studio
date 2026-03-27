import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, MapPin, Clock, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        {/* Branches */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-center mb-8">
            <span className="neon-text">{t.footer.branches}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.footer.branchList.map((branch, i) => (
              <div
                key={i}
                className="glass rounded-xl p-5 hover:neon-border hover:bg-yellow-400/10 transition-all duration-300 space-y-3"
              >
                <h4 className="font-semibold text-base text-foreground">{branch.name}</h4>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                    {branch.phone}
                  </a>
                </div>
                <a
                  href={branch.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.footer.openMap}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm">
              <span className="neon-text">Manas</span>Doc
            </span>
          </div>
          <p className="text-muted-foreground text-xs text-center">
            © {new Date().getFullYear()} ManasDoc. {t.footer.rights}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
