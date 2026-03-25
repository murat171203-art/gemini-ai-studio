import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const mockResults = {
  errors: 3,
  warnings: 5,
  fixed: 8,
};

const Analysis = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h1
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {t.analysis.title}
        </motion.h1>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="glass rounded-xl p-4 text-center">
            <AlertCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
            <p className="text-2xl font-bold">{mockResults.errors}</p>
            <p className="text-xs text-muted-foreground">{t.analysis.errors}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{mockResults.warnings}</p>
            <p className="text-xs text-muted-foreground">{t.analysis.warnings}</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{mockResults.fixed}</p>
            <p className="text-xs text-muted-foreground">{t.analysis.fixed}</p>
          </div>
        </motion.div>

        {/* Preview with watermark */}
        <motion.div
          className="glass rounded-xl p-8 relative overflow-hidden mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="font-semibold mb-4">{t.analysis.preview}</h3>
          <div className="bg-secondary/50 rounded-lg p-6 min-h-[300px] relative">
            {/* Simulated document preview */}
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-5/6" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-1/2 mt-6" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>

            {/* Watermark overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p
                className="text-primary/20 font-bold text-lg text-center select-none"
                style={{ transform: "rotate(-30deg)" }}
              >
                {t.analysis.watermark}
              </p>
            </div>
          </div>
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
