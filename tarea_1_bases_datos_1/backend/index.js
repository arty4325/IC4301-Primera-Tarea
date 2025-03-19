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
    database: 'EMPLEADOS',                 // Indicates the db we are working on
    options: {
      encrypt: true, 
      trustServerCertificate: true 
    }
  };

/* 
   1. ENDPOINT: Obtain employees
*/
app.get('/api/empleados', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    
    // Excecute the stored procedure
    const result = await pool.request().execute('SpListarEmpleados');
    
    // Returns data
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados.' });
  }
});

/* 
   2. ENDPOINT: Incert Employee
*/
app.post('/api/empleados', async (req, res) => {
  const { Nombre, Salario } = req.body;

  if (!Nombre || !Salario) {
    return res.status(400).json({ message: 'Name and salary are required.' });
  }

  try {
    let pool = await sql.connect(dbConfig);

    // Call the Stored Procedure with input and output parameters
    let spResult = await pool.request()
      .input('Nombre', sql.VarChar(128), Nombre)
      .input('Salario', sql.Money, Salario)
      .output('CodigoError', sql.Int) 
      .execute('SpInsertarEmpleado');

    const codigoError = spResult.output.CodigoError;

    if (codigoError === 1) {
      // If StoredProcedure returns 1, employee already exists
      return res.status(400).json({ message: 'El empleado ya existe.' });
    }

    // OK statement returned
    res.status(201).json({ message: 'Empleado insertado exitosamente.' });
  } catch (error) {
    console.error('Error al insertar empleado:', error);
    res.status(500).json({ message: 'Error al insertar empleado.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
