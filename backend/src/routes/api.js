import { Router } from 'express';
import { getAllOrgans, getOrganById } from '../controllers/organController.js';
import { getAllNutrition, getNutritionByOrganId } from '../controllers/nutritionController.js';
import { getDoctors, getDoctorById } from '../controllers/doctorController.js';
import { getHospitals, getHospitalById } from '../controllers/hospitalController.js';
import { handleAiChat } from '../controllers/aiController.js';
import { globalSearch } from '../controllers/searchController.js';
import { aiChatLimiter } from '../middleware/rateLimiter.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'OrganCare Backend API',
    projectId: process.env.FIREBASE_PROJECT_ID || 'organcare-health-84c2b'
  });
});

// Organ information endpoints
router.get('/organs', getAllOrgans);
router.get('/organs/:id', getOrganById);

// Nutrition endpoints
router.get('/nutrition', getAllNutrition);
router.get('/nutrition/:organId', getNutritionByOrganId);

// Doctor discovery endpoints
router.get('/doctors', getDoctors);
router.get('/doctors/:id', getDoctorById);

// Hospital discovery endpoints
router.get('/hospitals', getHospitals);
router.get('/hospitals/:id', getHospitalById);

// Global unified search
router.get('/search', globalSearch);

// AI Health Chatbot endpoint with rate limiting
router.post('/ai/chat', aiChatLimiter, handleAiChat);

// Protected user verification route (example)
router.get('/user/me', verifyFirebaseToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

export default router;

