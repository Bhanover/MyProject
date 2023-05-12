import './App.css';
import { Route, Routes } from 'react-router-dom';
import UserLogin from './assets/screens/user_login/UserLogin';
import UserRegister from './assets/screens/user_register/UserRegister';
import UserLogout from './assets/screens/user_logout/UserLogout';
import UploadFile from './assets/screens/uploadFile/UploadFile';
import ProfilePage from './assets/screens/profile_page/ProfilePage';
import { ProfileImageProvider } from "./ProfileImageContext";
import Container from './assets/screens/container/Container';
import UserImages from './assets/screens/user_images/UserImages';
import UserVideos from './assets/screens/user_videos/UserVideos';
import PublicationList from './assets/screens/publication_list/PublicationList';
import UserContent from './assets/screens/user_feed/UserContent';
import FriendsPrincipal from './assets/screens/friendship/FriendsPrincipal';
import FriendsContent from './assets/screens/user_feed/FriendsContent';
import ExperiencePage from './assets/screens/experience_page/ExperiencePage';
import { Navigate } from 'react-router-dom';
import LoginPage from './assets/screens/login_page/LoginPage';
import CreatePublications from './assets/screens/create_publications/CreatePublications';
import SearchChat from './assets/screens/socket/searchChat/SearchChat';

function App() {
  return (
    <ProfileImageProvider>
      <Routes>
        <Route path="/logout" element={<UserLogout />} />
        <Route path="/login" element={<UserLogin />} ></Route>
        <Route path="/register" element={<UserRegister />}></Route>
        <Route path="/upload" element={<UploadFile />}></Route>
        <Route path="/" element={<Container />}>
        <Route path="/profilePage/:userId" element={<ProfilePage />}>
          <Route index element={<Navigate to="content" />} /> {/* Redirección por defecto */}
          <Route path="images" element={<UserImages />} />
          
          <Route path="videos" element={<UserVideos />} />
          <Route path="publications" element={<PublicationList />} />
          <Route path="content" element={<UserContent />} />
          <Route path="friends" element={<FriendsPrincipal />} />
          </Route>
          <Route path="friendsContent" element={<FriendsContent />} />
          <Route path='/createPublications' element={<CreatePublications />}></Route>
        <Route path="/" element={<ExperiencePage />}></Route>
        </Route>
        <Route path="/loginPage" element={<LoginPage />}></Route>
        <Route path='/searchChat' element={<SearchChat />}></Route>
      </Routes>
    </ProfileImageProvider>
  );
}

export default App;
