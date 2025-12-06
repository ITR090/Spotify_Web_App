import React, { createContext } from "react";
import axios from 'axios'
// HOOKS
import useFetch from '../hooks/useFetch'
// helpers
import { getToken } from "../utilities/helpers";


const SpotifyContext = createContext({

})

const SpotifyContextProvider = (props) => {


    try {

        //Get
        const { data: playlists, setFetchedData: setPlaylist, errors: playlistErrors } = useFetch('https://api.spotify.com/v1/me/playlists')
        const { data: spotifyUserData, errors: spotifyUserErrors } = useFetch('https://api.spotify.com/v1/me')
        const { data: topTracks, errors: topTracksErr } = useFetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=5')
        const { data: topArtists, errors: topArtistsErr } = useFetch('https://api.spotify.com/v1/me/top/artists?limit=20')
        const { data: followedArtists, errors: followedArtistsErrors } = useFetch('https://api.spotify.com/v1/me/following?type=artist');
        const { data: userSavedAlbums, errors: userSavedAlbumsErrors } = useFetch('https://api.spotify.com/v1/me/albums')
      

        const getUserDetails = () => {
            return spotifyUserData;
        }

        const addTrackToPlaylist = async(playlist_id,track_id)=>{

            try {
                const token = getToken()
                const response= axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks?uris=${track_id}`,
                    {},
                    {
                      headers:{
                           'Authorization': `Bearer ${token}`,
                           'Content-Type': 'application/json',
                      }
                    }
                )
                if( response.status == 201){
                    console.log(response)
                    console.log(playlists)
                }

            } catch (error) {
                console.log(error)
            }
        }

        const createPlayList = async (playlistname) => {

            try {
                const token = getToken()
                const new_playlist = await axios.post(`https://api.spotify.com/v1/users/${spotifyUserData?.id}/playlists`,
                    {
                        name: playlistname
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                )
               
                const updatedPlaylist = [...playlists.items, new_playlist.data]
                setPlaylist({ ...playlists, items: updatedPlaylist })

            } catch (error) {
               
            }
        }

        const createTopTracksPlayList = async (playlistname) => {

            try {
                const token = getToken()
                //create playlist
                const new_playlist = await axios.post(`https://api.spotify.com/v1/users/${spotifyUserData?.id}/playlists`,
                    {
                        name: playlistname
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                )
                // top user's tracks 
                let uids = []
                topTracks.items.forEach(function (track) {
                    uids.push(track.uri)
                })

                const response = await axios.post(`https://api.spotify.com/v1/playlists/${new_playlist?.data?.id}/tracks?uris=${uids}`,
                    {},
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    })
                if (response.status == 201) {
                    const updatedPlaylist = [...playlists.items, new_playlist.data]
                    setPlaylist({ ...playlists, items: updatedPlaylist });
                    return;
                }

            } catch (error) {
                console.log(error)
            }
        }


        return (
            <SpotifyContext.Provider value={{
                // feilds
                playlists: playlists,
                playlistErr: playlistErrors,
                topTracks: topTracks,
                topTracksErr: topTracksErr,
                topArtists: topArtists,
                topArtistsErr: topArtistsErr,
                followedArtists: followedArtists,
                followedArtistsErrors: followedArtistsErrors,
                userSavedAlbums: userSavedAlbums,
                userSavedAlbumsErrors: userSavedAlbumsErrors,
                // methods
                getUserDetails: getUserDetails,
                createPlayList: createPlayList,
                createTopTracksPlayList: createTopTracksPlayList,
                addTrackToPlaylist:addTrackToPlaylist
            }}>
                {props.children}
            </SpotifyContext.Provider>
        )

    } catch (error) {
        console.log(error)
    }
}

export { SpotifyContext, SpotifyContextProvider }