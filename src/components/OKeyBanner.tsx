import { motion } from "framer-motion";
import { Bot, ExternalLink } from "lucide-react";

const OKeyBanner = () => {
  return (
    <motion.a
      href="https://o-key.ai/invite/167d4c94"
      target="_blank"
      rel="noopener noreferrer"
      className="block glass neon-border rounded-xl p-5 hover:bg-primary/5 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-neon-blue flex items-center justify-center flex-shrink-0 group-hover:neon-glow transition-all duration-300">
          <Bot className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base neon-text">O-Key AI</h3>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            AI жардамчы — суроолоруңузга жооп берет, текст жазат, котормо кылат 🤖
          </p>
        </div>
      </div>
    </motion.a>
  );
};

export default OKeyBanner;
