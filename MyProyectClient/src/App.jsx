import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route,Routes } from 'react-router-dom'
import UserLogin from './screens/user_login/UserLogin'
import UserRegister from './screens/user_register/UserRegister'
import UserProfile from './screens/user_profile/UserProfile'
import UserImages from './screens/user_images/UserImages'
import UserVideos from './screens/user_videos/UserVideos'
import SocketTry from './screens/socket/SocketTry'
import PrivateChat from './screens/socket/privateChat/PrivateChat'
import UserListComponent from './screens/userList/UserListComponent'

function App() {
  
  return (

  <Routes>
    <Route path='/login' element={<UserLogin />} ></Route>
    <Route path='/register' element={<UserRegister />}></Route>
    <Route path='/profile' element={<UserProfile />}></Route>
    <Route path='/images' element={<UserImages /> }></Route>
    <Route path='/videos' element={<UserVideos />}></Route>
    <Route path='/chatGeneral' element={<SocketTry />}></Route>
    <Route path='/privateChat' element={<PrivateChat />}></Route>
    <Route path='/userList' element={<UserListComponent />}></Route>
  </Routes>

  );
}

export default App
