
import { createContext,useState } from "react"; 


const  SpotifyContext = createContext({
    spotifyUser:null,
    saveUserDetaild:()=>{}
})

const SpotifyContextProvider = (props)=>{

    const [spotifyUser,setSpotifyUser] = useState(null)

    const saveUserDetaild =(userDetails)=>{
        setSpotifyUser(userDetails)
    }

    const getUserDetails =()=>{}
    const getPlayLists=()=>{}
    const createPlayList=()=>{}
    const deletePlayList=()=>{}
    const getUserSavedAlbums =()=>{}
    const getFollowedArtists =()=>{}

    return (
        <SpotifyContext.Provider value={{
            saveUserDetaild:saveUserDetaild,
            spotifyUser:spotifyUser
        }}>
            {props.children}
        </SpotifyContext.Provider>
    )
}

export {SpotifyContext,SpotifyContextProvider}