import { useState, useEffect } from 'react';
import API from '../services/api';
import './Inventario.css';

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    cantidad: '',
    precio: ''
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await API.get('/api/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convertir cantidad y precio a números
    const producto = {
      ...nuevoProducto,
      cantidad: Number(nuevoProducto.cantidad) || 0,
      precio: Number(nuevoProducto.precio) || 0
    };
    try {
      if (editando) {
        await API.put(`/api/productos/${editando.id}`, producto);
        setEditando(null);
      } else {
        await API.post('/api/productos', producto);
      }
      setNuevoProducto({ nombre: '', descripcion: '', cantidad: '', precio: '' });
      cargarProductos();
    } catch (error) {
      alert('Error al guardar el producto');
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      cantidad: producto.cantidad,
      precio: producto.precio
    });
    setEditando(producto);
  };

  const eliminarProducto = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      try {
        await API.delete(`/api/productos/${id}`);
        cargarProductos();
      } catch (error) {
        alert('Error al eliminar');
      }
    }
  };

  return (
    <div className='inventario-container'>
      <h1>Inventario de Productos</h1>
      <form onSubmit={handleSubmit} className='formulario'>
        <h3>{editando ? 'Editar Producto' : 'Agregar Producto'}</h3>
        <div className='form-group'>
          <label>Nombre:</label>
          <input
            type="text"
            value={nuevoProducto.nombre}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            required
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Descripción:</label>
          <textarea
            value={nuevoProducto.descripcion}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
            required
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px', minHeight: '60px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Cantidad:</label>
          <input
            type="number"
            value={nuevoProducto.cantidad}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })}
            min="0"
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Precio ($):</label>
          <input
            type="number"
            step="0.01"
            value={nuevoProducto.precio}
            onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            min="0"
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
          {editando ? 'Actualizar' : 'Agregar'}
        </button>
        {editando && (
          <button type="button" className="cancelar" onClick={() => { setEditando(null); setNuevoProducto({ nombre: '', descripcion: '', cantidad: '', precio: '' }); }}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Lista de Productos</h2>
      {productos.length === 0 ? (
        <p className="mensaje-vacio" >No hay productos registrados.</p>
      ) : (
        <table className="tabla-productos">
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Descripción</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cantidad</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Precio</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.nombre}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.descripcion}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{p.cantidad}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>${p.precio?.toFixed(2)}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button onClick={() => editarProducto(p)} style={{ marginRight: '5px' }}>Editar</button>
                  <button onClick={() => eliminarProducto(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Inventario;