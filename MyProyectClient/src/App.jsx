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

function App() {
  
  return (

  <Routes>
    <Route path='/login' element={<UserLogin />} ></Route>
    <Route path='/register' element={<UserRegister />}></Route>
    <Route path='/profile' element={<UserProfile />}></Route>
    <Route path='/images' element={<UserImages /> }></Route>
    <Route path='/videos' element={<UserVideos />}></Route>
  </Routes>

  );
}

export default App
