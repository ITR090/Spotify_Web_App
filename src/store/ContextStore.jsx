import React,{ createContext,useState } from "react"; 
// import { getToken } from "../utilities/getAccessToken";
 
//const getAccessTokenSp = await getToken();

 const  StoreContext = createContext({
    token: null,
    authenticated: false,
    setUserToken: (token) => {},
    setAuthenticated : ()=>{},

    spotifyUserId:null,
    getUserSpotifyId:()=>{},

    //modal state
    modalState:false,
    setModalState:()=>{}
})

const StoreContextProvider = (props)=>{

    const [token,setToken] = useState(null)
    const [authenticated, setAuthenticated] = useState(false)

    const [modalState, setModalState] = useState(false);
    
    const [spotifyUserId, setSpotifyUserId] = useState(null)
    
    const setUserToken = (token)=>{
        setToken(token)
        setAuthenticated(true)
    }

    const getUserSpotifyId = (userId)=>{
        setSpotifyUserId(userId)
    }
    return (
        <StoreContext.Provider value={{
            token:token,
            setUserToken:setUserToken,
            authenticated:authenticated,
            setAuthenticated:setAuthenticated,
            modalState:modalState,
            setModalState:setModalState,
            getUserSpotifyId:getUserSpotifyId,
            spotifyUserId:spotifyUserId
        }}>
            {props.children}
        </StoreContext.Provider>
    )
}

export {StoreContext,StoreContextProvider};