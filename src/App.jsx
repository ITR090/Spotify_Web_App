import './App.css'
import React ,{ useContext } from 'react'
import { StoreContextProvider, StoreContext } from './store/ContextStore'
import { SpotifyContext,SpotifyContextProvider } from './store/SpotifyStore'
import { PlayerContextProvider } from './store/PlayerStore'
// route
import { RouterProvider} from 'react-router-dom'
import { routers_definitions2 } from './routers/routers'

function App() {


  return (
    <StoreContextProvider>
      <SpotifyContextProvider>
        <PlayerContextProvider>
          <RouterProvider router={routers_definitions2}/>
        </PlayerContextProvider>
      </SpotifyContextProvider>
    </StoreContextProvider>
  )
}

export default App
