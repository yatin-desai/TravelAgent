import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

import sequelize from '../models/index.js';
import accountsRouter from '../routes/accounts.js';
import leadsRouter from '../routes/leads.js';
import opportunitiesRouter from '../routes/opportunities.js';
import contractsRouter from '../routes/contracts.js';


import reportsRouter from '../routes/reports.js';

app.use('/api/accounts', accountsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/opportunities', opportunitiesRouter);
app.use('/api/contracts', contractsRouter);


app.use('/api/reports', reportsRouter);

app.get('/', (req, res) => {
  res.send('CRM Backend API Running');
});


const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
