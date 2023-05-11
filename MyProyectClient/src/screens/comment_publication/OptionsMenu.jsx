const OptionsMenu = ({ onEdit, onDelete }) => {
    return (
      <div className="options-menu">
        <button onClick={onEdit}>Editar</button>
        <button onClick={onDelete}>Eliminar</button>
      </div>
    );
  };
  export default OptionsMenu;