import './App.css';
import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import Upload from './pages/Upload/Upload'
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login'
import Post from './pages/Post/Post'
import { Routes, Route } from 'react-router-dom'
import Map from './pages/Map/Map'
import {makeUser, signIn, signOutUser, getUsername} from './firebase/account'

        /* use id parameter as such
        function Profile(props) {
          let { userid } = useParams();
          just google react-router useParams
          */
function App() {
  return (
    <div className="App">
      <Header />  
      <Routes>
        //change the components, of course
        <Route index element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/map' element={<NotFound url='map'/>} />
        <Route path='/post/:postid' element={<Post />} />
        <Route path='/profile/:userid' element={<NotFound url='profile'/>} />
        <Route path='/upload' element={<Upload url='upload'/>} />
    </Routes>
    </div>
  );
}

export default App;