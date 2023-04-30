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
import UserSearch from './screens/socket/searchUser/UserSearch'
import UserListSocket from './screens/socket/webSocketService/UserListSocket'
import UserLogout from './screens/user_logout/UserLogout'
import LoginPage from './screens/login_page/LoginPage'
import UploadFile from './screens/uploadFile/UploadFile'
import ProfilePage from './screens/profile_page/ProfilePage'
import Container from './screens/container/Container'
import PublicationList from './screens/publication_list/PublicationList'
import UserContent from './screens/user_feed/UserContent'
import Friendship from './screens/friendship/Friendship'
import FriendsPrincipal from './screens/friendship/FriendsPrincipal'
import UserAllContent from './screens/user_all_content/UserAllContent'


function App() {
  
  return (

  <Routes>
    <Route path='/login' element={<UserLogin />} ></Route>
    <Route path='/register' element={<UserRegister />}></Route>
    <Route path='/' element={<Container />}> 
      <Route path='/profile' element={<UserProfile />}></Route>
      <Route path='/images/:userId' element={<UserImages /> }></Route>
      <Route path='/videos/:userId' element={<UserVideos />}></Route>
      <Route path='/chatGeneral' element={<SocketTry />}></Route>
      <Route path='/privateChat' element={<PrivateChat />}></Route>
      <Route path='/userList' element={<UserListComponent />}></Route>
      <Route path='/userSearch' element={<UserSearch />}></Route>
      <Route path='/listSocket' element={<UserListSocket />}></Route>
      <Route path="/logout" element={<UserLogout />} />
      <Route path='/loginPage' element={<LoginPage />}></Route>
      <Route path='/upload' element={<UploadFile />}></Route>
      <Route path='/profilePage/:userId' element={<ProfilePage />}></Route>
      <Route path='/publicationList/:userId' element={<PublicationList />}></Route>
      <Route path='/userContent'element={<UserContent />}></Route>
    </Route>
    <Route path='/friends' element={<Friendship />}></Route>
    <Route path='/friendsP' element={<FriendsPrincipal />}></Route>
    <Route path='/UserAllContent' element={<UserAllContent />}></Route>
  </Routes>

  );
}

export default App
