const { Client } = require('pg');

async function createDatabase() {
  // Connect to default postgres database first
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'roshan',
    port: 5432,
  });

  try {
    await client.connect();
    
    // Check if OneRoadMap database exists
    const result = await client.query("SELECT 1 FROM pg_database WHERE datname = 'OneRoadMap'");
    
    if (result.rows.length === 0) {
      // Create the database if it doesn't exist
      await client.query('CREATE DATABASE "OneRoadMap"');
      console.log('OneRoadMap database created successfully');
    } else {
      console.log('OneRoadMap database already exists');
    }
  } catch (error) {
    console.error('Error creating database:', error.message);
  } finally {
    await client.end();
  }
}

createDatabase();