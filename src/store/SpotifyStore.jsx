
import React ,{ createContext,useState } from "react"; 
// HOOKS
import useFetch from '../hooks/useFetch'
import useFetchPost from '../hooks/useFetchPost' 
// UI
import Modal from "../UI/Modal";
const  SpotifyContext = createContext({
    spotifyUser:null,
    saveUserDetaild:()=>{},
    createPlayList:(playListName, playListDescription,isPublic)=>{},
})

const SpotifyContextProvider = (props)=>{

    const [spotifyUser,setSpotifyUser] = useState(null)

    
    try {

        //get
        const { data: userSavedAlbums, setFetchedData: setUserSavedAlbums } = useFetch('https://api.spotify.com/v1/me/albums')
        const { data: followedArtists, setFetchedData: setFollowedArtists } = useFetch('https://api.spotify.com/v1/me/following?type=artist')
        const { data: playlist, setFetchedData: setPlaylist, errors: playlistErrors } = useFetch('https://api.spotify.com/v1/me/playlists')
         
        // post
        const { handlePost } = useFetchPost()

        const saveUserDetaild =(userDetails)=>{
           setSpotifyUser(userDetails)
         }

        const createPlayList= async (playListName, playListDescription,isPublic)=>{
        const data={
            "name": playListName,
            "description": playListDescription,
            "public": isPublic
        }
        //console.log(data)
        const postedData = await handlePost('https://api.spotify.com/v1/users/4p667cfn1nwx361pghuzs3g1q/playlists',data)
        if(postedData){
            
            setPlaylist((perData)=>{
                return{
                  ...perData,
                  items: perData.items.concat(postedData)
                }
            }) 
        }
           
            }

        const deletePlayList=()=>{}

        return (
            <SpotifyContext.Provider value={{
                saveUserDetaild:saveUserDetaild,
                createPlayList:createPlayList,
                spotifyUser:spotifyUser,
                playlist:playlist,
                followedArtists:followedArtists,
                userSavedAlbums:userSavedAlbums
            }}>
                {props.children}
            </SpotifyContext.Provider>
        )

    } catch (error) {
        console.log(error)
    }
}

export {SpotifyContext,SpotifyContextProvider}