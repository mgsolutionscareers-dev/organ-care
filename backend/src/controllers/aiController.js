import { organsData } from '../data/organsData.js';
import { nutritionData } from '../data/nutritionData.js';

// Emergency keyword patterns that warrant immediate ER guidance
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

export const handleAiChat = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'A prompt message string is required.' });
    }

    const cleanMsg = message.trim();

    // 1. Check for Emergency Signs
    const isEmergency = EMERGENCY_PATTERNS.some(pattern => pattern.test(cleanMsg));
    if (isEmergency) {
      return res.json({
        success: true,
        isEmergency: true,
        reply: "🚨 URGENT MEDICAL WARNING: Your query mentions symptoms that may indicate an acute medical emergency (such as severe chest pain, breathing distress, stroke warning signs, or internal bleeding). Please call your local emergency services (911 in US/Canada, 112 in EU/India, 999 in UK) or proceed immediately to the nearest hospital Emergency Room. Do not wait or drive yourself.",
        disclaimer: "OrganCare provides general educational information only and cannot provide emergency care or diagnosis."
      });
    }

    // 2. Check for Prescriptions or Direct Diagnosis Requests
    const isDiagnosisOrPrescription = PRESCRIPTION_OR_DIAGNOSIS_PATTERNS.some(pattern => pattern.test(cleanMsg));
    if (isDiagnosisOrPrescription) {
      return res.json({
        success: true,
        isEmergency: false,
        reply: "OrganCare is an educational health platform and cannot diagnose diseases, prescribe medications, or recommend pharmaceutical dosages. For a personalized diagnosis or prescription, please consult a licensed physician or specialist.",
        disclaimer: "Medical Safety Protocol: No individual medical diagnosis or pharmacologic dosing is provided."
      });
    }

    // 3. If GEMINI_API_KEY is configured, use the Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const systemInstruction = `You are the OrganCare Health Assistant, a professional healthcare educator.
