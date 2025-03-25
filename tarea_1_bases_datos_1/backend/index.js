const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = { // Connection to the database (Using public ip and credentials)
  user: 'reactapp',
  password: '#Franco123',
  server: 'mssql-194296-0.cloudclusters.net',
  port: 10047,
  database: 'EMPLEADOS',
  options: {
    encrypt: true,
    trustServerCertificate: true 
  }
};

app.get('/api/empleados', async (req, res) => { // Endpoint get empleados
  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool.request().execute('SpListarEmpleados'); // Excec stored procedure SpListarEmpleados
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al listar empleados:', error); // Catches errors
    res.status(500).json({ message: 'Error al obtener empleados.' });
  }
});

app.post('/api/empleados', async (req, res) => { // Enpoint post empleados
  const { Nombre, Salario } = req.body;

  if (!Nombre || !Salario) {
    return res.status(400).json({ message: 'Name and salary are required.' }); // The endpoint is only excecuted when the name and the salary are placed
  }

  try {
    let pool = await sql.connect(dbConfig);
    let spResult = await pool.request()
      .input('inNombre', sql.VarChar(128), Nombre)
      .input('inSalario', sql.Money, Salario)
      .output('outCodigoError', sql.Int)
      .execute('SpInsertarEmpleado');

    const codigoError = spResult.output.outCodigoError;

    if (codigoError === 1) {
      return res.status(400).json({ message: 'El empleado ya existe.' }); // Employee exists
    }

    res.status(201).json({ message: 'Empleado insertado exitosamente.' }); // Employee insert 
  } catch (error) {
    console.error('Error al insertar empleado:', error);
    res.status(500).json({ message: 'Error al insertar empleado.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
