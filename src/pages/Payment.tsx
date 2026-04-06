import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useDocument } from "@/contexts/DocumentContext";
import { CheckCircle, Loader2, Download, AlertCircle } from "lucide-react";
import bakAiQr from "@/assets/bak-ai-qr.jpg";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

const Payment = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { repairStats, fileName, setIsPaid } = useDocument();
  const [status, setStatus] = useState<"pending" | "verifying" | "success">("pending");

  // Must have completed analysis first
  if (!repairStats) {
    return <Navigate to="/upload" replace />;
  }

  const handleIPaid = () => {
    setStatus("verifying");
    setTimeout(() => {
      setStatus("success");
      setIsPaid(true);
    }, 3000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        className="glass neon-border rounded-2xl p-8 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {status === "success" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold">{t.payment.success}</h1>
            <p className="text-muted-foreground text-sm mb-4">
              {t.download.thankYou}
            </p>
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow flex items-center gap-2"
              onClick={() => navigate("/download")}
            >
              <Download className="w-4 h-4" />
              {t.download.downloadBtn}
            </Button>
          </div>
        ) : (
          <>
            {/* MBank Logo */}
            <div className="w-14 h-14 rounded-xl bg-green-600/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold text-lg">M</span>
            </div>
            <h2 className="text-sm font-semibold text-green-400 mb-4">MBank</h2>

            <h1 className="text-2xl font-bold mb-2">{t.payment.title}</h1>
            <p className="text-muted-foreground mb-2">
              {fileName}
            </p>
            <p className="text-muted-foreground mb-6">
              {t.payment.amount}: <span className="text-foreground font-bold text-xl">500 сом</span>
            </p>

            {/* QR Code */}
            <div className="glass rounded-xl p-6 mb-6 inline-block">
              <img src={mbankQr} alt="MBank QR" className="w-48 h-48 rounded-lg mx-auto object-contain" />
              <p className="text-xs text-muted-foreground mt-3">{t.payment.scanQr}</p>
            </div>

            {status === "verifying" ? (
              <Button disabled className="w-full flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.payment.processing}
              </Button>
            ) : (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white neon-glow"
                onClick={handleIPaid}
              >
                {t.payment.iPaid || "Мен төлөдүм ✓"}
              </Button>
            )}

            <Button
              asChild
              variant="ghost"
              className="w-full mt-3 text-muted-foreground"
            >
              <Link to="/analysis">← Артка</Link>
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Payment;
