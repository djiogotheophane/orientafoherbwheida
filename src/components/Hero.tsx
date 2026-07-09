import React from 'react';
import { Compass, Leaf, ShieldCheck, Heart, ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';

// Use the generated image path from AI Studio
const HERO_BANNER_IMG = "/src/assets/images/hero_banner_1783624456299.jpg";

export default function Hero() {
  return (
    <div 
      id="hero" 
      className="relative bg-cover bg-center overflow-hidden py-12 lg:py-20 border-b border-stone-800"
      style={{ backgroundImage: `url("/src/assets/images/fohowhope_hero_banner_1783630258715.jpg")` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Text Left Panel */}
          <div className="lg:w-1/2 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-stone-100 text-[11px] font-bold tracking-wider uppercase mb-6 shadow-sm"
            >
              <Leaf className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Partenaire Officiel FOHOW &amp; FOHERB</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-medium italic text-white tracking-wide leading-tight mb-5"
            >
              Orienta <span className="text-[#c5a880] font-sans font-light not-italic block text-2xl sm:text-3xl tracking-widest mt-1 uppercase">Foherb Whieda</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone-200/90 text-xs sm:text-sm leading-relaxed mb-8 max-w-lg"
            >
              Orienta Foherb Whieda est une société spécialisée dans la vente de produits de santé d'excellence issus de la marque de prestige internationale <a href="https://fohow.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#c5a880] text-[#c5a880] font-semibold">fohow.com</a>. Nous proposons des compléments alimentaires, des produits de bien-être, d'hygiène et soins, des boissons fonctionnelles ainsi que des appareils de santé avancés. Profitez également d'un véritable suivi d'orientation personnalisé dans chacun de ces domaines.
            </motion.p>

            {/* Quick Action Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 w-full sm:w-auto"
            >
              <a
                id="hero-shop-btn"
                href="#nos-produits"
                className="w-full sm:w-auto text-center bg-[#c5a880] hover:bg-white hover:text-ink text-white font-semibold text-xs py-3.5 px-8 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Découvrir nos Produits</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </a>
              
              <a
                id="hero-contact-btn"
                href={`https://api.whatsapp.com/send?phone=237697254607&text=${encodeURIComponent(
                  "Bonjour, je souhaite obtenir plus d'informations sur vos produits."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-xs py-3.5 px-6 rounded-xl transition-all"
              >
                Nous Contacter
              </a>
            </motion.div>

            {/* Value Highlights */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-white/15 w-full"
            >
              <div className="flex flex-col">
                <span className="text-white font-display font-semibold italic text-xl sm:text-2xl leading-none">100%</span>
                <span className="text-[#c5a880] text-[10px] font-semibold uppercase tracking-wider mt-1.5">Naturel</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-semibold italic text-xl sm:text-2xl leading-none">BioTech</span>
                <span className="text-[#c5a880] text-[10px] font-semibold uppercase tracking-wider mt-1.5">Avancée</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-semibold italic text-xl sm:text-2xl leading-none">Standard</span>
                <span className="text-[#c5a880] text-[10px] font-semibold uppercase tracking-wider mt-1.5">GMP Certifié</span>
              </div>
            </motion.div>
          </div>

          {/* Banner Right Panel */}
          <div className="lg:w-1/2 w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 bg-black/40 backdrop-blur-md"
            >
              <img
                src={HERO_BANNER_IMG}
                alt="Orienta Foherb Whieda banner"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover transform hover:scale-101 transition-transform duration-500 rounded-2xl"
              />
              {/* Floating aesthetic badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#1c1917]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2e2a24] border border-white/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5.5 h-5.5 text-[#c5a880]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold uppercase text-[#c5a880] tracking-wider">Garantie Pureté</span>
                  <span className="text-xs font-semibold text-stone-200">Authenticité FOHOW & FOHERB certifiée</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
