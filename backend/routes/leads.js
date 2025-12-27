import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

// Get all leads
router.get('/', async (req, res) => {
  const leads = await Lead.findAll();
  res.json(leads);
});

// Create lead
router.post('/', async (req, res) => {
  const lead = await Lead.create(req.body);
  res.status(201).json(lead);
});

export default router;
