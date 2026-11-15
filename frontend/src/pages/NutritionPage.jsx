import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Apple, 
  Carrot, 
  Wheat, 
  Beef, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Brain, 
  Wind, 
  Sparkles,
  Info
} from 'lucide-react';
import { nutritionData } from '../data/nutritionData.js';

export const NutritionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const organParam = searchParams.get('organ') || 'heart';
  
  const [selectedNutrition, setSelectedNutrition] = useState(
    nutritionData.find(n => n.organId === organParam) || nutritionData[0]
  );

  useEffect(() => {
    const found = nutritionData.find(n => n.organId.toLowerCase() === organParam.toLowerCase());
    if (found) setSelectedNutrition(found);
  }, [organParam]);

  const handleSelectOrgan = (organId) => {
    setSearchParams({ organ: organId });
  };

  const organPills = [
    { id: 'heart', label: 'Heart', icon: Heart, color: 'text-rose-500' },
    { id: 'brain', label: 'Brain', icon: Brain, color: 'text-purple-500' },
    { id: 'liver', label: 'Liver', icon: Apple, color: 'text-amber-500' },
    { id: 'kidneys', label: 'Kidneys', icon: Carrot, color: 'text-sky-500' },
    { id: 'lungs', label: 'Lungs', icon: Wind, color: 'text-teal-500' },
    { id: 'stomach', label: 'Digestive', icon: Wheat, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ----------------- HERO BANNER ----------------- */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-900 via-navy-900 to-teal-950 text-white p-8 sm:p-12 mb-12 shadow-xl border border-teal-500/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                OrganCare Nutrition Centre
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                Eat Healthy, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                  Live Better.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                Discover organ-specific, evidence-informed dietary patterns that support cellular vitality and physiological resilience.
              </p>
              <div className="pt-2">
                <a
                  href="#categories"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-400 text-navy-950 font-extrabold text-sm shadow-md transition-all"
                >
                  Explore Nutrition <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80"
                  alt="Nutritious food bowl"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ----------------- ORGAN SELECTOR PILLS ----------------- */}
        <div className="mb-10" id="categories">
          <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 mb-3">
            Recommended for Your Organs
          </h2>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
            {organPills.map((pill) => {
              const Icon = pill.icon;
              const isSelected = selectedNutrition.organId === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => handleSelectOrgan(pill.id)}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 scale-105'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : pill.color}`} />
                  {pill.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ----------------- ACTIVE NUTRITION DETAILS ----------------- */}
        <div className="space-y-8">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Nutritional Profile
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
                {selectedNutrition.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                {selectedNutrition.subtitle}
              </p>
            </div>

            {/* Key Nutrients Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {selectedNutrition.keyNutrients.map((nut, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200/60"
                >
                  {nut}
                </span>
              ))}
            </div>
          </div>

          {/* Grid of Food Categories (Fruits, Veggies, Nuts, Grains, Proteins) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Category: Fruits */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-500 font-bold text-sm mb-4">
                <Apple className="w-5 h-5" />
                <span>Recommended Fruits</span>
              </div>
              <div className="space-y-3">
                {selectedNutrition.recommendedCategories.fruits.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Vegetables */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2.5 text-emerald-600 font-bold text-sm mb-4">
                <Carrot className="w-5 h-5" />
                <span>Beneficial Vegetables</span>
              </div>
              <div className="space-y-3">
                {selectedNutrition.recommendedCategories.vegetables.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Nuts & Seeds */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2.5 text-amber-600 font-bold text-sm mb-4">
                <Wheat className="w-5 h-5" />
                <span>Nuts & Healthy Seeds</span>
              </div>
              <div className="space-y-3">
                {selectedNutrition.recommendedCategories.nutsAndSeeds.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Whole Grains */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2.5 text-sky-600 font-bold text-sm mb-4">
                <Wheat className="w-5 h-5" />
                <span>Whole Grains & Fiber</span>
              </div>
              <div className="space-y-3">
                {selectedNutrition.recommendedCategories.wholeGrains.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: High Quality Proteins */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2.5 text-purple-600 font-bold text-sm mb-4">
                <Beef className="w-5 h-5" />
                <span>Bioavailable Protein Sources</span>
              </div>
              <div className="space-y-3">
                {selectedNutrition.recommendedCategories.proteins.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50">
                    <h4 className="text-xs font-bold text-slate-800">{item.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Category: Foods & Habits to Limit */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600 font-bold text-sm mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span>Foods & Habits to Limit</span>
              </div>
              <div className="space-y-2.5">
                {selectedNutrition.foodsToLimit.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-rose-50/70 border border-rose-100 flex items-start gap-2 text-xs text-rose-900 font-medium">
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Scientific Medical Disclaimer Banner */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-1">Scientific & Nutritional Disclaimer</span>
              {selectedNutrition.scientificDisclaimer}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

