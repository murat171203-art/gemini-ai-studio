import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { CreditCard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payment = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        className="glass neon-border rounded-2xl p-8 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-14 h-14 rounded-xl bg-primary/20 neon-border flex items-center justify-center mx-auto mb-6">
          <CreditCard className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t.payment.title}</h1>
        <p className="text-muted-foreground mb-6">
          {t.payment.amount}: <span className="text-foreground font-bold text-xl">250 сом</span>
        </p>

        {/* QR Code placeholder */}
        <div className="glass rounded-xl p-6 mb-6 inline-block">
          <div className="w-48 h-48 bg-secondary rounded-lg flex items-center justify-center mx-auto">
            <QrCode className="w-24 h-24 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground mt-3">{t.payment.scanQr}</p>
        </div>

        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
          {t.payment.payWithMbank}
        </Button>
      </motion.div>
    </div>
  );
};

export default Payment;
