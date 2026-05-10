import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocument } from "@/contexts/DocumentContext";
import type { University, ThesisType } from "@/contexts/DocumentContext";
import { Upload as UploadIcon, FileText, CheckCircle, AlertTriangle, Loader2, GraduationCap, BookOpen, Award } from "lucide-react";
import bmuLogo from "@/assets/bmu-logo.jpg";
import knuLogo from "@/assets/knu-logo.png";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { repairDocx } from "@/lib/docxRepair";

type AnalysisStage = "idle" | "uploading" | "stage1" | "stage2" | "stage3" | "repairing" | "complete";

const universities: { id: University; name: string; full: string }[] = [
  { id: "ktmu", name: "КТМУ", full: "Кыргыз-Түрк «Манас» университети" },
  { id: "bmu", name: "БМУ", full: "Бишкек мамлекеттик университети" },
  { id: "knu", name: "КНУ", full: "Ж. Баласагын атындагы КНУ" },
  { id: "ktu", name: "КТУ", full: "И. Раззаков атындагы КТУ" },
];

const thesisTypes: { id: ThesisType; name: string; full: string; icon: typeof BookOpen }[] = [
  { id: "undergraduate_tourism_eka", name: "Bitirme Tezi · Ek-A", full: "Лисанс — Туризм факультети (Ek-A варианты)", icon: BookOpen },
  { id: "undergraduate_tourism_ekd", name: "Bitirme Tezi · Ek-D", full: "Лисанс — Туризм факультети (Ek-D варианты)", icon: BookOpen },
  { id: "graduate", name: "Lisansüstü", full: "Магистратура / Докторантура (2025 Kılavuzu)", icon: Award },
];

