import express from 'express';
import Opportunity from '../models/Opportunity.js';

const router = express.Router();

// Get all opportunities
router.get('/', async (req, res) => {
  const opportunities = await Opportunity.findAll();
  res.json(opportunities);
});

// Create opportunity
router.post('/', async (req, res) => {
  const opportunity = await Opportunity.create(req.body);
  res.status(201).json(opportunity);
});

export default router;
