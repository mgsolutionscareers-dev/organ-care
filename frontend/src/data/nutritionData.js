export const nutritionData = [
  {
    organId: "heart",
    organName: "Heart",
    title: "Cardiovascular Nutritional Health",
    subtitle: "Evidence-based foods for vascular flexibility, lipid regulation, and normal arterial pressure.",
    heroImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    keyNutrients: ["Omega-3 Fatty Acids", "Soluble Fiber (Beta-Glucan)", "Potassium", "Polyphenols", "Magnesium"],
    recommendedCategories: {
      fruits: [
        { name: "Blueberries & Blackberries", detail: "Loaded with anthocyanins, antioxidants shown to support endothelial nitric oxide bioavailability." },
        { name: "Pomegranates", detail: "Rich in punicalagins that help protect low-density lipoprotein (LDL) from oxidative damage." },
        { name: "Avocados", detail: "Provides monounsaturated oleic acid and potassium which supports healthy systemic blood pressure." }
      ],
      vegetables: [
        { name: "Dark Leafy Greens (Spinach, Swiss Chard)", detail: "High in dietary nitrates, converting to nitric oxide to dilate blood vessels, plus Vitamin K1." },
        { name: "Beets", detail: "Clinically observed to lower resting blood pressure through natural inorganic nitrates." },
        { name: "Garlic", detail: "Contains allicin, known to modestly reduce blood pressure and inhibit platelet aggregation." }
      ],
      nutsAndSeeds: [
        { name: "Walnuts", detail: "Top plant source of Alpha-Linolenic Acid (ALA), a plant-based Omega-3 essential fatty acid." },
        { name: "Flaxseeds & Chia Seeds", detail: "Provide rich soluble mucilage fiber and lignans for cholesterol excretion." }
      ],
      wholeGrains: [
        { name: "Steel-Cut Oats", detail: "Rich in beta-glucan soluble fiber that binds bile acids in the gut to lower circulating LDL cholesterol." },
        { name: "Barley & Quinoa", detail: "High-fiber ancient grains with low glycemic impact preventing rapid postprandial insulin surges." }
      ],
      proteins: [
        { name: "Wild Alaskan Salmon & Sardines", detail: "Abundant in EPA and DHA omega-3s, which decrease serum triglycerides and dampen vascular inflammation." },
        { name: "Legumes (Lentils, Black Beans)", detail: "Excellent plant protein with zero saturated fat and high folate and potassium." }
      ]
    },
    generalGuidance: "Prioritize Mediterranean-style dietary patterns rich in whole plants, extra virgin olive oil, and seafood while minimizing ultra-processed foods.",
    foodsToLimit: [
      "Ultra-processed cold cuts and sausages containing excessive sodium and nitrite preservatives.",
      "Industrial trans fatty acids found in partially hydrogenated oils and commercial frying.",
      "Excessive sodium exceeding 2,000 mg/day.",
      "Sugar-sweetened beverages and added table sugars that raise triglycerides."
    ],
    scientificDisclaimer: "Nutrition is a cornerstone of cardiovascular wellness, but does not substitute for prescribed medical therapies, anti-hypertensives, or emergency cardiac care. Individual nutritional requirements vary, especially in people with renal or heart failure where potassium and fluid restrictions may apply."
  },
  {
    organId: "brain",
    organName: "Brain",
    title: "Neuroprotective Cognitive Nutrition",
    subtitle: "Nourish cognitive vitality, neurotransmitter synthesis, and synaptic plasticity.",
    heroImage: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    keyNutrients: ["DHA (Omega-3)", "Choline", "Lutein & Zeaxanthin", "Folate (B9)", "Flavonoids"],
    recommendedCategories: {
      fruits: [
        { name: "Wild Blueberries", detail: "Crosses the blood-brain barrier to concentrate in learning and memory centers of the hippocampus." },
        { name: "Oranges & Citrus", detail: "Provides abundant Vitamin C, protecting neurons against reactive oxygen species." }
      ],
      vegetables: [
        { name: "Broccoli & Brussels Sprouts", detail: "High in glucosinolates and vitamin K, necessary for forming sphingolipids in brain cell membranes." },
        { name: "Kale & Spinach", detail: "Packed with lutein, beta-carotene, and folate which slow cognitive decline in longitudinal studies." }
      ],
      nutsAndSeeds: [
        { name: "Pumpkin Seeds", detail: "Rich in zinc (nerve signaling), magnesium (learning/memory), and copper." },
        { name: "Walnuts", detail: "Shape resembles the human brain; rich in DHA-precursors and neuroprotective polyphenols." }
      ],
      wholeGrains: [
        { name: "Whole Oats & Brown Rice", detail: "Deliver steady, sustained glucose to the brain without erratic spikes and crashes." }
      ],
      proteins: [
        { name: "Pasture-Raised Eggs", detail: "Yolks are the premier dietary source of choline, the biochemical precursor to acetylcholine (neurotransmitter for memory and mood)." },
        { name: "Fatty Cold-Water Fish", detail: "Directly supplies DHA, constituting 30-40% of the gray matter of cerebral cortex cell membranes." }
      ]
    },
    generalGuidance: "Adopt the MIND (Mediterranean-DASH Intervention for Neurodegenerative Delay) diet, emphasizing berries, leafy greens, nuts, and olive oil.",
    foodsToLimit: [
      "Refined carbohydrates and high-fructose syrups that impair hippocampal insulin sensitivity.",
      "Heavy alcohol consumption that induces neural atrophy and interferes with REM sleep consolidation.",
      "Processed snack foods loaded with oxidized vegetable oils."
    ],
    scientificDisclaimer: "Neuroprotective dietary patterns help support long-term cognitive resilience, but cannot reverse neurodegenerative illnesses such as Alzheimer's disease or acute neurological events."
  },
  {
    organId: "liver",
    organName: "Liver",
    title: "Hepatic Metabolic Support",
    subtitle: "Support phase I and phase II enzymatic detoxification pathways and reverse steatosis.",
    heroImage: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    keyNutrients: ["Glutathione Precursors", "Sulforaphane", "Silymarin", "Choline", "Betaine"],
    recommendedCategories: {
      fruits: [
        { name: "Grapefruit", detail: "Contains naringin and naringenin, antioxidants known to reduce hepatic inflammation and lipid buildup." },
        { name: "Berries", detail: "Supplies polyphenols that enhance hepatic enzyme response and protect hepatocytes." }
      ],
      vegetables: [
        { name: "Cruciferous Veggies (Broccoli, Cauliflower)", detail: "Increase levels of phase II detoxification enzymes and sulforaphane." },
        { name: "Beets & Artichokes", detail: "Contain betaine and caffeoylquinic acids that promote bile flow and lipid mobilization." },
        { name: "Garlic & Onions", detail: "Abundant in sulfur-containing alliin, essential for endogenous glutathione synthesis." }
      ],
      nutsAndSeeds: [
        { name: "Sunflower Seeds & Almonds", detail: "High in natural Vitamin E (alpha-tocopherol), recommended in clinical guidelines for non-diabetic NASH." }
      ],
      wholeGrains: [
        { name: "Oat Bran", detail: "Rich in beta-glucans which assist in lowering hepatic steatosis and visceral adiposity." }
      ],
      proteins: [
        { name: "Tofu, Tempeh & Legumes", detail: "Plant proteins lessen hepatic nitrogenous workload compared to excessive red meats." },
        { name: "Skinless Organic Chicken", detail: "Provides lean sulfur amino acids (methionine, cysteine) needed for glutathione conjugation." }
      ]
    },
    generalGuidance: "Filtered moderate black coffee consumption (2-3 cups daily) has strong epidemiological evidence showing reduced risk of fibrosis and cirrhosis.",
    foodsToLimit: [
      "Alcohol in all quantities if hepatic inflammation, elevated enzymes, or hepatitis is present.",
      "High-Fructose Corn Syrup (HFCS) which bypasses normal metabolic checks and converts directly into hepatic triglycerides.",
      "Excessive saturated animal fat and deep-fried fast foods."
    ],
    scientificDisclaimer: "Foods support normal liver physiology. However, advanced liver disease requires strict specialist management, sodium control, and medication oversight."
  },
  {
    organId: "kidneys",
    organName: "Kidneys",
    title: "Renal Filtration & Hydration Nutrition",
    subtitle: "Protect nephron integrity, balance electrolytes, and prevent crystalluria.",
    heroImage: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
    keyNutrients: ["Balanced Potassium", "Low Dietary Sodium", "Citrate", "Flavonoids", "Pure Water"],
    recommendedCategories: {
      fruits: [
        { name: "Cranberries", detail: "Contain Type-A proanthocyanidins that prevent bacterial adhesion to urothelial membranes." },
        { name: "Blueberries & Apples", detail: "Low in potassium and phosphorus, making them renal-safe while delivering antioxidant fiber." },
        { name: "Lemons & Limes", detail: "High in dietary citrate which binds calcium in urine, inhibiting calcium oxalate stone nucleation." }
      ],
      vegetables: [
        { name: "Red Bell Peppers", detail: "Low in potassium but exceptionally high in vitamins C, A, and B6." },
        { name: "Cauliflower & Cabbage", detail: "Versatile low-potassium cruciferous vegetables rich in indoles and fiber." },
        { name: "Garlic & Scallions", detail: "Provides robust savory flavor without adding sodium, a vital swap for renal health." }
      ],
      nutsAndSeeds: [
        { name: "Macadamia Nuts", detail: "Lower in phosphorus and potassium than traditional almonds or peanuts." }
      ],
      wholeGrains: [
        { name: "Bulgur & Buckwheat", detail: "Nutritious whole grains that contain less phosphorus than standard whole wheat." }
      ],
      proteins: [
        { name: "Egg Whites", detail: "The purest biological value protein with minimal phosphorus compared to yolks or organ meats." },
        { name: "Fresh White Fish (Cod, Halibut)", detail: "High-quality lean protein that places lower filtration stress on glomeruli." }
      ]
    },
    generalGuidance: "Ensure consistent hydration throughout the day. Urine should be light straw-colored. Avoid rapid dehydration which can trigger acute kidney injury (AKI).",
    foodsToLimit: [
      "Inorganic phosphate additives found in dark sodas, processed meats, and shelf-stable packaged cheeses.",
      "Table salt and high-sodium convenience meals (keep sodium under 1,500-2,000 mg/day).",
      "Excessive high-dose Vitamin C supplements (>1000 mg/day) which can metabolize to oxalate in stone-formers."
    ],
    scientificDisclaimer: "People with established Chronic Kidney Disease (CKD Stages 3-5) require personalized renal dietitian guidance, as potassium, phosphorus, and protein restrictions differ markedly from healthy individuals."
  },
  {
    organId: "lungs",
    organName: "Lungs",
    title: "Pulmonary Cellular Health",
    subtitle: "Support alveolar surfactant, ease airway inflammation, and neutralize inhaled oxidants.",
    heroImage: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1200&q=80",
    keyNutrients: ["Vitamin C", "Carotenoids (Beta-Carotene, Lycopene)", "Magnesium", "Quercetin", "Omega-3s"],
    recommendedCategories: {
      fruits: [
        { name: "Apples & Pears", detail: "Rich in quercetin, a flavonoid clinically studied for dampening bronchial reactivity and mucus secretion." },
        { name: "Kiwi & Oranges", detail: "Deliver bioavailable Vitamin C which neutralizes free radicals in the epithelial lining fluid." }
      ],
      vegetables: [
        { name: "Carrots & Sweet Potatoes", detail: "Packed with carotenoids that protect mucosal epithelial tissues of the respiratory tract." },
        { name: "Tomatoes", detail: "Rich in lycopene, which has been shown to reduce airway inflammation in asthmatic adults." }
      ],
      nutsAndSeeds: [
        { name: "Chia Seeds & Hemp Seeds", detail: "Provide magnesium, which acts as a natural bronchodilator by relaxing smooth muscles around bronchi." }
      ],
      wholeGrains: [
        { name: "Barley & Brown Rice", detail: "Provide prebiotic fiber that nurtures the gut-lung immune axis via circulating SCFAs." }
      ],
      proteins: [
        { name: "Mackerel & Sardines", detail: "Omega-3 polyunsaturated fatty acids suppress pro-inflammatory leukotrienes involved in airway constriction." }
      ]
    },
    generalGuidance: "Drink green tea regularly; its epigallocatechin gallate (EGCG) exhibits antioxidant and anti-fibrotic properties in pulmonary tissue.",
    foodsToLimit: [
      "Sulfites used in dried fruits, pickled foods, and wine which can trigger acute bronchospasm.",
      "Excessive salt intake which can promote pulmonary fluid retention and airway sensitivity."
    ],
    scientificDisclaimer: "Nutrition bolsters mucosal resilience, but cannot cure asthma, COPD, or replace inhalers or emergency epinephrine."
  },
  {
    organId: "stomach",
    organName: "Digestive Tract & Stomach",
    title: "Gastric & Intestinal Mucosal Wellness",
    subtitle: "Protect the epithelial stomach lining, promote beneficial microbiome diversity, and regulate motility.",
    heroImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80",
    keyNutrients: ["Prebiotic Inulin", "L-Glutamine", "Zinc Carnosine", "Pectin", "Probiotics"],
    recommendedCategories: {
      fruits: [
        { name: "Papaya & Pineapples", detail: "Contain proteolytic digestive enzymes (papain and bromelain) assisting protein breakdown." },
        { name: "Bananas", detail: "Contain pectin and natural antacid properties that coat and soothe the esophageal and gastric lining." }
      ],
      vegetables: [
        { name: "Cooked Carrots & Zucchini", detail: "Gentle on sensitive stomach linings and rich in soluble fiber." },
        { name: "Ginger", detail: "Renowned pro-kinetic and antiemetic that accelerates gastric emptying and relieves nausea." }
      ],
      nutsAndSeeds: [
        { name: "Ground Flaxseed", detail: "Forms a protective soothing gel that cushions the mucosal wall and supports smooth transit." }
      ],
      wholeGrains: [
        { name: "Cooked Rolled Oats", detail: "Binds gastric juices while providing prebiotic sustenance for intestinal microflora." }
      ],
      proteins: [
        { name: "Bone Broth / Lentil Purees", detail: "Rich in amino acids like proline and glutamine that fuel intestinal epithelial repair." },
        { name: "Live Active Culture Yogurt / Kefir", detail: "Supplies beneficial Lactobacillus and Bifidobacterium strains." }
      ]
    },
    generalGuidance: "Eat in a calm, seated environment without screens; mindful chewing activates cephalic phase digestive enzymes.",
    foodsToLimit: [
      "Deep-fried battered foods that delay gastric emptying and induce severe reflux.",
      "Extremely sharp chili, black pepper, and vinegar during active gastritis or ulcer episodes.",
      "Excessive coffee, carbonated sodas, and energy drinks."
    ],
    scientificDisclaimer: "If you experience dark black stools, persistent vomiting, or difficulty swallowing, consult a gastroenterologist immediately."
  }
];

