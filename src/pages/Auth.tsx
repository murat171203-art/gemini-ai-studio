import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Auth = () => {
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <motion.div
        className="glass neon-border rounded-2xl p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? t.auth.loginTitle : t.auth.registerTitle}
        </h1>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {!isLogin && (
            <div className="space-y-2">
              <Label>{t.auth.fullName}</Label>
              <Input placeholder={t.auth.fullName} className="bg-secondary border-border/50" />
            </div>
          )}
          <div className="space-y-2">
            <Label>{t.auth.email}</Label>
            <Input type="email" placeholder={t.auth.email} className="bg-secondary border-border/50" />
          </div>
          <div className="space-y-2">
            <Label>{t.auth.password}</Label>
            <Input type="password" placeholder={t.auth.password} className="bg-secondary border-border/50" />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <Label>{t.auth.confirmPassword}</Label>
              <Input type="password" placeholder={t.auth.confirmPassword} className="bg-secondary border-border/50" />
            </div>
          )}
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
            {isLogin ? t.auth.loginBtn : t.auth.registerBtn}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? t.auth.registerBtn : t.auth.loginBtn}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
