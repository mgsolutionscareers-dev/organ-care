export const organsData = [
  {
    organId: "heart",
    name: "Heart",
    latinName: "Cor",
    tagline: "The powerhouse of life",
    system: "Cardiovascular System",
    layer: "Thoracic",
    coords3D: { x: -0.15, y: 0.55, z: 0.2 },
    cameraFocus: { position: [-0.3, 0.65, 1.4], target: [-0.1, 0.55, 0.1] },
    overview: "The heart is a muscular organ roughly the size of a closed fist, situated slightly to the left in the middle of your chest. It works continuously as the body's central pump, beating approximately 100,000 times a day to circulate roughly 2,000 gallons of oxygen- and nutrient-rich blood throughout your entire vascular system.",
    functions: [
      "Pumps oxygenated blood received from the lungs to tissues and vital organs across the body.",
      "Collects deoxygenated blood from systemic circulation and sends it back to the lungs for gas exchange.",
      "Maintains systemic arterial blood pressure required for organ perfusion.",
      "Regulates heart rate dynamically according to oxygen demands, metabolic strain, and emotional stress through intrinsic electrical pacemakers (Sinoatrial node).",
      "Secretes regulatory hormones such as Atrial Natriuretic Peptide (ANP) to balance fluid and sodium homeostasis."
    ],
    commonDiseases: [
      {
        name: "Coronary Artery Disease (CAD)",
        description: "Narrowing or blockage of the coronary arteries usually caused by atherosclerosis (plaque buildup), reducing blood supply to heart muscle."
      },
      {
        name: "Heart Failure",
        description: "A chronic condition where the heart muscle cannot pump blood as efficiently as normal, causing fluid retention and fatigue."
      },
      {
        name: "Cardiac Arrhythmias",
        description: "Irregular electrical heart rhythms, such as Atrial Fibrillation (AFib), where the heart beats too fast, too slow, or erratically."
      },
      {
        name: "Valvular Heart Disease",
        description: "Damage or defect in one of the four heart valves (mitral, aortic, tricuspid, pulmonary) impairing normal forward blood flow."
      }
    ],
    warningSigns: [
      "Chest pressure, squeezing, fullness, or central crushing chest pain (Angina).",
      "Pain or discomfort radiating to the left shoulder, arms, neck, jaw, or upper back.",
      "Unexplained shortness of breath (Dyspnea) during routine activities or at rest.",
      "Sudden cold sweats, lightheadedness, dizziness, or syncope (fainting).",
      "Persistent rapid, pounding, or irregular heart palpitations.",
      "Swelling (edema) in ankles, feet, or lower legs."
    ],
    nutritionTips: {
      supportive: [
        "Fatty fish rich in Omega-3 fatty acids (salmon, mackerel, sardines).",
        "Berries (blueberries, strawberries, raspberries) high in anthocyanins and polyphenols.",
        "Leafy greens (spinach, kale, Swiss chard) providing vitamin K and dietary nitrates.",
        "Whole grains (oats, barley, quinoa) high in beta-glucan soluble fiber.",
        "Unsalted raw nuts (walnuts, almonds) and seeds (flax, chia).",
        "Extra virgin olive oil as the primary healthy dietary fat."
      ],
      toLimit: [
        "Ultra-processed meats (sausages, bacon, hot dogs) high in sodium and nitrates.",
        "High sodium intake (over 2,300 mg/day; ideally <1,500 mg/day for elevated BP).",
        "Trans fats and hydrogenated oils commonly found in fried commercial pastries.",
        "Refined sugars, sugar-sweetened beverages, and excessive alcohol."
      ]
    },
    lifestyleRecommendations: [
      "Engage in at least 150 minutes of moderate-intensity aerobic exercise (e.g. brisk walking) weekly.",
      "Maintain a consistent sleep duration of 7-9 hours to allow blood pressure dip during nocturnal rest.",
      "Practice stress-reduction practices such as diaphragmatic breathing or mindfulness meditation.",
      "Complete smoking cessation and avoid exposure to secondhand smoke.",
      "Monitor blood pressure, fasting lipid panel, and blood glucose routinely."
    ],
    recommendedSpecialist: {
      title: "Cardiologist",
      specialtyKey: "cardiology",
      description: "A specialized physician who diagnoses, treats, and prevents diseases of the cardiovascular system, heart valves, and blood vessels.",
      qualifications: "MBBS, MD (Medicine), DM / Fellowship in Cardiology, FACC / FRCP."
    },
    emergencyGuidance: "CRITICAL: If you or someone nearby experiences sudden chest pain lasting more than 5 minutes, radiating pain to the jaw/arm, or severe difficulty breathing, immediately dial local emergency services (911 / 112 / 999). Do not drive yourself.",
    colorAccent: "#EF4444"
  },
  {
    organId: "brain",
    name: "Brain",
    latinName: "Encephalon",
    tagline: "The command center of consciousness",
    system: "Nervous System",
    layer: "Cranial",
    coords3D: { x: 0, y: 1.45, z: 0.1 },
    cameraFocus: { position: [0, 1.55, 1.2], target: [0, 1.45, 0.05] },
    overview: "Weighing approximately 3 pounds (1.4 kg), the human brain contains around 86 billion neurons interconnected by trillions of synaptic pathways. It serves as the master control center for speech, motor function, memory, emotion, perception, involuntary autonomic functions, and human cognition.",
    functions: [
      "Coordinates thought, memory, emotion, touch, motor skills, vision, breathing, temperature, and hunger.",
      "Processes sensory signals received from eyes, ears, skin, nose, and tongue.",
      "Executes voluntary muscular movements via the motor cortex and cerebellum.",
      "Governs autonomic homeostatic cycles via the hypothalamus and brainstem (sleep-wake cycles, circadian rhythm, heart rate).",
      "Stores short-term and long-term autobiographical and procedural memories."
    ],
    commonDiseases: [
      {
        name: "Stroke (Ischemic or Hemorrhagic)",
        description: "A medical emergency caused by disrupted blood flow to brain tissue, resulting in rapid neuronal hypoxia and cell death."
      },
      {
        name: "Alzheimer's Disease & Dementia",
        description: "A progressive neurodegenerative condition characterized by amyloid beta plaques and tau tangles leading to memory impairment."
      },
      {
        name: "Epilepsy",
        description: "A neurological disorder wherein sudden bursts of electrical activity trigger recurrent seizures."
      },
      {
        name: "Migraine & Chronic Headache Disorders",
        description: "Complex neurovascular events causing throbbing unilateral pain, aura, photophobia, and sensory sensitivity."
      }
    ],
    warningSigns: [
      "Sudden numbness or weakness in the face, arm, or leg, especially on one side of the body (FAST protocol).",
      "Sudden confusion, difficulty speaking, slurred speech, or trouble understanding speech.",
      "Sudden loss of vision in one or both eyes, or sudden diplopia (double vision).",
      "Sudden severe 'thunderclap' headache with no apparent antecedent cause.",
      "Sudden dizziness, loss of balance, vertigo, or uncoordinated gait."
    ],
    nutritionTips: {
      supportive: [
        "Wild-caught fatty fish rich in DHA (docosahexaenoic acid).",
        "Blueberries and dark berries providing protective polyphenols across the blood-brain barrier.",
        "Curcumin (turmeric) with black pepper (piperine) for anti-inflammatory support.",
        "Dark leafy greens (lutein, folate, phylloquinone).",
        "Walnuts, pumpkin seeds, and dark chocolate (70%+ cacao) rich in magnesium and zinc."
      ],
      toLimit: [
        "Excessive added sugar and high fructose corn syrup linked to neuroinflammation.",
        "Heavy alcohol consumption that damages hippocampal neural integrity.",
        "Refined carbohydrates causing sharp glucose spikes and reactive hypoglycemia.",
        "Artificial trans-fat laden packaged bakery goods."
      ]
    },
    lifestyleRecommendations: [
      "Engage in lifelong cognitive learning, reading, instruments, and complex problem-solving.",
      "Prioritize 7-8 hours of uninterrupted restorative sleep for glymphatic metabolic clearance.",
      "Regular cardiovascular exercise increases Brain-Derived Neurotrophic Factor (BDNF).",
      "Protect your head with safety helmets during cycling or contact sports to prevent traumatic brain injury (TBI)."
    ],
    recommendedSpecialist: {
      title: "Neurologist",
      specialtyKey: "neurology",
      description: "A physician specialized in the diagnosis and nonsurgical treatment of disorders of the brain, spinal cord, nerves, and muscles.",
      qualifications: "MBBS, MD (Medicine / Pediatrics), DM / Board Certified in Neurology."
    },
    emergencyGuidance: "Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency. Act immediately for any suspected stroke.",
    colorAccent: "#8B5CF6"
  },
  {
    organId: "lungs",
    name: "Lungs",
    latinName: "Pulmones",
    tagline: "The breath of life and gas exchange",
    system: "Respiratory System",
    layer: "Thoracic",
    coords3D: { x: 0, y: 0.6, z: 0.05 },
    cameraFocus: { position: [0, 0.7, 1.5], target: [0, 0.6, 0.0] },
    overview: "The lungs are a pair of spongy, pinkish-gray organs occupying the majority of the thoracic cavity on either side of the heart. With a total internal alveolar surface area equal to roughly half a tennis court, the lungs take in oxygen from inhaled air and expel waste carbon dioxide through quiet, rhythmic respiration.",
    functions: [
      "Executes pulmonary gas exchange: diffuses oxygen into capillary bloodstream and clears carbon dioxide.",
      "Helps regulate systemic acid-base (pH) balance through metabolic carbon dioxide ventilation.",
      "Filters microscopic blood clots forming in systemic veins before they reach arterial circulation.",
      "Provides mucosal immune defenses with cilia and macrophages against inhaled pathogens and particulates.",
      "Enables vocalization by passing pressurized air across the larynx vocal folds."
    ],
    commonDiseases: [
      {
        name: "Asthma",
        description: "Chronic airway hyper-responsiveness with reversible bronchoconstriction, wheezing, and excessive mucus."
      },
      {
        name: "Chronic Obstructive Pulmonary Disease (COPD)",
        description: "Progressive inflammatory lung disease comprising chronic bronchitis and emphysema, usually associated with smoking or bio-mass smoke."
      },
      {
        name: "Pneumonia",
        description: "Infection inflaming the air sacs in one or both lungs, which may fill with fluid or purulent material."
      },
      {
        name: "Pulmonary Embolism",
        description: "A sudden blockage in a pulmonary artery caused by a detached venous blood clot (frequently from DVT in the legs)."
      }
    ],
    warningSigns: [
      "Chronic cough persisting for more than 3-4 weeks.",
      "Shortness of breath (Dyspnea) during routine walking or stairs.",
      "Audible wheezing or high-pitched whistling sounds during exhalation.",
      "Hemoptysis (coughing up blood or blood-tinged sputum).",
      "Unexplained sharp chest pain worsening with deep inhalation (pleuritic chest pain).",
      "Cyanosis (bluish tint on lips, fingernails, or tongue)."
    ],
    nutritionTips: {
      supportive: [
        "Apples and citrus fruits rich in vitamin C and quercetin.",
        "Cruciferous vegetables (broccoli, Brussels sprouts, cabbage) rich in glucosinolates.",
        "Green tea (EGCG) with anti-fibrotic and pulmonary antioxidant activity.",
        "Beetroots and beet greens rich in nitrates that relax pulmonary vascular endothelium.",
        "Carrots, tomatoes, and red bell peppers packed with carotenoids and lycopene."
      ],
      toLimit: [
        "Excessive salt that causes respiratory fluid retention and can exacerbate asthma.",
        "Processed deli meats with preservative nitrites.",
        "High sulfites found in some dried fruits and wine which trigger bronchospasm in sensitive asthmatics."
      ]
    },
    lifestyleRecommendations: [
      "Avoid all tobacco products, vaping, and exposure to secondhand or wood burning smoke.",
      "Maintain good indoor air quality with HEPA filtration and adequate room ventilation.",
      "Practice deep diaphragmatic breathing and pursed-lip breathing exercises.",
      "Stay current on seasonal influenza, pneumococcal, and RSV vaccinations.",
      "Engage in aerobic cardiovascular conditioning to optimize lung volumes and functional capacity."
    ],
    recommendedSpecialist: {
      title: "Pulmonologist",
      specialtyKey: "pulmonology",
      description: "A medical specialist focused on conditions of the respiratory system including the lungs, bronchi, and chest cavity.",
      qualifications: "MBBS, MD, DM / Fellowship in Pulmonology & Critical Care Medicine."
    },
    emergencyGuidance: "Severe difficulty catching breath, blue discoloration of lips, or sudden inability to speak in full sentences requires emergency hospital treatment.",
    colorAccent: "#06B6D4"
  },
  {
    organId: "liver",
    name: "Liver",
    latinName: "Hepar",
    tagline: "The body's ultimate detoxifier and metabolic factory",
    system: "Digestive & Metabolic System",
    layer: "Abdominal",
    coords3D: { x: 0.18, y: 0.28, z: 0.15 },
    cameraFocus: { position: [0.3, 0.35, 1.3], target: [0.15, 0.28, 0.1] },
    overview: "The liver is the body's largest internal organ, weighing around 3.3 pounds (1.5 kg). Situated in the upper right quadrant of the abdominal cavity beneath the diaphragm, the liver carries out over 500 vital biological functions including detoxification, protein synthesis, bile production, and glycogen storage. It is also the only internal organ capable of natural regeneration.",
    functions: [
      "Filters and metabolizes toxins, medications, alcohol, and metabolic byproducts (such as converting toxic ammonia to urea).",
      "Produces bile (up to 1 liter/day) essential for fat emulsification and fat-soluble vitamin absorption (A, D, E, K).",
      "Stores glycogen, iron, copper, and releases glucose as needed to maintain blood glucose homeostasis.",
      "Synthesizes crucial blood proteins, including albumin (maintains oncotic pressure) and coagulation clotting factors.",
      "Metabolizes hormones (estrogen, aldosterone) and breaks down senescent red blood cells into bilirubin."
    ],
    commonDiseases: [
      {
        name: "Non-Alcoholic Fatty Liver Disease (NAFLD / MASLD)",
        description: "Accumulation of excess fat in liver cells in individuals who drink little to no alcohol, tightly linked to metabolic syndrome and insulin resistance."
      },
      {
        name: "Viral Hepatitis (A, B, C)",
        description: "Viral infections triggering acute or chronic inflammation of liver parenchyma, risking fibrosis, cirrhosis, or hepatocellular carcinoma."
      },
      {
        name: "Liver Cirrhosis",
        description: "Late-stage hepatic fibrosis causing irreversible scarring and impaired liver architecture and portal hypertension."
      },
      {
        name: "Alcoholic Liver Disease",
        description: "Hepatic damage resulting from chronic heavy alcohol consumption spanning steatosis, hepatitis, and cirrhosis."
      }
    ],
    warningSigns: [
      "Jaundice (yellowing of the sclera of eyes and skin).",
      "Chronic dark amber or tea-colored urine alongside pale or clay-colored stool.",
      "Swelling and fluid accumulation in the abdomen (Ascites) or lower extremities.",
      "Persistent pruritus (generalized skin itching without obvious rash).",
      "Unexplained chronic fatigue, nausea, and loss of appetite.",
      "Easy bruising and prolonged bleeding from small cuts."
    ],
    nutritionTips: {
      supportive: [
        "Coffee (moderate intake of black filtered coffee is clinically associated with reduced hepatic fibrosis and enzyme elevation).",
        "Cruciferous vegetables (broccoli, cauliflower, Brussels sprouts) enhancing phase II liver detoxification enzymes.",
        "Grapefruit (rich in naringenin and naringin antioxidants).",
        "Garlic containing allicin and sulfur compounds activating liver enzymes.",
        "Artichokes, beetroot juice, and olive oil.",
        "Plenty of clean drinking water."
      ],
      toLimit: [
        "Heavy or binge alcohol consumption.",
        "Excessive fructose from sodas, fruit juices, and high-fructose corn syrup.",
        "Deep-fried foods and trans fats inducing hepatic oxidative stress.",
        "Unprescribed or excessive acetaminophen (paracetamol) and hepatotoxic supplements."
      ]
    },
    lifestyleRecommendations: [
      "Maintain a healthy body weight through balanced whole-food dietary patterns.",
      "Exercise regularly to mobilize hepatic fat stores and increase peripheral insulin sensitivity.",
      "Get vaccinated against Hepatitis A and Hepatitis B.",
      "Avoid sharing personal grooming items (razors, toothbrushes) and ensure sterile tattoo needles."
    ],
    recommendedSpecialist: {
      title: "Hepatologist / Gastroenterologist",
      specialtyKey: "gastroenterology",
      description: "A specialist with advanced clinical training in the liver, gallbladder, biliary tree, and pancreas.",
      qualifications: "MBBS, MD, DM in Gastroenterology / Fellowship in Hepatology."
    },
    emergencyGuidance: "Sudden onset jaundice, vomiting blood (hematemesis), or acute mental confusion (hepatic encephalopathy) requires immediate emergency medical evaluation.",
    colorAccent: "#D97706"
  },
  {
    organId: "stomach",
    name: "Stomach",
    latinName: "Gaster / Ventriculus",
    tagline: "The chemical blender of digestion",
    system: "Digestive System",
    layer: "Abdominal",
    coords3D: { x: -0.15, y: 0.25, z: 0.12 },
    cameraFocus: { position: [-0.25, 0.3, 1.25], target: [-0.12, 0.25, 0.08] },
    overview: "The stomach is a J-shaped muscular organ situated in the upper left part of the abdomen. Connecting the esophagus to the duodenum, it produces hydrochloric acid (pH 1.5–2.0) and proteolytic enzymes like pepsin to break down ingested meals into a semi-liquid mixture called chyme.",
    functions: [
      "Temporarily stores ingested solid foods and liquids.",
      "Mechanically churns and breaks down food through rhythmic peristaltic contractions.",
      "Secretes gastric juice (hydrochloric acid, pepsinogen, intrinsic factor, mucus).",
      "Sterilizes ingested food by eliminating harmful bacterial pathogens with low gastric pH.",
      "Secretes Intrinsic Factor essential for downstream Vitamin B12 absorption in the terminal ileum."
    ],
    commonDiseases: [
      {
        name: "Gastroesophageal Reflux Disease (GERD)",
        description: "Frequent retrograde flow of acidic stomach contents into the esophagus causing mucosal inflammation and heartburn."
      },
      {
        name: "Gastritis",
        description: "Inflammation or erosion of the gastric mucosal lining caused by H. pylori infection, chronic NSAID use, or stress."
      },
      {
        name: "Peptic Ulcer Disease",
        description: "Open sores that develop on the inside lining of the stomach or upper portion of the small intestine."
      },
      {
        name: "Gastroparesis",
        description: "Delayed gastric emptying in the absence of mechanical obstruction, common in long-standing diabetes."
      }
    ],
    warningSigns: [
      "Persistent burning pain in the epigastric region (upper abdomen) relieved or worsened by food.",
      "Frequent acid reflux, regurgitation, or persistent sour taste in mouth.",
      "Early satiety (feeling prematurely full after only a few bites of food).",
      "Persistent nausea, unexplained vomiting, or persistent bloating.",
      "Vomiting coffee-ground-like material or passing black tarry stools (melena).",
      "Unexplained rapid weight loss or difficulty swallowing (dysphagia)."
    ],
    nutritionTips: {
      supportive: [
        "Non-citrus fruits (bananas, melons, papayas) with gentle buffering enzymes.",
        "Oatmeal, brown rice, and whole oats providing soothing soluble fiber.",
        "Ginger and chamomile tea with natural carminative and anti-inflammatory properties.",
        "Fermented foods with live active cultures (kefir, plain yogurt).",
        "Lean poultry, tofu, and steamed vegetables."
      ],
      toLimit: [
        "Excessive caffeine and carbonated fizzy drinks that trigger lower esophageal sphincter relaxation.",
        "Extremely spicy, acidic (vinegar, excessive citrus), or deep-fried foods.",
        "Lying down flat immediately after large or heavy evening meals.",
        "Heavy alcohol and NSAID analgesics (ibuprofen, naproxen) without food."
      ]
    },
    lifestyleRecommendations: [
      "Eat smaller, more frequent meals rather than large, heavy sittings.",
      "Avoid eating within 3 hours of bedtime to prevent nocturnal acid reflux.",
      "Elevate the head of your bed by 6 inches if experiencing nocturnal reflux.",
      "Chew food slowly and thoroughly to ease mechanical digestion."
    ],
    recommendedSpecialist: {
      title: "Gastroenterologist",
      specialtyKey: "gastroenterology",
      description: "A medical specialist focused on the esophagus, stomach, intestines, liver, gallbladder, and pancreas.",
      qualifications: "MBBS, MD, DM in Gastroenterology."
    },
    emergencyGuidance: "Black tarry stools, vomiting bright red blood, or sudden severe abdominal rigidity require immediate hospital emergency admission.",
    colorAccent: "#F59E0B"
  },
  {
    organId: "pancreas",
    name: "Pancreas",
    latinName: "Pancreas",
    tagline: "The dual master of insulin and digestion",
    system: "Endocrine & Digestive System",
    layer: "Retroperitoneal",
    coords3D: { x: 0.0, y: 0.18, z: 0.05 },
    cameraFocus: { position: [0.0, 0.25, 1.2], target: [0.0, 0.18, 0.02] },
    overview: "The pancreas is an elongated, spongy organ resting horizontally across the back of the abdomen behind the stomach. It serves as both an exocrine gland (producing powerful digestive enzymes: amylase, lipase, protease) and an endocrine gland (containing the islets of Langerhans that secrete insulin and glucagon to control blood sugar).",
    functions: [
      "Synthesizes and secretes digestive enzymes into the duodenum to break down fats, carbohydrates, and proteins.",
      "Produces sodium bicarbonate to neutralize the harsh gastric acidity of incoming chyme.",
      "Islet Beta cells produce and secrete insulin to facilitate cellular glucose uptake.",
      "Islet Alpha cells secrete glucagon to mobilize hepatic glycogen into glucose during fasting.",
      "Secretes somatostatin to regulate gastrointestinal hormone secretion."
    ],
    commonDiseases: [
      {
        name: "Type 1 & Type 2 Diabetes Mellitus",
        description: "Metabolic conditions involving either autoimmune destruction of insulin-producing beta cells or progressive insulin resistance and secretory deficiency."
      },
      {
        name: "Acute & Chronic Pancreatitis",
        description: "Painful inflammation of pancreatic tissue caused by gallstone obstruction or chronic alcohol toxicity, where enzymes prematurely auto-digest pancreatic parenchyma."
      },
      {
        name: "Pancreatic Exocrine Insufficiency (PEI)",
        description: "Inability to properly digest food due to lack of digestive enzymes, resulting in malabsorption, weight loss, and steatorrhea."
      }
    ],
    warningSigns: [
      "Severe upper abdominal pain that radiates straight through to the back and worsens after eating.",
      "Unexplained dramatic weight loss despite normal appetite.",
      "Steatorrhea (pale, bulky, foul-smelling stools that float or appear greasy).",
      "Persistent nausea and vomiting during flare-ups.",
      "Excessive thirst (polydipsia), frequent urination (polyuria), and sudden blurred vision (signs of hyperglycemia)."
    ],
    nutritionTips: {
      supportive: [
        "Low-glycemic whole foods (legumes, lentils, beans, non-starchy vegetables).",
        "Garlic, onions, and fenugreek seeds containing compounds supporting insulin sensitivity.",
        "Spinach, blueberries, and cherries rich in anthocyanins protecting beta cells.",
        "Lean protein sources (skinless poultry, tofu, egg whites).",
        "Adequate hydration with pure water throughout the day."
      ],
      toLimit: [
        "Heavy alcohol intake (a primary trigger for acute pancreatitis).",
        "High-fat, greasy fried foods that place massive demand on pancreatic lipase.",
        "Refined sugar and sweetened beverages causing severe insulin surges."
      ]
    },
    lifestyleRecommendations: [
      "Maintain active physical fitness to preserve cellular insulin sensitivity.",
      "Avoid smoking, as tobacco use significantly elevates pancreatitis and pancreatic risk.",
      "Control lipid levels, particularly serum triglycerides (hypertriglyceridemia is a known cause of acute pancreatitis).",
      "Stay hydrated and avoid crash diets."
    ],
    recommendedSpecialist: {
      title: "Endocrinologist / Pancreatologist",
      specialtyKey: "endocrinology",
      description: "Physicians specializing in hormonal glands, diabetes management, metabolic balance, and pancreatic disease.",
      qualifications: "MBBS, MD, DM in Endocrinology or Gastroenterology."
    },
    emergencyGuidance: "Acute severe upper abdominal pain boring through to the back accompanied by persistent vomiting requires emergency care.",
    colorAccent: "#10B981"
  },
  {
    organId: "spleen",
    name: "Spleen",
    latinName: "Lien",
    tagline: "The silent guardian of the bloodstream",
    system: "Lymphatic & Immune System",
    layer: "Abdominal",
    coords3D: { x: -0.28, y: 0.32, z: 0.05 },
    cameraFocus: { position: [-0.4, 0.4, 1.3], target: [-0.25, 0.32, 0.02] },
    overview: "Located under the ribcage in the upper left quadrant of the abdomen, the spleen is the largest lymphoid organ in the body. It acts as an active biological filter for the bloodstream, culling old and damaged red blood cells while housing an elite reservoir of immune cells ready to fight encapsulated bacterial infections.",
    functions: [
      "Filters blood by recognizing and phagocytosing aged, abnormal, or mechanically damaged erythrocytes (red blood cells).",
      "Stores an emergency reservoir of platelets and white blood cells that can be rapidly deployed during trauma or sepsis.",
      "Houses white pulp containing B and T lymphocytes to generate antibodies against blood-borne pathogens.",
      "Recycles iron from metabolized hemoglobin and transfers it to the bone marrow for new red blood cell synthesis.",
      "Generates red blood cells during fetal development (extramedullary hematopoiesis)."
    ],
    commonDiseases: [
      {
        name: "Splenomegaly (Enlarged Spleen)",
        description: "Pathological enlargement of the spleen resulting from infections (mononucleosis), liver cirrhosis with portal hypertension, or hematologic cancers."
      },
      {
        name: "Hypersplenism",
        description: "An overactive enlarged spleen that prematurely removes too many normal blood cells, causing anemia, leukopenia, or thrombocytopenia."
      },
      {
        name: "Splenic Rupture",
        description: "A critical medical emergency usually caused by abdominal blunt trauma (or mononucleosis-induced fragility) leading to massive intra-abdominal hemorrhage."
      }
    ],
    warningSigns: [
      "Pain or fullness in the left upper abdomen that may spread up into the left shoulder.",
      "Feeling prematurely full after eating only small amounts of food (due to spleen pressing on the stomach).",
      "Frequent recurrent infections due to reduced circulating white blood cell counts.",
      "Fatigue, weakness, or pale skin due to anemia.",
      "Easy bruising or petechiae (tiny purple spots on skin) from low platelet count."
    ],
    nutritionTips: {
      supportive: [
        "Warm, easily digestible soups and stews rich in mineral broths.",
        "Citrus fruits, bell peppers, and kiwis rich in vitamin C for leukocyte support.",
        "Cooked root vegetables (sweet potatoes, squash, carrots).",
        "Lean meats, lentils, and pumpkin seeds providing bioavailable iron and zinc.",
        "Probiotics and fermented kefir."
      ],
      toLimit: [
        "Excessive cold or raw foods if experiencing digestive weakness.",
        "Refined sugar and artificial sweeteners that suppress leukocyte phagocytic capacity.",
        "Excessive alcohol that increases portal vein pressures and taxes the splenic circulation."
      ]
    },
    lifestyleRecommendations: [
      "Avoid contact sports if diagnosed with infectious mononucleosis (mono) until medical clearance.",
      "Always wear seatbelts properly to protect the upper abdomen from steering wheel impact in motor vehicles.",
      "Maintain updated immunizations against encapsulated bacteria (Pneumococcal, Meningococcal, Hib), especially if post-splenectomy."
    ],
    recommendedSpecialist: {
      title: "Hematologist / Immunologist",
      specialtyKey: "hematology",
      description: "A physician specialized in diseases of the blood, spleen, bone marrow, and immune system.",
      qualifications: "MBBS, MD, DM / Fellowship in Hematology & Oncology."
    },
    emergencyGuidance: "Severe sudden pain in the left upper abdomen following an injury or accompanied by dizziness and fainting requires immediate 911/emergency evaluation for splenic rupture.",
    colorAccent: "#6366F1"
  },
  {
    organId: "kidneys",
    name: "Kidneys",
    latinName: "Renes",
    tagline: "The master filters and fluid balancers",
    system: "Urinary & Renal System",
    layer: "Retroperitoneal",
    coords3D: { x: -0.16, y: 0.1, z: -0.1 },
    cameraFocus: { position: [-0.25, 0.15, 1.3], target: [-0.14, 0.1, -0.05] },
    overview: "The kidneys are a pair of bean-shaped organs, each about the size of a fist, situated retroperitoneally on either side of the spine just below the ribcage. Every day, they filter approximately 120 to 150 quarts of blood to produce 1 to 2 quarts of urine, meticulously calibrating electrolytes, blood pressure, and red blood cell production.",
    functions: [
      "Filters waste products from metabolic activity (urea, creatinine, uric acid) from the blood.",
      "Maintains precise fluid balance and electrolyte concentrations (sodium, potassium, calcium, phosphate).",
      "Regulates systemic blood pressure through the secretion of the enzyme renin (RAAS pathway).",
      "Produces Erythropoietin (EPO), the essential hormone stimulating bone marrow red blood cell production.",
      "Activates Vitamin D into its active hormonal form (Calcitriol) to regulate calcium absorption and bone density."
    ],
    commonDiseases: [
      {
        name: "Chronic Kidney Disease (CKD)",
        description: "Gradual long-term loss of kidney function over months or years, most commonly driven by diabetes and chronic hypertension."
      },
      {
        name: "Nephrolithiasis (Kidney Stones)",
        description: "Hard mineral and salt deposits (calcium oxalate, uric acid) that crystallize in concentrated urine and can obstruct the ureter."
      },
      {
        name: "Glomerulonephritis",
        description: "Inflammation of the tiny capillary filtration units in the kidneys (glomeruli), leading to hematuria and proteinuria."
      },
      {
        name: "Polycystic Kidney Disease (PKD)",
        description: "A genetic disorder causing numerous fluid-filled cysts to enlarge within the renal parenchyma, destroying functional nephrons."
      }
    ],
    warningSigns: [
      "Swelling (edema) in the hands, face, ankles, or feet due to fluid retention.",
      "Foamy, frothy urine (indicative of protein leakage/proteinuria).",
      "Pink, red, or cola-colored urine (gross hematuria).",
      "Sudden severe, spasmodic pain in the flank, back, or groin (characteristic of kidney stones).",
      "Noticeable change in frequency or volume of urination, especially waking frequently at night (nocturia).",
      "Persistent metallic taste in mouth, ammonia breath, or uremic fatigue."
    ],
    nutritionTips: {
      supportive: [
        "Adequate pure water consumption (typically 2-3 liters daily to keep urine pale yellow, unless on clinical fluid restriction).",
        "Cranberries and pure unsweetened cranberry juice to deter bacterial adhesion to urothelium.",
        "Red bell peppers, cauliflower, and cabbage (low in potassium for vulnerable renal patients).",
        "Garlic and onions as flavor enhancers to replace dietary sodium.",
        "Blueberries and raspberries packed with antioxidant flavonoids."
      ],
      toLimit: [
        "Excessive dietary sodium (causes water retention and elevates intraglomerular pressure).",
        "Excessive animal protein loads that increase renal hyperfiltration.",
        "Heavy intake of cola beverages and processed foods loaded with inorganic phosphate additives.",
        "High oxalate foods in individuals prone to calcium oxalate stone formation."
      ]
    },
    lifestyleRecommendations: [
      "Routinely monitor and tightly control blood pressure (< 130/80 mmHg).",
      "Maintain tight blood glucose control if diabetic to prevent diabetic nephropathy.",
      "Avoid chronic, unmonitored use of over-the-counter NSAID painkillers (ibuprofen, naproxen).",
      "Get routine annual urine albumin-to-creatinine ratio (uACR) and serum eGFR checks."
    ],
    recommendedSpecialist: {
      title: "Nephrologist",
      specialtyKey: "nephrology",
      description: "A medical specialist focused on kidney diseases, renal function preservation, dialysis, and kidney transplantation.",
      qualifications: "MBBS, MD, DM in Nephrology."
    },
    emergencyGuidance: "Inability to pass urine (anuria), sudden severe breathlessness with body swelling, or excruciating unmanageable flank pain requires emergency department care.",
    colorAccent: "#3B82F6"
  },
  {
    organId: "small-intestine",
    name: "Small Intestine",
    latinName: "Intestinum Tenue",
    tagline: "The primary engine of nutrient absorption",
    system: "Digestive System",
    layer: "Abdominal",
    coords3D: { x: 0.0, y: -0.05, z: 0.12 },
    cameraFocus: { position: [0.0, 0.0, 1.25], target: [0.0, -0.05, 0.08] },
    overview: "Despite its name, the small intestine is approximately 20 feet (6 meters) long, coiled snugly within the central abdominal cavity. Divided into the duodenum, jejunum, and ileum, its microscopic villi and microvilli create a massive absorptive surface area where roughly 90% of all caloric and micronutrient absorption takes place.",
    functions: [
      "Completes enzymatic breakdown of carbohydrates, proteins, and lipids with pancreatic enzymes and intestinal brush border peptidases.",
      "Absorbs amino acids, monosaccharides, fatty acids, vitamins, minerals, and water into lymphatic and portal circulations.",
      "Serves as the body's largest mucosal immune barrier (GALT — gut-associated lymphoid tissue) and Peyer's patches.",
      "Performs segmented and peristaltic motor contractions to blend chyme and propel digestive contents forward.",
      "Produces key gut hormones such as secretin, cholecystokinin (CCK), and GLP-1."
    ],
    commonDiseases: [
      {
        name: "Celiac Disease",
        description: "An autoimmune enteropathy triggered by gluten ingestion in genetically predisposed individuals, resulting in villous atrophy and severe malabsorption."
      },
      {
        name: "Crohn's Disease",
        description: "A chronic inflammatory bowel disease (IBD) that can affect any part of the GI tract, most commonly the terminal ileum, causing transmural ulcers."
      },
      {
        name: "Small Intestinal Bacterial Overgrowth (SIBO)",
        description: "Excessive or abnormal microbial colonization of the small bowel, producing severe gas, bloating, and micronutrient deficiencies."
      },
      {
        name: "Small Bowel Obstruction (SBO)",
        description: "Mechanical blockage of the intestinal lumen, frequently caused by postoperative adhesions or incarcerated hernias."
      }
    ],
    warningSigns: [
      "Chronic watery or greasy diarrhea with foul odor.",
      "Severe postprandial abdominal cramping and gas.",
      "Unexplained iron-deficiency anemia or fat-soluble vitamin deficiencies (vitamins A, D, E, K).",
      "Persistent nausea and inability to tolerate solid foods.",
      "Visible peristalsis or severe abdominal distension with vomiting."
    ],
    nutritionTips: {
      supportive: [
        "Bone broth and glutamine-rich foods supporting enterocyte mucosal integrity.",
        "Soluble fiber foods (cooked oats, carrots, peeled zucchini, sweet potatoes).",
        "Lean, tender protein sources that digest easily.",
        "Naturally fermented yogurts and kefir (if lactose-tolerant).",
        "Anti-inflammatory spices like turmeric and ginger."
      ],
      toLimit: [
        "Gluten-containing grains (wheat, barley, rye) in individuals diagnosed with Celiac disease or gluten ataxia.",
        "Excessive FODMAPs (fermentable oligosaccharides, disaccharides, monosaccharides, and polyols) if experiencing SIBO.",
        "Harsh artificial emulsifiers and chemical food preservatives."
      ]
    },
    lifestyleRecommendations: [
      "Chew every bite thoroughly to reduce particle size prior to small intestinal entry.",
      "Space meals to allow the Migrating Motor Complex (MMC) to clean the small intestine between meals.",
      "Avoid unnecessary antibiotics that wipe out protective microbiome diversity."
    ],
    recommendedSpecialist: {
      title: "Gastroenterologist",
      specialtyKey: "gastroenterology",
      description: "A specialist in inflammatory bowel diseases, celiac disease, malabsorption, and intestinal endoscopy.",
      qualifications: "MBBS, MD, DM in Gastroenterology."
    },
    emergencyGuidance: "Severe abdominal swelling accompanied by inability to pass gas, intractable vomiting, and severe pain is a medical emergency indicating potential bowel obstruction.",
    colorAccent: "#F97316"
  },
  {
    organId: "large-intestine",
    name: "Large Intestine",
    latinName: "Intestinum Crassum / Colon",
    tagline: "The water recycler and microbiome sanctuary",
    system: "Digestive System",
    layer: "Abdominal",
    coords3D: { x: 0.0, y: -0.1, z: 0.1 },
    cameraFocus: { position: [0.0, -0.05, 1.3], target: [0.0, -0.1, 0.05] },
    overview: "The large intestine is about 5 feet (1.5 meters) long, framing the perimeter of the abdominal cavity. Comprising the cecum, appendix, colon (ascending, transverse, descending, sigmoid), and rectum, it reabsorbs remaining water and salts from indigestible food matter, forming stool while nurturing trillions of beneficial microbiome organisms.",
    functions: [
      "Reabsorbs residual water and electrolytes (sodium, chloride) from liquid chyme to compact solid fecal waste.",
      "Houses the vast gut microbiome (hundreds of bacterial species) that ferment indigestible fiber into beneficial Short-Chain Fatty Acids (SCFAs like butyrate).",
      "Microbiome synthesizes essential micronutrients including Vitamin K and certain B-group vitamins.",
      "Provides lubricating mucus to facilitate safe, painless passage of stool.",
      "Stores fecal matter in the rectum until defecation is voluntarily initiated."
    ],
    commonDiseases: [
      {
        name: "Colorectal Polyps & Colorectal Cancer",
        description: "Abnormal growths on the inner mucosal lining of the colon or rectum that can turn malignant over time without screening."
      },
      {
        name: "Ulcerative Colitis (UC)",
        description: "A chronic inflammatory bowel disease causing long-lasting inflammation and mucosal ulcers strictly in the large intestine and rectum."
      },
      {
        name: "Diverticular Disease (Diverticulosis / Diverticulitis)",
        description: "Small pouches that bulge outward through weak spots in the colon wall, which can become acutely inflamed or infected."
      },
      {
        name: "Irritable Bowel Syndrome (IBS)",
        description: "A functional gastrointestinal disorder characterized by abdominal pain, cramping, bloating, and altered bowel habits (IBS-C, IBS-D, IBS-M)."
      }
    ],
    warningSigns: [
      "Persistent change in bowel habits lasting more than a few weeks (diarrhea, constipation, or narrowing of stool).",
      "Rectal bleeding, bright red blood in stool, or dark stools.",
      "Persistent abdominal discomfort, cramps, gas, or pain.",
      "A persistent sensation that your bowel doesn't empty completely (tenesmus).",
      "Unexplained iron deficiency anemia or unintentional weight loss."
    ],
    nutritionTips: {
      supportive: [
        "High dietary prebiotic fiber (25-35 grams daily from beans, lentils, whole grains, seeds).",
        "Resistant starch sources (cooked and cooled potatoes, green bananas, legumes) that feed butyrate-producing bacteria.",
        "Fermented foods (sauerkraut, kimchi, tempeh, kefir).",
        "Chia and ground flaxseeds providing soluble gel-forming fiber for comfortable motility.",
        "Generous water intake to hydrate stool."
      ],
      toLimit: [
        "Processed meats (bacon, hot dogs, cold cuts) categorized as Group 1 carcinogens by WHO/IARC.",
        "High consumption of charred, well-done red meat containing heterocyclic amines.",
        "Refined low-fiber processed convenience snacks.",
        "Excessive alcohol consumption."
      ]
    },
    lifestyleRecommendations: [
      "Undergo recommended colorectal cancer screening (such as colonoscopy or fecal immunochemical test FIT) starting at age 45, or earlier with a family history.",
      "Engage in daily physical activity to naturally stimulate bowel transit time.",
      "Do not ignore the urge to have a bowel movement; chronic holding strains the pelvic floor.",
      "Maintain a diverse plant-rich diet (aiming for 30 different plant foods per week)."
    ],
    recommendedSpecialist: {
      title: "Colorectal Surgeon / Gastroenterologist",
      specialtyKey: "gastroenterology",
      description: "Physicians specializing in colorectal screening, inflammatory bowel disease, diverticulitis, and colon health.",
      qualifications: "MBBS, MD, MS / DM in Gastroenterology / Colorectal Surgery."
    },
    emergencyGuidance: "Massive rectal bleeding, severe rigid left lower quadrant abdominal pain with high fever (diverticular perforation), or signs of septic shock require immediate ER care.",
    colorAccent: "#EA580C"
  },
  {
    organId: "bladder",
    name: "Urinary Bladder",
    latinName: "Vesica Urinaria",
    tagline: "The expandable reservoir of the urinary tract",
    system: "Urinary System",
    layer: "Pelvic",
    coords3D: { x: 0.0, y: -0.32, z: 0.12 },
    cameraFocus: { position: [0.0, -0.25, 1.2], target: [0.0, -0.32, 0.08] },
    overview: "The urinary bladder is a hollow, muscular, balloon-shaped organ located in the pelvis, supported by pelvic floor muscles. It acts as an elastic storage reservoir for urine received continuously from the kidneys via the ureters, capable of comfortably holding between 400 to 600 mL of urine before voluntary micturition.",
    functions: [
      "Stores urine delivered continuously from the kidneys under low internal hydrostatic pressure.",
      "Prevents retrograde reflux of urine back up the ureters towards the kidneys with specialized ureterovesical flap valves.",
      "Expels urine through coordinated detrusor muscle contraction and internal/external urethral sphincter relaxation during urination.",
      "Sensory receptors in the bladder wall signal volume fullness to the spinal cord and micturition center in the brain."
    ],
    commonDiseases: [
      {
        name: "Urinary Tract Infection (UTI / Cystitis)",
        description: "Bacterial infection of the bladder lining (most frequently by Uropathogenic E. coli), causing painful burning urination and urgency."
      },
      {
        name: "Overactive Bladder (OAB) & Incontinence",
        description: "Sudden, involuntary detrusor contractions causing an urgent need to urinate, sometimes followed by unintentional leakage (urge incontinence)."
      },
      {
        name: "Bladder Stones (Urolithiasis)",
        description: "Hard crystallized mineral masses that form when urine in the bladder becomes concentrated due to incomplete bladder emptying."
      },
      {
        name: "Bladder Cancer (Urothelial Carcinoma)",
        description: "Malignancy arising from the transitional epithelial cells lining the bladder, heavily correlated with tobacco smoking and chemical exposure."
      }
    ],
    warningSigns: [
      "Gross hematuria (painless visible blood in urine, appearing pink, red, or cola-colored).",
      "Dysuria (burning, stinging, or painful sensation during urination).",
      "Urinary urgency (sudden, intense compulsion to urinate that is difficult to postpone).",
      "Urinary frequency (needing to urinate significantly more frequently than normal, >8 times/day).",
      "Nocturia (waking up multiple times throughout the night to urinate).",
      "Feeling unable to empty the bladder completely (urinary retention)."
    ],
    nutritionTips: {
      supportive: [
        "Generous intake of plain water (flushes bacteria and dilutes irritating solutes).",
        "Cranberry extract or pure unsweetened cranberry juice containing proanthocyanidins (PACs).",
        "Non-acidic fruits (pears, blueberries, apples, watermelons).",
        "Cruciferous vegetables (rich in isothiocyanates linked to bladder protection).",
        "Pumpkin seeds (rich in phytosterols and zinc supporting bladder tone)."
      ],
      toLimit: [
        "Excessive caffeine and alcohol which irritate the sensitive bladder urothelium and act as diuretics.",
        "Artificial sweeteners (aspartame, saccharin) which are known bladder irritants in sensitive individuals.",
        "Heavily spiced dishes with chili and hot peppers.",
        "Tobacco smoke (aromatic amines in cigarette smoke are filtered into urine, directly exposing bladder urothelium to potent carcinogens)."
      ]
    },
    lifestyleRecommendations: [
      "Do not smoke; smoking is the single greatest modifiable risk factor for bladder cancer.",
      "Urinate promptly after sexual intercourse to flush transient bacteria from the urethra.",
      "Perform regular pelvic floor muscle exercises (Kegels) to strengthen supportive sphincter tone.",
      "Practice good perineal hygiene (wiping from front to back)."
    ],
    recommendedSpecialist: {
      title: "Urologist",
      specialtyKey: "urology",
      description: "A surgical and medical specialist focused on the urinary tract (kidneys, ureters, bladder, urethra) and male reproductive system.",
      qualifications: "MBBS, MS (Surgery), MCh in Urology / Board Certified Urologist."
    },
    emergencyGuidance: "Complete inability to pass urine with painful lower abdominal swelling (acute urinary retention) or macroscopic hematuria with clots requires urgent medical attention.",
    colorAccent: "#14B8A6"
  }
];

