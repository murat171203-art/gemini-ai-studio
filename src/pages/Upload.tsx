import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload as UploadIcon, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

type AnalysisStage = "idle" | "uploading" | "stage1" | "stage2" | "stage3" | "complete";

const Upload = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [progress, setProgress] = useState(0);

  const stages: Record<string, { text: string; target: number }> = {
    stage1: { text: t.upload.stage1 || "Проверка полей (3см слева, 1.5см справа)...", target: 33 },
    stage2: { text: t.upload.stage2 || "Анализ структуры (Титульный лист, Содержание)...", target: 66 },
    stage3: { text: t.upload.stage3 || "Настройка нумерации (Римские → Киришүү, Арабские → негизги бөлүм)...", target: 100 },
  };

  useEffect(() => {
    if (stage === "uploading") {
      const timer = setTimeout(() => setStage("stage1"), 800);
      return () => clearTimeout(timer);
    }
    if (stage === "stage1") {
      const interval = setInterval(() => setProgress(p => Math.min(p + 2, 33)), 80);
      const timer = setTimeout(() => { setStage("stage2"); clearInterval(interval); }, 2500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
    if (stage === "stage2") {
      const interval = setInterval(() => setProgress(p => Math.min(p + 2, 66)), 80);
      const timer = setTimeout(() => { setStage("stage3"); clearInterval(interval); }, 2500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
    if (stage === "stage3") {
      const interval = setInterval(() => setProgress(p => Math.min(p + 2, 100)), 80);
      const timer = setTimeout(() => { setStage("complete"); clearInterval(interval); setProgress(100); }, 2500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
  }, [stage]);

  const startAnalysis = useCallback(() => {
    setStage("uploading");
    setProgress(0);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".docx")) {
      setFile(dropped);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.name.endsWith(".docx")) {
      setFile(selected);
    }
  }, []);

  const currentStageText = stage in stages ? stages[stage].text : "";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t.upload.title}
        </motion.h1>

        <motion.div
          className={`glass rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
            isDragging ? "neon-border neon-glow" : "border-border/50 hover:border-primary/30"
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          {stage === "complete" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold text-lg">{t.upload.reportTitle || "Анализ аяктады"}</h3>
              <div className="glass rounded-xl p-4 text-left w-full space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{t.upload.reportTables || "12 таблица табылды, форматтоо оңдолду"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{t.upload.reportSpacing || "1.5 интервалга ылайык чегинүүлөр оңдолду"}</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span>{t.upload.reportReady || "Документ төлөмдөн кийин жүктөп алууга даяр"}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t.upload.fileRetention || "Файлдар 14 күн сакталып, андан кийин жок кылынат"}
              </p>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow mt-2 w-full"
                onClick={() => navigate("/payment")}
              >
                {t.analysis.payToContinue}
              </Button>
            </div>
          ) : stage !== "idle" ? (
            <div className="flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary/20 neon-border flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="w-full">
                <Progress value={progress} className="h-3 mb-3" />
                <motion.p 
                  className="text-sm text-primary font-medium"
                  key={stage}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {stage === "uploading" ? (t.upload.uploading || "Жүктөлүүдө...") : currentStageText}
                </motion.p>
              </div>
              {file && (
                <p className="text-xs text-muted-foreground">
                  {file.name} — {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
          ) : file ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-primary/20 neon-border flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-muted-foreground text-sm">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow mt-4"
                onClick={startAnalysis}
              >
                {t.upload.analyzing}
              </Button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UploadIcon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium mb-2">{t.upload.dragDrop}</p>
              <p className="text-muted-foreground text-sm mb-4">{t.upload.or}</p>
              <label>
                <input
                  type="file"
                  accept=".docx"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Button asChild variant="outline" className="border-primary/30 hover:border-primary/60 cursor-pointer">
                  <span>{t.upload.browse}</span>
                </Button>
              </label>
              <div className="mt-6 flex gap-4 justify-center text-xs text-muted-foreground">
                <span>{t.upload.formats}</span>
                <span>•</span>
                <span>{t.upload.maxSize}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {t.upload.fileRetention || "Файлдар 14 күн сакталып, андан кийин жок кылынат"}
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
