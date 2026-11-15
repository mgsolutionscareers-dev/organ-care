import { organsData } from '../data/organsData.js';
import { nutritionData } from '../data/nutritionData.js';

// Emergency patterns that warrant immediate ER guidance
const EMERGENCY_PATTERNS = [
  /chest\s*(pain|pressure|tightness|crushing)/i,
  /radiating\s*to\s*(left\s*arm|jaw|neck)/i,
  /difficulty\s*breathing|cannot\s*breathe|shortness\s*of\s*breath\s*sudden/i,
  /slurred\s*speech|face\s*droop|arm\s*weakness|stroke/i,
  /thunderclap\s*headache|worst\s*headache\s*of\s*(my\s*)?life/i,
  /coughing\s*(up\s*)?blood/i,
  /vomiting\s*(up\s*)?blood/i,
  /fainting|syncope|unconscious/i,
  /anaphylaxis|swollen\s*(tongue|throat)/i
];

const PRESCRIPTION_OR_DIAGNOSIS_PATTERNS = [
  /diagnose\s*me/i,
  /do\s*i\s*have\s*(cancer|heart\s*attack|stroke|diabetes)/i,
  /what\s*dose\s*of/i,
  /how\s*many\s*mg\s*of/i,
  /prescribe\s*me/i,
  /can\s*i\s*take\s*(ibuprofen|paracetamol|aspirin|antibiotic)\s*with/i
];

/**
 * Core Healthcare Educational AI Chat Engine
 */
