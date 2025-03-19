import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/usuarios')
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((error) => {
        console.error('Error While Obtaining Users:', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Dummy users from Backend</h2>
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.Id}>
              {usuario.Id} - {usuario.Nombre}
            </li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