const Upload = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { setOriginalFile, setRepairedResult, setProcessing, repairStats, university, setUniversity, thesisType, setThesisType } = useDocument();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<AnalysisStage>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const stages: Record<string, { text: string; target: number }> = {
    stage1: { text: t.upload.stage1 || "Проверка полей (3.5см слева, 2.5см справа)...", target: 25 },
    stage2: { text: t.upload.stage2 || "Анализ структуры (Титульный лист, Содержание)...", target: 50 },
    stage3: { text: t.upload.stage3 || "Настройка нумерации и форматирования...", target: 75 },
    repairing: { text: "Документ оңдолууда / Repairing document...", target: 95 },
  };

  useEffect(() => {
    if (stage === "uploading") {
      const timer = setTimeout(() => setStage("stage1"), 500);
      return () => clearTimeout(timer);
    }
    if (stage === "stage1") {
      const interval = setInterval(() => setProgress(p => Math.min(p + 2, 25)), 60);
      const timer = setTimeout(() => { setStage("stage2"); clearInterval(interval); }, 1500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
    if (stage === "stage2") {
      const interval = setInterval(() => setProgress(p => Math.min(p + 2, 50)), 60);
      const timer = setTimeout(() => { setStage("stage3"); clearInterval(interval); }, 1500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
    if (stage === "stage3") {
      const interval = setInterval(() => setProgress(p => Math.min(p + 2, 75)), 60);
      const timer = setTimeout(() => { setStage("repairing"); clearInterval(interval); }, 1500);
      return () => { clearInterval(interval); clearTimeout(timer); };
    }
    if (stage === "repairing" && file) {
      setProcessing(true);
      repairDocx(file, university || undefined, thesisType || undefined)
        .then(({ blob, stats }) => {
          setRepairedResult(blob, stats);
          setProgress(100);
          setStage("complete");
        })
        .catch((err) => {
          console.error("Repair failed:", err);
          setError(err.message || "Repair failed");
          setStage("idle");
          setProgress(0);
        });
    }
  }, [stage]);

  const startAnalysis = useCallback(() => {
    if (!file) return;
    setOriginalFile(file);
    setError(null);
    setStage("uploading");
    setProgress(0);
  }, [file, setOriginalFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.name.endsWith(".docx")) {
      setFile(dropped);
      setStage("idle");
      setError(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.name.endsWith(".docx")) {
      setFile(selected);
      setStage("idle");
      setError(null);
    }
  }, []);

  const currentStageText = stage in stages ? stages[stage].text : "";
  const totalFixes = repairStats
    ? repairStats.fontFixes + repairStats.sizeFixes + repairStats.spacingFixes + repairStats.indentFixes + repairStats.tableFixes
    : 0;

  // If no university selected yet, show university picker
  if (!university) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.h1
            className="text-3xl font-bold text-center mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Университетти тандаңыз
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Документтин форматы тандалган университеттин стандарттарына ылайык болот
          </motion.p>

          <div className="grid grid-cols-2 gap-4">
            {universities.map((uni, i) => (
              <motion.button
                key={uni.id}
                className="glass rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 border border-border/50 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                onClick={() => setUniversity(uni.id)}
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-3 transition-colors overflow-hidden">
                  {uni.id === "bmu" ? (
                    <img src={bmuLogo} alt="БМУ" className="w-12 h-12 object-contain" />
                  ) : uni.id === "knu" ? (
                    <img src={knuLogo} alt="КНУ" className="w-12 h-12 object-contain" />
                  ) : (
                    <GraduationCap className="w-7 h-7 text-primary" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-1">{uni.name}</h3>
                <p className="text-muted-foreground text-xs leading-tight">{uni.full}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // KTMU: ask for thesis type (Bitirme Tezi vs Lisansüstü)
  if (university === "ktmu" && !thesisType) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.div
            className="flex items-center justify-center gap-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <button
              onClick={() => setUniversity(null)}
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
            >
              ← Башка университет
            </button>
            <span className="text-sm font-medium text-primary">КТМУ</span>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold text-center mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Тезистин түрүн тандаңыз
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            КТМУнун эрежелери ар бир баскычка ылайык айырмаланат (полелер, нумерация, структура)
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {thesisTypes.map((tt, i) => {
              const Icon = tt.icon;
              return (
                <motion.button
                  key={tt.id}
                  className="glass rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 border border-border/50 hover:border-primary/60 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)] group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  onClick={() => setThesisType(tt.id)}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mx-auto mb-3 transition-colors">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-1">{tt.name}</h3>
                  <p className="text-muted-foreground text-xs leading-tight">{tt.full}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const selectedUni = universities.find(u => u.id === university);
  const selectedThesis = thesisTypes.find(t => t.id === thesisType);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          className="flex items-center justify-center gap-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() => setUniversity(null)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
          >
            ← Башка университет
          </button>
          <span className="text-sm font-medium text-primary">{selectedUni?.name}</span>
          {selectedThesis && (
            <>
              <span className="text-xs text-muted-foreground">·</span>
              <button
                onClick={() => setThesisType(null)}
                className="text-xs text-primary hover:underline"
              >
                {selectedThesis.name}
              </button>
            </>
          )}
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t.upload.title}
        </motion.h1>

        {error && (
          <motion.div
            className="glass rounded-xl p-4 mb-4 border-destructive/50 text-destructive text-sm text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {error}
          </motion.div>
        )}

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
          {stage === "complete" && repairStats ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="font-semibold text-lg">{t.upload.reportTitle || "Анализ аяктады"}</h3>
              <div className="glass rounded-xl p-4 text-left w-full space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{repairStats.fontFixes + repairStats.sizeFixes} шрифт оңдоосу / font fixes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{repairStats.spacingFixes} интервал оңдоосу / spacing fixes</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{repairStats.indentFixes} чегинүү оңдоосу / indent fixes</span>
                </div>
                {repairStats.tableFixes > 0 && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>{repairStats.tableFixes} таблица оңдоосу / table fixes</span>
                  </div>
                )}
                {repairStats.marginFixed && (
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Барак талаалары оңдолду / Page margins fixed</span>
                  </div>
                )}
                <div className="flex items-start gap-2 pt-2 border-t border-border/30">
                  <AlertTriangle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-primary">
                    Жалпы: {totalFixes} оңдоо / Total: {totalFixes} fixes
                  </span>
                </div>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow mt-2 w-full"
                onClick={() => navigate("/analysis")}
              >
                Текшерүү / Preview
              </Button>
            </div>
          ) : stage !== "idle" ? (
            <div className="flex flex-col items-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary/20 neon-border flex items-center justify-center">
                {stage === "repairing" ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <FileText className="w-8 h-8 text-primary animate-pulse" />
                )}
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
