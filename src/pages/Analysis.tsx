import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocument } from "@/contexts/DocumentContext";
import { AlertCircle, CheckCircle, FileText, Hash, Type, AlignLeft, Table2, Columns3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, Navigate } from "react-router-dom";
import { extractDocxParagraphs, type DocxParagraph } from "@/lib/docxTextExtract";

const Analysis = () => {
  const { t } = useLanguage();
  const { repairStats, fileName, repairedBlob, originalFile } = useDocument();
  const [paragraphs, setParagraphs] = useState<DocxParagraph[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!originalFile) return;
    setLoading(true);
    extractDocxParagraphs(originalFile)
      .then((p) => setParagraphs(p))
      .catch(() => setParagraphs([]))
      .finally(() => setLoading(false));
  }, [originalFile]);

  if (!repairStats) {
    return <Navigate to="/upload" replace />;
  }

  const stats = repairStats;
  const totalFixes = stats.fontFixes + stats.sizeFixes + stats.spacingFixes + stats.indentFixes + stats.tableFixes + stats.sectionBreaksAdded + stats.tableFigureRenumbered + (stats.marginFixed ? 1 : 0);

  const statItems = [
    { icon: Type, label: t.analysis.errors, value: stats.fontFixes, color: "text-cyan-400" },
    { icon: Hash, label: t.analysis.warnings, value: stats.sizeFixes, color: "text-blue-400" },
    { icon: AlignLeft, label: t.analysis.fixed, value: stats.spacingFixes + stats.indentFixes, color: "text-green-400" },
    { icon: Table2, label: "Таблица/Сүрөт", value: stats.tableFigureRenumbered, color: "text-yellow-400" },
    { icon: Columns3, label: "Секциялар", value: stats.sectionBreaksAdded, color: "text-purple-400" },
    { icon: FileText, label: "Четтер", value: stats.marginFixed ? 1 : 0, color: "text-pink-400" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h1
          className="text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t.analysis.title}
        </motion.h1>
        <motion.p
          className="text-center text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          {fileName} — <span className="text-primary font-semibold">{totalFixes}</span> оңдоо табылды
        </motion.p>

        {/* Stats grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {statItems.map((item, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Section breaks info */}
        {stats.sectionBreaksAdded > 0 && (
          <motion.div
            className="glass rounded-xl p-4 mb-6 border border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Columns3 className="w-4 h-4" /> Секция & Нумерация
            </h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>1-секция: Киришүүгө чейин (TOC, Аннотация) — Рим цифралары (i, ii, iii...)</li>
              <li>2-секция: Киришүүдөн баштап — Араб цифралары (1ден кайра башталат)</li>
            </ul>
          </motion.div>
        )}

        {/* Real document preview with watermark */}
        <motion.div
          className="glass rounded-xl p-6 relative overflow-hidden mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold mb-4">{t.analysis.preview}</h3>
          <div className="bg-white rounded-lg relative shadow-inner border border-border/50">
            <ScrollArea className="h-[420px]">
              <div className="p-8 space-y-2 select-none" style={{ fontFamily: "'Times New Roman', serif" }}>
                {loading ? (
                  <div className="space-y-3 animate-pulse">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="h-3 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                  </div>
                ) : paragraphs.length > 0 ? (
                  paragraphs.slice(0, 80).map((p, i) => (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed text-gray-800 ${
                        p.isHeading ? "text-base font-bold mt-4" : ""
                      } ${p.isBold ? "font-bold" : ""} ${p.isCenter ? "text-center" : ""}`}
                    >
                      {p.text}
                    </p>
                  ))
                ) : (
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-3 bg-muted rounded" style={{ width: `${60 + Math.random() * 40}%` }} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Watermark overlay */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
              {Array.from({ length: 5 }).map((_, row) => (
                <div key={row} className="flex justify-around" style={{ marginTop: row === 0 ? "40px" : "60px" }}>
                  {Array.from({ length: 3 }).map((_, col) => (
                    <p
                      key={col}
                      className="text-red-500/20 font-bold text-lg select-none whitespace-nowrap"
                      style={{ transform: "rotate(-30deg)" }}
                    >
                      {t.analysis.watermark}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Суу белгисиз версияны жүктөп алуу үчүн төлөм жасаңыз
          </p>
        </motion.div>

        {/* Pay CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted-foreground mb-4">{t.analysis.payToContinue}</p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow px-10">
            <Link to="/payment">{t.payment.payWithMbank}</Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Analysis;
