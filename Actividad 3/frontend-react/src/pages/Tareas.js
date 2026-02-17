import { useState, useEffect } from 'react';
import API from '../services/api';

function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState({ titulo: '', descripcion: '' });

  useEffect(() => {
    cargarTareas();
  }, []);

  const cargarTareas = async () => {
    try {
      const res = await API.get('/tareas');
      setTareas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const crearTarea = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tareas', nuevaTarea);
      setNuevaTarea({ titulo: '', descripcion: '' });
      cargarTareas();
    } catch (error) {
      alert('Error al crear tarea');
    }
  };

  const eliminarTarea = async (id) => {
    try {
      await API.delete(`/tareas/${id}`);
      cargarTareas();
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  return (
    <div>
      <h1>Mis Tareas</h1>
      <form onSubmit={crearTarea}>
        <input
          type="text"
          placeholder="Título"
          value={nuevaTarea.titulo}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={nuevaTarea.descripcion}
          onChange={(e) => setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })}
          required
        />
        <button type="submit">Agregar</button>
      </form>
      <ul>
        {tareas.map((t) => (
          <li key={t.id}>
            <strong>{t.titulo}</strong>: {t.descripcion}
            <button onClick={() => eliminarTarea(t.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tareas;