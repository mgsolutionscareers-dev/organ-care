import { nutritionData } from '../data/nutritionData.js';

export const getAllNutrition = (req, res) => {
  try {
    res.json({ success: true, count: nutritionData.length, data: nutritionData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve nutrition data', error: error.message });
  }
};

export const getNutritionByOrganId = (req, res) => {
  try {
    const { organId } = req.params;
    const item = nutritionData.find(n => n.organId.toLowerCase() === organId.toLowerCase());
    if (!item) {
      return res.status(404).json({ success: false, message: `Nutrition info for '${organId}' not found` });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve nutrition details', error: error.message });
  }
};