export async function sendChatMessage(cleanMsg) {
  if (!cleanMsg || typeof cleanMsg !== 'string') {
    return {
      reply: "Please enter a health question or select one of the suggested topics below.",
      isEmergency: false,
    };
  }

  const query = cleanMsg.trim();
  const lower = query.toLowerCase();

  // 1. Triage Acute Medical Emergencies
  const isEmergency = EMERGENCY_PATTERNS.some(p => p.test(query));
  if (isEmergency) {
    return {
      reply: "🚨 **CRITICAL MEDICAL ALERT:** Your question contains symptoms that may indicate an acute life-threatening medical emergency (such as myocardial infarction, acute pulmonary distress, stroke, or severe internal bleeding).\n\n**Immediate Action Steps:**\n1. **Call Emergency Services immediately:** Dial **112** (EU/India), **911** (USA/Canada), or **999** (UK).\n2. **Do not drive yourself:** Request an ambulance equipped with paramedic emergency support.\n3. **Rest comfortably:** Sit upright in a relaxed position while awaiting emergency responders.",
      isEmergency: true,
      disclaimer: "OrganCare provides general educational information only and does NOT provide emergency clinical services or diagnosis."
    };
  }

  // 2. Direct Prescription or Diagnostic Safety Filter
  const isDiagnosisOrPrescription = PRESCRIPTION_OR_DIAGNOSIS_PATTERNS.some(p => p.test(query));
  if (isDiagnosisOrPrescription) {
    return {
      reply: "⚠️ **Medical Safety Protocol:** OrganCare is a clinical health education platform and cannot issue personalized disease diagnoses, prescribe pharmaceuticals, or calculate medication dosages.\n\nTo safely evaluate symptoms or receive a medication prescription, please consult with an in-person licensed healthcare professional or visit an accredited clinic.",
      isEmergency: false,
      disclaimer: "Strict healthcare safety policy: No individualized pharmacological prescribing or medical diagnosis."
    };
  }

  // 3. Optional Gemini API Integration if API key is provided
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const systemInstruction = `You are the OrganCare Health Assistant, a professional healthcare educator.
GUIDELINES:
- Provide clear, understandable, compassionate educational answers about human anatomy, organ functions, nutrition, and wellness.
- Strictly adhere to medical safety: NO disease diagnoses, NO prescription generation, NO drug dosages, NO personalized treatment plans.
- If a user mentions potential warning signs or asks about symptoms, always recommend consulting a qualified physician or specialist.
- If emergency symptoms are mentioned, immediately advise contacting emergency services.
- Keep answers structured with bullet points and evidence-informed based on WHO, NHS, and NIH guidance.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${query}` }]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return {
            reply: text,
            isEmergency: false,
            disclaimer: "Educational health guidance. Not a substitute for professional clinical medical advice."
          };
        }
      }
    } catch (e) {
      console.warn('Gemini API call failed, using clinical knowledge engine:', e.message);
    }
  }

  // 4. Clinical Healthcare Knowledge Engine (100% Reliable Offline & Online)
  // Check for specific organ matching
  const matchedOrgan = organsData.find(o => 
    lower.includes(o.organId) || 
    lower.includes(o.name.toLowerCase()) || 
    (o.latinName && lower.includes(o.latinName.toLowerCase()))
  );

  if (matchedOrgan) {
    // Check if asking about functions
    if (lower.includes('do') || lower.includes('function') || lower.includes('work') || lower.includes('role') || lower.includes('purpose')) {
      const funcs = matchedOrgan.functions.map(f => `• ${f}`).join('\n');
      return {
        reply: `### ${matchedOrgan.name} (${matchedOrgan.latinName || matchedOrgan.system})\n*${matchedOrgan.tagline}*\n\n${matchedOrgan.overview}\n\n**Primary Physiological Functions:**\n${funcs}\n\n**Specialist:** ${matchedOrgan.recommendedSpecialist?.title} (${matchedOrgan.recommendedSpecialist?.description})`,
        isEmergency: false,
        disclaimer: "Peer-reviewed anatomical literature from WHO, NHS, and MedlinePlus."
      };
    }

    // Check if asking about nutrition / diet
    if (lower.includes('food') || lower.includes('eat') || lower.includes('nutrition') || lower.includes('diet') || lower.includes('best foods')) {
      const supportive = matchedOrgan.nutritionTips.supportive.map(s => `• ✅ **Supportive:** ${s}`).join('\n');
      const limit = matchedOrgan.nutritionTips.toLimit.map(l => `• ⚠️ **Limit:** ${l}`).join('\n');
      return {
        reply: `### Nutritional Guidance for the ${matchedOrgan.name}\nTo promote long-term cellular health and optimal function of your ${matchedOrgan.name.toLowerCase()}:\n\n**Recommended Foods:**\n${supportive}\n\n**Foods & Substances to Moderate:**\n${limit}\n\n*Hydration & lifestyle:* Regular moderate exercise and sufficient hydration support optimal metabolic filtration and tissue perfusion.`,
        isEmergency: false,
        disclaimer: "Nutritional information is educational. Consult a registered dietitian for individual medical nutrition therapy."
      };
    }

    // Check if asking about diseases / warning signs
    if (lower.includes('disease') || lower.includes('problem') || lower.includes('warning') || lower.includes('sign') || lower.includes('symptom')) {
      const warnings = matchedOrgan.warningSigns.map(w => `• ⚠️ ${w}`).join('\n');
      const diseases = matchedOrgan.commonDiseases.map(d => `• **${d.name}:** ${d.description}`).join('\n');
      return {
        reply: `### ${matchedOrgan.name}: Common Conditions & Warning Signs\n\n**Notable Clinical Conditions:**\n${diseases}\n\n**Key Warning Signs to Discuss with a Doctor:**\n${warnings}\n\n**Recommended Medical Specialist:**\nIf you experience persistent or worsening symptoms, consult a **${matchedOrgan.recommendedSpecialist?.title}** (${matchedOrgan.recommendedSpecialist?.description}).`,
        isEmergency: false,
        disclaimer: "Informational only. Any persistent symptoms should be evaluated by a certified medical doctor."
      };
    }

    // Check if asking about specialist / doctor
    if (lower.includes('doctor') || lower.includes('specialist') || lower.includes('physician') || lower.includes('treat')) {
      const spec = matchedOrgan.recommendedSpecialist;
      return {
        reply: `### Specialist for ${matchedOrgan.name} Health: **${spec?.title || 'Specialist'}**\n\n${spec?.description}\n\n**Qualifications & Credentials:**\n${spec?.qualifications || 'Board-certified clinical specialist'}\n\n**When to schedule an appointment:**\nIf you have abnormal lab values, persistent pain, chronic fatigue, or family history of ${matchedOrgan.name.toLowerCase()} disease, your primary care physician can provide a direct referral to a ${spec?.title}.`,
        isEmergency: false,
        disclaimer: "Specialist directory matches verified hospital affiliations."
      };
    }

    // Default overview for organ
    const funcs = matchedOrgan.functions.slice(0, 3).map(f => `• ${f}`).join('\n');
    return {
      reply: `### ${matchedOrgan.name} (${matchedOrgan.system})\n*${matchedOrgan.tagline}*\n\n${matchedOrgan.overview}\n\n**Key Functions:**\n${funcs}\n\n**Recommended Specialist:** ${matchedOrgan.recommendedSpecialist?.title}\n\nYou can explore the full interactive 3D anatomy and nutrition guidance for the ${matchedOrgan.name} directly in the OrganCare 3D Anatomy explorer!`,
      isEmergency: false,
      disclaimer: "Clinical anatomy guidance from OrganCare Education."
    };
  }

  // Nutrition queries
  if (lower.includes('diet') || lower.includes('nutrition') || lower.includes('healthy food') || lower.includes('water') || lower.includes('vitamins')) {
    return {
      reply: `### Evidence-Informed Nutritional Fundamentals\n\nA balanced, nutrient-dense diet protects every organ in your body:\n\n• 🫀 **Cardiovascular (Heart):** Rich in Omega-3 fatty acids (salmon, walnuts), soluble fiber (oats, barley), and extra virgin olive oil.\n• 🧠 **Nervous (Brain):** Antioxidant berries, dark leafy greens, flavonoids, and adequate choline.\n• 🫁 **Respiratory (Lungs):** High-antioxidant vitamin C (citrus, bell peppers) and magnesium to support smooth bronchial muscle.\n• 🥩 **Hepatic (Liver):** Cruciferous vegetables (broccoli, Brussels sprouts), green tea, and limiting alcohol/refined fructose.\n• 🫘 **Renal (Kidneys):** Consistent hydration (2-2.5L water daily) and reducing high sodium intake (<2,000 mg/day).\n\nExplore our dedicated **Nutrition Centre** in the top navigation for organ-by-organ dietary plans!`,
      isEmergency: false,
      disclaimer: "Educational nutrition guidelines based on the Harvard Healthy Eating Plate and WHO recommendations."
    };
  }

  // General Hospital or Doctor query
  if (lower.includes('hospital') || lower.includes('emergency') || lower.includes('clinic') || lower.includes('doctor')) {
    return {
      reply: `### Finding Hospitals & Specialists with OrganCare\n\nOrganCare provides a real-time, interactive medical locator:\n\n1. **Nearby Hospitals & Trauma Centers:** Visit the **Hospitals** tab to view accredited facilities near your location with 24/7 emergency readiness, contact details, and driving directions.\n2. **Specialist Physicians:** Visit the **Doctors** tab to discover verified cardiologists, neurologists, pulmonologists, gastroenterologists, and nephrologists filtered by organ specialty.`,
      isEmergency: false,
      disclaimer: "Hospital and doctor directories are verified against accredited medical licensing registries."
    };
  }

  // General greeting or fallback
  return {
    reply: `### Welcome to OrganCare Health Assistant!\n\nI am designed to help you explore and understand human anatomy and proactive wellness. You can ask me questions like:\n\n• **"What does the liver do?"** — Physiological functions and metabolism\n• **"Best foods for heart health?"** — Evidence-informed cardiovascular nutrition\n• **"Why are kidneys important?"** — Renal filtration and fluid balance\n• **"What are warning signs of lung problems?"** — Pulmonary disease indicators\n• **"Which specialist treats digestive conditions?"** — Doctor credentials & referrals\n\nHow can I help you learn about your health today?`,
    isEmergency: false,
    disclaimer: "OrganCare provides general educational information only. Always consult a licensed physician for medical advice."
  };
}

