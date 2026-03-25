import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { FileText, FileDown, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Download = () => {
  const { t } = useLanguage();
  const [format, setFormat] = useState<"docx" | "pdf">("docx");

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        className="glass neon-border rounded-2xl p-8 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-7 h-7 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t.payment.success}</h1>
        <p className="text-muted-foreground mb-8">{t.download.thankYou}</p>

        <h3 className="font-semibold mb-4">{t.download.selectFormat}</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setFormat("docx")}
            className={`glass rounded-xl p-4 transition-all duration-200 ${
              format === "docx" ? "neon-border neon-glow" : "border-border/30 hover:border-primary/30"
            }`}
          >
            <FileText className={`w-8 h-8 mx-auto mb-2 ${format === "docx" ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium">{t.download.word}</p>
          </button>
          <button
            onClick={() => setFormat("pdf")}
            className={`glass rounded-xl p-4 transition-all duration-200 ${
              format === "pdf" ? "neon-border neon-glow" : "border-border/30 hover:border-primary/30"
            }`}
          >
            <FileDown className={`w-8 h-8 mx-auto mb-2 ${format === "pdf" ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium">{t.download.pdf}</p>
          </button>
        </div>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
          {t.download.downloadBtn} ({format.toUpperCase()})
        </Button>
      </motion.div>
    </div>
  );
};

export default Download;
