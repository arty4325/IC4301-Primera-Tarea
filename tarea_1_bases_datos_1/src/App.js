import React, { useState, useEffect } from 'react';
import './App.css';

// Main component
function App() {
  // Safe the employee list
  const [empleados, setEmpleados] = useState([]);
  const [vista, setVista] = useState('list');

  // States for the insert formulary
  const [nombre, setNombre] = useState('');
  const [salario, setSalario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // 1) When built, obtain the list of employees
  useEffect(() => {
    if (vista === 'list') {
      obtenerEmpleados();
    }
  }, [vista]);

  // Obtain employees from backend
  const obtenerEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/empleados');
      const data = await response.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  // 2) Incert Employee
  const insertarEmpleado = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Quick validations frontend 
    if (!nombre.trim()) {
      setError('El nombre es requerido.');
      return;
    }
    if (!salario.trim()) {
      setError('El salario es requerido.');
      return;
    }

    // TODO View (For example) that salary is correct

    // If everything is ok, go through backend
    try {
      const response = await fetch('http://localhost:4000/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Nombre: nombre, Salario: salario }),
      });
      const result = await response.json();

      if (!response.ok) {
        // Error
        setError(result.message || 'Error desconocido al insertar empleado.');
      } else {
        // Success
        setMensaje(result.message);
        // Clean Spaces
        setNombre('');
        setSalario('');
        // Go back to the list view
        setVista('list');
      }
    } catch (error) {
      console.error('Error al insertar empleado:', error);
      setError('Ocurrió un error al insertar empleado.');
    }
  };

  // 3) Conditional view, insert
  if (vista === 'insert') {
    return (
      <div className="container">
        <h2>Insertar Empleado</h2>
        {error && <div className="alerta error">{error}</div>}
        {mensaje && <div className="alerta exito">{mensaje}</div>}

        <form onSubmit={insertarEmpleado} className="form-insert">
          <div className="form-group">
            <label>Nombre:</label>
            <input 
              type="text" 
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
            />
          </div>

          <div className="form-group">
            <label>Salario:</label>
            <input 
              type="text" 
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              placeholder="Ej: 200000.00"
            />
          </div>

          <div className="form-buttons">
            <button type="submit">Insertar</button>
            <button type="button" onClick={() => setVista('list')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // List of employees
  return (
    <div className="container">
      <h1>Lista de Empleados</h1>
      <button className="btn-insertar" onClick={() => setVista('insert')}>
        Insertar Nuevo
      </button>

      {empleados.length === 0 ? (
        <p>No hay empleados registrados o no se pudo obtener la lista.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Salario</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.Nombre}</td>
                <td>{emp.Salario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
