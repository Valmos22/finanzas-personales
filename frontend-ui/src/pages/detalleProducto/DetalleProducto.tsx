import { useParams } from 'react-router-dom';

const DetalleProducto = () => {
  const { id } = useParams();

  return (
    <div>
      <h1>Detalle del producto: {id}</h1>
      {/* Mostrar info del producto con ese ID */}
    </div>
  );
};

export default DetalleProducto;