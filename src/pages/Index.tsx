import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Upload, Brain, CreditCard, Download, Sparkles, Zap, Shield, FileStack, ChevronDown, MapPin, Clock, Phone, ExternalLink, MessageCircle } from "lucide-react";
import WeatherCurrency from "@/components/WeatherCurrency";
import OKeyBanner from "@/components/OKeyBanner";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const { t } = useLanguage();

  const steps = [
    { icon: Upload, title: t.steps.step1Title, desc: t.steps.step1Desc, color: "from-primary to-neon-blue" },
    { icon: Brain, title: t.steps.step2Title, desc: t.steps.step2Desc, color: "from-neon-blue to-neon-purple" },
    { icon: CreditCard, title: t.steps.step3Title, desc: t.steps.step3Desc, color: "from-neon-purple to-primary" },
    { icon: Download, title: t.steps.step4Title, desc: t.steps.step4Desc, color: "from-primary to-neon-blue" },
  ];

  const features = [
    { icon: Sparkles, title: t.features.ai, desc: t.features.aiDesc },
    { icon: Zap, title: t.features.fast, desc: t.features.fastDesc },
    { icon: Shield, title: t.features.secure, desc: t.features.secureDesc },
    { icon: FileStack, title: t.features.formats, desc: t.features.formatsDesc },
  ];

  const faqs = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <div className="relative">
      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-neon" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse-neon" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block glass neon-border px-4 py-1.5 rounded-full text-xs font-medium text-primary mb-6">
              {t.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            {t.hero.title}
            <span className="gradient-text">{t.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow text-base px-8">
              <Link to="/upload">{t.hero.cta}</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border hover:border-primary/50 text-base px-8">
              <a href="#steps">{t.hero.ctaSecondary}</a>
            </Button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="mt-20 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.steps.title}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-6 relative group hover:neon-border transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="absolute top-4 right-4 text-4xl font-bold text-muted/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.features.title}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-6 flex gap-4 items-start hover:neon-border transition-all duration-300"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.faq.title}
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <AccordionItem value={`faq-${i}`} className="glass rounded-xl border-border/30 px-4">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>


      {/* Branches */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {t.footer.branches}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {t.footer.branchList.map((branch, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-6 hover:neon-border hover:bg-yellow-400/10 transition-all duration-300 space-y-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
              >
                <h3 className="font-semibold text-lg text-foreground">{branch.name}</h3>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{branch.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <a href={`tel:${branch.phone.replace(/\s/g, "")}`} className="hover:text-primary transition-colors">
                    {branch.phone}
                  </a>
                </div>
                <a
                  href={branch.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t.footer.openMap}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            className="glass neon-border rounded-2xl p-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
              {t.hero.cta}
            </h2>
            <p className="text-muted-foreground mb-8">{t.hero.subtitle}</p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow px-10">
              <Link to="/upload">{t.hero.cta}</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
