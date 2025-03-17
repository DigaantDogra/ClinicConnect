import './App.css'
import { Navbar } from './Pages/NavBar'
import { Home } from "./Pages/Patient/Home/Home"

function App() {

  return (
    <>
      <Navbar section={
          <Home userName={"User"}/>
        }/>
    </>
  )
}

export default App
