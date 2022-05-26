import Header from './components/Header/Header'
import Home from './pages/Home/Home'
import Upload from './pages/Upload/Upload'
import Profile from './pages/Profile/Profile'
import NotFound from './pages/NotFound/NotFound';
import Login from './pages/Login/Login'
import Post from './pages/Post/Post'
import { Routes, Route } from 'react-router-dom'
import Map from './pages/Map/Map'

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
        <Route path='/map/:lat/:lng/:zm' element={<Map />} />
        <Route path='/map/:lat/:lng/:zm/:spc' element={<Map />} />
        <Route path='/map/' element={<Map />} />
        <Route path='/post/:postid' element={<Post />} />
        <Route path='/profile/:userid' element={<Profile />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='*' element={<NotFound url={''}/>} />
    </Routes>
    </div>
  );
}

export default App;