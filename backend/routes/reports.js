import express from 'express';
import Account from '../models/Account.js';
import Lead from '../models/Lead.js';
import Opportunity from '../models/Opportunity.js';
import Contract from '../models/Contract.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
  const [accounts, leads, opportunities, contracts] = await Promise.all([
    Account.count(),
    Lead.count(),
    Opportunity.count(),
    Contract.count()
  ]);
  const openOpportunitiesValue = await Opportunity.sum('value', { where: { stage: 'Prospecting' } });
  const closedOpportunitiesValue = await Opportunity.sum('value', { where: { stage: 'Closed Won' } });
  res.json({
    accounts,
    leads,
    opportunities,
    contracts,
    openOpportunitiesValue: openOpportunitiesValue || 0,
    closedOpportunitiesValue: closedOpportunitiesValue || 0
  });
});

export default router;
