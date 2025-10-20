import Register from './components/user/register.js';
import Login from './components/user/login.js';
import ManhwaList from './components/display/manhwa.js'
import CurrentUser from './components/display/currentUser.js'

function App() {
  return (
    <div>
      <h1>Mezame Frontend</h1>
      <Register />
      <Login />
      <ManhwaList />
      <CurrentUser />
    </div>
  );
}

export default App;
