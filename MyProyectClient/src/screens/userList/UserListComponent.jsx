import axios from 'axios';
import PrivateChat from '../socket/privateChat/PrivateChat';
import { useEffect, useState } from "react";

const UserListComponent = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const jwtToken = localStorage.getItem('jwtToken');
  const idP = localStorage.getItem('idP');
  
  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/auth/friends', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      console.log('Response:', response);
  
      if (response.status === 200) {
        if (response.data && response.data.length > 0) {
          console.log('Datos de usuarios:', response.data);
          setUsers(response.data);
        } else {
          console.log('Error al obtener la lista de usuarios: los datos de usuario están vacíos');
        }
      } else {
        console.log('Error al obtener la lista de usuarios:', response);
      }
    } catch (error) {
      console.error('Error al obtener la lista de usuarios:', error);
    }
  };
  
  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    console.log('Estado de usuarios actualizado:', users);
  }, [users]);

  const handleChatCreated = (newChatId) => {
    setChatId(newChatId);
  };

  return (
    <div>
      <h1>Lista de usuarios conectados</h1>
      {users && users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <button onClick={() => setSelectedUser(user)}>{user.username}</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron usuarios</p>
      )}
      {selectedUser && (
       <PrivateChat
       senderId={idP}
       recipientId={selectedUser.id}
       onClose={() => setSelectedUser(null)}
     />
      )}
    </div>
  );

      }
export default UserListComponent;

