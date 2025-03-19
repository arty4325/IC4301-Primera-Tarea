const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Config the connection to the sql server
const dbConfig = {
  user: 'reactapp',
  password: '#Franco123',
  server: 'mssql-194296-0.cloudclusters.net', // Host
  port: 10047,                                // Port
  database: 'DummyTest',                 // DB Name (NEED TO CHANGE)
  options: {
    encrypt: true, 
    trustServerCertificate: true 
  }
};

// Test Endpoint
app.get('/api/usuarios', async (req, res) => {
  try {
    // Create the connection to the db
    let pool = await sql.connect(dbConfig);

    // Makes the consult
    let result = await pool.request().query('SELECT TOP 10 * FROM Nombres');
    // Returns the db data
    res.json(result.recordset);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).json({ message: 'Ocurrió un error al obtener los usuarios.' });
  }
});

// Starts the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
