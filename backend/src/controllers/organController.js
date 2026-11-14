import { organsData } from '../data/organsData.js';

export const getAllOrgans = (req, res) => {
  try {
    const list = organsData.map(o => ({
      organId: o.organId,
      name: o.name,
      latinName: o.latinName,
      tagline: o.tagline,
      system: o.system,
      layer: o.layer,
      coords3D: o.coords3D,
      colorAccent: o.colorAccent,
      overview: o.overview.slice(0, 160) + '...'
    }));
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve organs list', error: error.message });
  }
};

export const getOrganById = (req, res) => {
  try {
    const { id } = req.params;
    const organ = organsData.find(o => o.organId.toLowerCase() === id.toLowerCase());
    if (!organ) {
      return res.status(404).json({ success: false, message: `Organ with ID '${id}' not found` });
    }
    res.json({ success: true, data: organ });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve organ details', error: error.message });
  }
};

