import { organsData } from '../data/organsData.js';
import { doctorsData } from '../data/doctorsData.js';
import { hospitalsData } from '../data/hospitalsData.js';
import { nutritionData } from '../data/nutritionData.js';

export const globalSearch = (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.json({ success: true, count: 0, results: [] });
    }

    const term = q.trim().toLowerCase();
    const results = [];

    // Search Organs
    organsData.forEach(o => {
      const matchName = o.name.toLowerCase().includes(term);
      const matchLatin = o.latinName.toLowerCase().includes(term);
      const matchOverview = o.overview.toLowerCase().includes(term);
      const matchDisease = o.commonDiseases.some(d => d.name.toLowerCase().includes(term));
      const matchWarning = o.warningSigns.some(w => w.toLowerCase().includes(term));

      if (matchName || matchLatin || matchOverview || matchDisease || matchWarning) {
        results.push({
          type: 'organ',
          title: o.name,
          subtitle: o.tagline,
          link: `/organ/${o.organId}`,
          badge: o.system,
          id: o.organId,
        });
      }
    });

    // Search Nutrition
    nutritionData.forEach(n => {
      const matchTitle = n.title.toLowerCase().includes(term);
      const matchNutrient = n.keyNutrients.some(k => k.toLowerCase().includes(term));
      if (matchTitle || matchNutrient) {
        results.push({
          type: 'nutrition',
          title: `${n.organName} Nutrition`,
          subtitle: n.subtitle,
          link: `/nutrition?organ=${n.organId}`,
          badge: 'Nutrition Guide',
          id: n.organId,
        });
      }
    });

    // Search Doctors
    doctorsData.forEach(d => {
      if (d.name.toLowerCase().includes(term) || d.specialty.toLowerCase().includes(term) || d.city.toLowerCase().includes(term)) {
        results.push({
          type: 'doctor',
          title: d.name,
          subtitle: `${d.specialty} • ${d.hospitalAffiliation}`,
          link: `/doctors?specialty=${d.specialtyKey}`,
          badge: `${d.city} (${d.distanceKm} km)`,
          id: d.id,
        });
      }
    });

    // Search Hospitals
    hospitalsData.forEach(h => {
      if (h.name.toLowerCase().includes(term) || h.tags.some(t => t.toLowerCase().includes(term)) || h.area.toLowerCase().includes(term)) {
        results.push({
          type: 'hospital',
          title: h.name,
          subtitle: `${h.area}, ${h.city} • Rating ${h.rating}`,
          link: `/hospitals/${h.id}`,
          badge: h.emergency24x7 ? '24/7 Emergency' : 'Hospital',
          id: h.id,
        });
      }
    });

    res.json({
      success: true,
      query: q,
      count: results.length,
      results: results.slice(0, 15)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Global search failed', error: error.message });
  }
};

