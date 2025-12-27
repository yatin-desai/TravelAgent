import express from 'express';
import Contract from '../models/Contract.js';

const router = express.Router();

// Get all contracts
router.get('/', async (req, res) => {
  const contracts = await Contract.findAll();
  res.json(contracts);
});

// Create contract
router.post('/', async (req, res) => {
  const contract = await Contract.create(req.body);
  res.status(201).json(contract);
});

export default router;
