
import React, { createContext } from "react";
import axios from 'axios'
// HOOKS
import useFetch from '../hooks/useFetch'
import useFetchPost from '../hooks/useFetchPost'
// API
import { getToken } from "../Http/APIs";

const SpotifyContext = createContext({

})

const SpotifyContextProvider = (props) => {


    try {

        //Get
        const { data: playlists, setFetchedData: setPlaylist, errors: playlistErrors } = useFetch('https://api.spotify.com/v1/me/playlists')
        const { data: spotifyUserData, setFetchedData: setSpotifyUserData, errors: spotifyUserErrors } = useFetch('https://api.spotify.com/v1/me')
        const { data: topTracks, errors: topTracksErr } = useFetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5')

        // Post
        const { handlePost } = useFetchPost(`https://api.spotify.com/v1/users/${spotifyUserData?.id}/playlists`)
        const { handlePost_AddToPlayList } = useFetchPost(`https://api.spotify.com/v1/playlists/{playlist_id}/tracks`)

        const getUserDetails = () => {
            return spotifyUserData;
        }
        const getPlaylists = () => {
            return playlists;
        }

        const createPlayList = async (playlistname) => {
            const data = await handlePost({
                name: playlistname,
            })
            const updatedPlaylists = [...playlists.items, data]
            setPlaylist({ ...playlists, items: updatedPlaylists });

        }

        const createTopTracksPlayList = async (playlistname) => {

            // Get token
            const token = getToken()
            //create playlist
            const playlist = await handlePost({
                name: playlistname,
            })

            let uids = []
            topTracks.items.forEach(function (track) {
                uids.push(track.uri)
            })

            await axios.post(`https://api.spotify.com/v1/playlists/${playlist?.id}/tracks?uris=${uids}`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
            const updatedPlaylists = [...playlists.items, playlist]
            setPlaylist({ ...playlists, items: updatedPlaylists });    
        }


        return (
            <SpotifyContext.Provider value={{
                // feilds
                playlists: playlists,
                playlistErr: playlistErrors,

                spotifyUserData: spotifyUserData,
                spotifyUserErrors: spotifyUserErrors,

                // methods
                getUserDetails: getUserDetails,
                getPlaylists: getPlaylists,
                createPlayList: createPlayList,
                createTopTracksPlayList: createTopTracksPlayList
            }}>
                {props.children}
            </SpotifyContext.Provider>
        )

    } catch (error) {
        console.log(error)
    }
}

export { SpotifyContext, SpotifyContextProvider }