import './App.css';
import Header from './components/Header/Header'
import Map from './pages/Map/Map'
import {makeUser, signIn, signOutUser, getUsername} from './firebase/account'

function App() {
  let foo = signIn("foo@example.com", "wrong");
  console.log(foo)
  return (
    <div className="App">
      <Header />
      <Map />
    </div>
  );
}

export default App;
