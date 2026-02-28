const express = require('express');
const cors = require('cors');
const { sql } = require('@vercel/postgres');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Async function to ensure the table gets created exactly once on boot (if needed)
// Note: In Serverless environments, this runs repeatedly on cold starts.
async function initDb() {
  try {
    // Only attempt table creation if POSTGRES_URL is provided
    if (process.env.POSTGRES_URL) {
      await sql`
        CREATE TABLE IF NOT EXISTS requisitions (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          father_name VARCHAR(255) NOT NULL,
          mobile_number VARCHAR(50) NOT NULL,
          village_town VARCHAR(255) NOT NULL,
          survey_number VARCHAR(100) NOT NULL,
          extent VARCHAR(100) NOT NULL,
          classification VARCHAR(100) NOT NULL,
          units VARCHAR(100) NOT NULL,
          nature_of_use VARCHAR(100) NOT NULL,
          date VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('Connected to Vercel Postgres - table verified.');
    } else {
      console.log('No POSTGRES_URL provided. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error creating Postgres table:', error.message);
  }
}

// Call init once
initDb();

// POST endpoint to save a new requisition
app.post('/api/requisitions', async (req, res) => {
  try {
    const {
      name,
      fatherName,
      mobileNumber,
      villageTown,
      surveyNumber,
      extent,
      classification,
      units,
      natureOfUse,
      date
    } = req.body;

    const queryResult = await sql`
      INSERT INTO requisitions 
      (name, father_name, mobile_number, village_town, survey_number, extent, classification, units, nature_of_use, date) 
      VALUES (${name}, ${fatherName}, ${mobileNumber}, ${villageTown}, ${surveyNumber}, ${extent}, ${classification}, ${units}, ${natureOfUse}, ${date})
      RETURNING id;
    `;

    res.status(201).json({ success: true, id: queryResult.rows[0].id });
  } catch (error) {
    console.error('Error saving requisition:', error.message);
    res.status(500).json({ success: false, message: 'Server error while saving requisition' });
  }
});

// GET endpoint to fetch a single requisition by ID
app.get('/api/requisitions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const queryResult = await sql`SELECT * FROM requisitions WHERE id = ${id}`;

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Requisition not found' });
    }
    res.status(200).json({ success: true, data: queryResult.rows[0] });
  } catch (error) {
    console.error('Error fetching requisition:', error.message);
    res.status(500).json({ success: false, message: 'Server error while fetching requisition' });
  }
});

// Run normally in local dev, Vercel will export the app
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;
