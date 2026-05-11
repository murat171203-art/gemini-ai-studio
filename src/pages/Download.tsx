import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocument } from "@/contexts/DocumentContext";
import { FileDown, CheckCircle, AlertCircle, FileText, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { convertDocxBlobToPdf } from "@/lib/docxToPdf";

const Download = () => {
  const { t } = useLanguage();
  const { repairedBlob, fileName, repairStats, isPaid, thesisType } = useDocument();
  const isTourism = thesisType === "undergraduate_tourism_eka" || thesisType === "undergraduate_tourism_ekd";
  const [isConverting, setIsConverting] = useState(false);

  // No file at all → go to upload
  if (!repairedBlob) {
    return <Navigate to="/upload" replace />;
  }

  // File exists but not paid → go to payment
  if (!isPaid) {
    return <Navigate to="/payment" replace />;
  }

  const baseName = fileName.replace(/\.docx$/i, "");

  const handleDownloadDocx = () => {
    if (!repairedBlob) return;
    const url = URL.createObjectURL(repairedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${baseName}_repaired.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = async () => {
    if (!repairedBlob) return;
    setIsConverting(true);
    try {
      const pdfBlob = await convertDocxBlobToPdf({ blob: repairedBlob, fileName });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${baseName}_repaired.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF conversion error:", err);
    } finally {
      setIsConverting(false);
    }
  };

  const totalFixes = repairStats
    ? repairStats.fontFixes + repairStats.sizeFixes + repairStats.spacingFixes + repairStats.indentFixes + repairStats.tableFixes
    : 0;

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
        <h1 className="text-2xl font-bold mb-2">{t.download.thankYou}</h1>
        <p className="text-muted-foreground mb-4">{fileName}</p>

        {isTourism && repairStats?.pageNumberFixed && (
          <div className="rounded-xl p-3 mb-4 bg-green-500/10 border border-green-500/30 text-sm text-green-400">
            Tourism Faculty formatting completed successfully (3-section numbering applied)
          </div>
        )}

        {repairStats && (
          <div className="glass rounded-xl p-4 text-left text-sm space-y-1.5 mb-6">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Шрифт оңдоолор:</span>
              <span className="font-medium">{repairStats.fontFixes + repairStats.sizeFixes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Интервал оңдоолор:</span>
              <span className="font-medium">{repairStats.spacingFixes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Чегинүү оңдоолор:</span>
              <span className="font-medium">{repairStats.indentFixes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Таблица оңдоолор:</span>
              <span className="font-medium">{repairStats.tableFixes}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border/30">
              <span className="font-semibold text-primary">Жалпы:</span>
              <span className="font-bold text-primary">{totalFixes}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handleDownloadDocx}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 neon-glow"
            size="lg"
          >
            <FileDown className="w-5 h-5 mr-2" />
            DOCX
          </Button>

          <Button
            onClick={handleDownloadPdf}
            disabled={isConverting}
            className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
            size="lg"
          >
            {isConverting ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <FileText className="w-5 h-5 mr-2" />
            )}
            PDF
          </Button>
        </div>

        <Button
          asChild
          variant="ghost"
          className="w-full mt-3 text-muted-foreground"
        >
          <Link to="/upload">Дагы бир файл жүктөө</Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Download;
