import { doctorsData } from '../data/doctorsData.js';

export const getDoctors = (req, res) => {
  try {
    const { specialty, city, q } = req.query;
    let filtered = [...doctorsData];

    if (specialty && specialty !== 'all') {
      filtered = filtered.filter(d => 
        d.specialtyKey.toLowerCase() === specialty.toLowerCase() ||
        d.specialty.toLowerCase().includes(specialty.toLowerCase())
      );
    }

    if (city && city !== 'all') {
      filtered = filtered.filter(d => 
        d.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.specialty.toLowerCase().includes(query) ||
        d.hospitalAffiliation.toLowerCase().includes(query) ||
        d.bio.toLowerCase().includes(query)
      );
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve doctors', error: error.message });
  }
};

export const getDoctorById = (req, res) => {
  try {
    const { id } = req.params;
    const doctor = doctorsData.find(d => d.id === id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: `Doctor with ID '${id}' not found` });
    }
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve doctor details', error: error.message });
  }
};