GUIDELINES:
- Provide clear, understandable, compassionate educational answers about human anatomy, organ functions, nutrition, and wellness.
- Strictly adhere to medical safety: NO disease diagnoses, NO prescription generation, NO drug dosages, NO personalized treatment plans.
- If a user mentions potential warning signs or asks about symptoms, always recommend consulting a qualified physician or specialist.
- If emergency symptoms are mentioned, immediately advise contacting emergency services.
- Keep answers structured, polite, and evidence-informed based on WHO, NHS, and NIH guidance.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nUser Question: ${cleanMsg}` }]
              }
            ]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return res.json({
              success: true,
              isEmergency: false,
              reply: generatedText,
              disclaimer: "Educational health information. Not a substitute for professional medical advice, diagnosis, or treatment."
            });
          }
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to healthcare knowledge engine:', geminiError.message);
      }
    }

    // 4. Intelligent Healthcare Knowledge Engine Fallback
    const lower = cleanMsg.toLowerCase();
    let reply = '';
    let matchedOrgan = null;

    // Detect if user asks about a specific organ
    for (const organ of organsData) {
      if (lower.includes(organ.name.toLowerCase()) || lower.includes(organ.organId.replace('-', ' '))) {
        matchedOrgan = organ;
        break;
      }
    }

    if (matchedOrgan) {
      if (lower.includes('function') || lower.includes('do') || lower.includes('work') || lower.includes('purpose')) {
        reply = `**Functions of the ${matchedOrgan.name} (${matchedOrgan.latinName}):**\n\n` +
          `${matchedOrgan.overview}\n\n` +
          `**Key Functions:**\n` +
          matchedOrgan.functions.map(f => `• ${f}`).join('\n') +
          `\n\n**Recommended Specialist:** If you have concerns about your ${matchedOrgan.name.toLowerCase()}, consult a **${matchedOrgan.recommendedSpecialist.title}**.`;
      } else if (lower.includes('food') || lower.includes('eat') || lower.includes('diet') || lower.includes('nutrition')) {
        const nut = nutritionData.find(n => n.organId === matchedOrgan.organId);
        reply = `**Nutritional Guidance for ${matchedOrgan.name} Health:**\n\n` +
          `Foods that support general ${matchedOrgan.name.toLowerCase()} function include:\n` +
          matchedOrgan.nutritionTips.supportive.map(s => `• ${s}`).join('\n') +
          `\n\n**Foods & Habits to Limit:**\n` +
          matchedOrgan.nutritionTips.toLimit.map(l => `• ${l}`).join('\n') +
          `\n\n*Note: Dietary needs vary by individual, especially for those with existing health conditions.*`;
      } else if (lower.includes('warning') || lower.includes('sign') || lower.includes('symptom') || lower.includes('problem')) {
        reply = `**Common Warning Signs Related to the ${matchedOrgan.name}:**\n\n` +
          matchedOrgan.warningSigns.map(w => `• ${w}`).join('\n') +
          `\n\n**When to seek care:** If you notice persistent or worsening symptoms, schedule a consultation with a **${matchedOrgan.recommendedSpecialist.title}** for a clinical evaluation.`;
      } else if (lower.includes('disease') || lower.includes('condition') || lower.includes('illness')) {
        reply = `**Common Conditions Involving the ${matchedOrgan.name}:**\n\n` +
          matchedOrgan.commonDiseases.map(d => `• **${d.name}**: ${d.description}`).join('\n\n') +
          `\n\n*This list is for educational awareness. Always consult a **${matchedOrgan.recommendedSpecialist.title}** for proper diagnostic testing.*`;
      } else {
        reply = `**About the ${matchedOrgan.name} (${matchedOrgan.tagline}):**\n\n` +
          `${matchedOrgan.overview}\n\n` +
          `• **Primary Functions:** ${matchedOrgan.functions[0]}\n` +
          `• **Key Healthy Foods:** ${matchedOrgan.nutritionTips.supportive.slice(0, 3).join(', ')}\n` +
          `• **Medical Specialist:** ${matchedOrgan.recommendedSpecialist.title}`;
      }
    } else if (lower.includes('specialist') || lower.includes('doctor for')) {
      reply = `**Medical Specialists by Organ & System:**\n\n` +
        `• **Heart & Vessels:** Cardiologist\n` +
        `• **Brain & Nerves:** Neurologist\n` +
        `• **Lungs & Breathing:** Pulmonologist\n` +
        `• **Liver, Stomach & Bowels:** Gastroenterologist / Hepatologist\n` +
        `• **Kidneys & Dialysis:** Nephrologist\n` +
        `• **Bladder & Urinary Tract:** Urologist\n` +
        `• **Pancreas & Blood Sugar:** Endocrinologist\n\n` +
        `You can explore qualified specialists in our **Doctor Finder** section.`;
    } else if (lower.includes('nutrition') || lower.includes('diet') || lower.includes('healthy food')) {
      reply = `**General Healthy Nutrition Principles:**\n\n` +
        `1. **Focus on Whole Plants:** Consume a colorful array of fruits, vegetables, legumes, and whole grains.\n` +
        `2. **Healthy Fats:** Prioritize unsaturated fats (olive oil, avocados, nuts, fatty fish) over trans and saturated fats.\n` +
        `3. **Moderate Sodium:** Keep dietary sodium below 2,000 mg/day to maintain healthy blood pressure.\n` +
        `4. **Hydration:** Drink sufficient water throughout the day to support kidney filtration and digestion.\n` +
        `5. **Limit Ultra-Processed Foods:** Reduce added sugars, sweetened drinks, and processed meats.\n\n` +
        `Visit our **Nutrition Centre** to view tailored guidance for each organ.`;
    } else {
      reply = `Hello! I'm your **OrganCare Health Assistant**.\n\nI can help you learn about:\n` +
        `• **Organ Functions:** "What does the liver do?", "How does the heart pump blood?"\n` +
        `• **Nutrition Guidance:** "Best foods for heart health?", "What should I eat for my kidneys?"\n` +
        `• **Warning Signs:** "Common symptoms of lung problems?"\n` +
        `• **Doctor Specializations:** "Which doctor treats kidney conditions?"\n\n` +
        `How can I assist your health journey today?`;
    }

    return res.json({
      success: true,
      isEmergency: false,
      reply,
      disclaimer: "Educational health information. Not a substitute for professional medical advice, diagnosis, or treatment."
    });

  } catch (error) {
    console.error('AI chat handler error:', error);
    res.status(500).json({
      success: false,
      message: 'The AI health assistant encountered an error. Please try again shortly.',
      error: error.message
    });
  }
};
