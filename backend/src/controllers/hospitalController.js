import { hospitalsData } from '../data/hospitalsData.js';

export const getHospitals = (req, res) => {
  try {
    const { specialty, city, q } = req.query;
    let filtered = [...hospitalsData];

    if (specialty && specialty !== 'all') {
      const spec = specialty.toLowerCase();
      filtered = filtered.filter(h => 
        h.specialties.some(s => s.toLowerCase() === spec) ||
        h.tags.some(t => t.toLowerCase().includes(spec))
      );
    }

    if (city && city !== 'all') {
      filtered = filtered.filter(h => 
        h.city.toLowerCase().includes(city.toLowerCase()) ||
        h.area.toLowerCase().includes(city.toLowerCase()) ||
        h.postalCode.includes(city)
      );
    }

    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(h => 
        h.name.toLowerCase().includes(query) ||
        h.address.toLowerCase().includes(query) ||
        h.availableServices.some(s => s.toLowerCase().includes(query)) ||
        h.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve hospitals', error: error.message });
  }
};

export const getHospitalById = (req, res) => {
  try {
    const { id } = req.params;
    const hospital = hospitalsData.find(h => h.id === id);
    if (!hospital) {
      return res.status(404).json({ success: false, message: `Hospital with ID '${id}' not found` });
    }
    res.json({ success: true, data: hospital });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve hospital details', error: error.message });
  }
};

