const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
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

app.get('/api/empleados', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    const result = await pool.request().execute('SpListarEmpleados');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error al listar empleados:', error);
    res.status(500).json({ message: 'Error al obtener empleados.' });
  }
});

app.post('/api/empleados', async (req, res) => {
  const { Nombre, Salario } = req.body;

  if (!Nombre || !Salario) {
    return res.status(400).json({ message: 'Name and salary are required.' });
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
      return res.status(400).json({ message: 'El empleado ya existe.' });
    }

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
