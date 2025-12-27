import express from 'express';
import Account from '../models/Account.js';

const router = express.Router();

// Get all accounts
router.get('/', async (req, res) => {
  const accounts = await Account.findAll();
  res.json(accounts);
});

// Create account
router.post('/', async (req, res) => {
  const account = await Account.create(req.body);
  res.status(201).json(account);
});

export default router;
