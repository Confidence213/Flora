import './App.css';
import Header from './components/Header/Header'
import NotFound from './pages/NotFound/NotFound';
import { Routes, Route } from 'react-router-dom'

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
        // change the components, of course
        <Route exact path='/' element={<NotFound url='homepage'/>} />
        <Route path='/login' element={<NotFound url='login'/>} />
        <Route path='/map' element={<NotFound url='map'/>} />
        <Route path='/post/:postid' element={<NotFound url='post' />} />
        <Route path='/profile/:userid' element={<NotFound url='profile'/>} />
        <Route path='/upload' element={<NotFound url='upload'/>} />
    </Routes>
    </div>
  );
}

export default App;
