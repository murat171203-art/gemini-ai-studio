import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Upload as UploadIcon, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

const Upload = () => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

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
          {file ? (
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
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow mt-4">
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
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Upload;
