import './App.css'
import React ,{ useContext } from 'react'
import { StoreContextProvider, StoreContext } from './store/ContextStore'
import { SpotifyContext,SpotifyContextProvider } from './store/SpotifyStore' 
// route
import { RouterProvider} from 'react-router-dom'
import { routers_definitions2 } from './routers/routers'

function App() {


  return (
    <StoreContextProvider>
      <SpotifyContextProvider>
        <RouterProvider router={routers_definitions2}/>
      </SpotifyContextProvider>
    </StoreContextProvider>
  )
}

export default App
