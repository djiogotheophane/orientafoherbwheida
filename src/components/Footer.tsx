import React from 'react';
import { Leaf, Heart, ShieldAlert } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-stone-300 border-t border-stone-800" id="contact">
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Col 1: About */}
          <div className="flex flex-col items-start text-left">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/src/assets/images/fohowhope_logo_1783630501861.jpg" 
                alt="Fohowhope Logo" 
                className="w-12 h-12 object-contain rounded-full border border-stone-800" 
                referrerPolicy="no-referrer"
              />
              <span className="text-lg font-display font-semibold italic text-white tracking-wide">
                Orienta
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed mb-6">
              Orienta Foherb Whieda est distributeur agréé indépendant des produits de haute technologie FOHOW & FOHERB. Nous offrons le meilleur de la médecine traditionnelle orientale au service de votre bien-être contemporain.
            </p>
            <div className="flex items-center gap-3 text-stone-400 text-xs">
              <Heart className="w-4 h-4 text-[#bf5a5a] fill-current" />
              <span>Votre vitalité est notre priorité.</span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="flex flex-col items-start text-left">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4 border-b border-stone-800 pb-2 w-full">
              Catégories de Produits
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#nos-produits" className="text-stone-400 hover:text-accent transition-colors">Compléments alimentaires</a>
              </li>
              <li>
                <a href="#nos-produits" className="text-stone-400 hover:text-accent transition-colors">Produits de bien-être</a>
              </li>
              <li>
                <a href="#nos-produits" className="text-stone-400 hover:text-accent transition-colors">Hygiène et soins</a>
              </li>
              <li>
                <a href="#nos-produits" className="text-stone-400 hover:text-accent transition-colors">Boissons fonctionnelles</a>
              </li>
              <li>
                <a href="#nos-produits" className="text-stone-400 hover:text-accent transition-colors">Appareils de santé</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Disclaimer */}
          <div className="flex flex-col items-start text-left bg-stone-950/60 p-4 rounded-xl border border-stone-800/80">
            <div className="flex items-center gap-2 text-amber-500 mb-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Avertissement Légal</h4>
            </div>
            <p className="text-[10px] text-stone-400 leading-normal">
              Les produits présentés sur ce site sont des compléments alimentaires et des appareils de bien-être, et non des médicaments. Ils ne peuvent en aucun cas se substituer à une alimentation variée et équilibrée, ni remplacer un diagnostic médical ou un traitement prescrit par votre médecin.
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {currentYear} Orienta Foherb Whieda. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#legal" className="hover:text-stone-300 transition-colors">Mentions légales</a>
            <a href="#privacy" className="hover:text-stone-300 transition-colors">Confidentialité</a>
            <a href="#terms" className="hover:text-stone-300 transition-colors">CGV / CGU</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
