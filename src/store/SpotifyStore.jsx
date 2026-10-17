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

        // track_uri: Spotify track URI, e.g. "spotify:track:<id>"
        // returns true when the track was added, false otherwise
        const addTrackToPlaylist = async(playlist_id,track_uri)=>{

            if (!playlist_id || !track_uri) return false

            try {
                const token = getToken()
                // POST /playlists/{id}/items (replaces the removed /playlists/{id}/tracks)
                const response = await axios.post(`https://api.spotify.com/v1/playlists/${playlist_id}/items`,
                    { uris: [track_uri] },
                    {
                      headers:{
                           'Authorization': `Bearer ${token}`,
                           'Content-Type': 'application/json',
                      }
                    }
                )
                if (response.status == 201 || response.status == 200) {
                    // keep the cached track count in sync
                    // (the playlist field was renamed tracks -> items in Feb 2026)
                    const countKey = (playlist) => playlist.items ? 'items' : (playlist.tracks ? 'tracks' : null)
                    const updatedPlaylist = playlists?.items?.map(playlist => {
                        const key = countKey(playlist)
                        return playlist.id === playlist_id && key
                            ? { ...playlist, [key]: { ...playlist[key], total: (playlist[key].total ?? 0) + 1 } }
                            : playlist
                    })
                    if (updatedPlaylist) setPlaylist({ ...playlists, items: updatedPlaylist })
                    return true
                }
                return false

            } catch (error) {
                console.log(error)
                return false
            }
        }

        const createPlayList = async (playlistname) => {

            try {
                const token = getToken()
                // POST /me/playlists (replaces the removed /users/{id}/playlists)
                const new_playlist = await axios.post(`https://api.spotify.com/v1/me/playlists`,
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
                // returned so the UI can open the new playlist
                return new_playlist.data

            } catch (error) {
                console.log(error)
                return null
            }
        }

        // Spotify has no "delete playlist" endpoint: deleting = removing it from the
        // user's library, which is exactly what the Spotify app does. Returns true on success.
        // DELETE /me/library?uris=... (replaces the removed DELETE /playlists/{id}/followers)
        const deletePlayList = async (playlist_id) => {

            if (!playlist_id) return false

            try {
                const token = getToken()
                await axios.delete(`https://api.spotify.com/v1/me/library`,
                    {
                        params: { uris: `spotify:playlist:${playlist_id}` },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    }
                )
                // remove it from the library lists (home page + sidebar)
                setPlaylist(current => current && {
                    ...current,
                    items: current.items?.filter(playlist => playlist.id !== playlist_id),
                    total: Math.max((current.total ?? 1) - 1, 0),
                })
                return true

            } catch (error) {
                console.log(error)
                return false
            }
        }

        // PUT /playlists/{id} — change name and/or description (owner only).
        // details: { name?, description? } — only send what changed. Returns true on success.
        const updatePlayList = async (playlist_id, details) => {

            if (!playlist_id || !details || Object.keys(details).length === 0) return false

            try {
                const token = getToken()
                await axios.put(`https://api.spotify.com/v1/playlists/${playlist_id}`,
                    details,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                )
                // reflect the change in the library lists (home page + sidebar)
                setPlaylist(current => current && {
                    ...current,
                    items: current.items?.map(playlist =>
                        playlist.id === playlist_id ? { ...playlist, ...details } : playlist
                    ),
                })
                return true

            } catch (error) {
                console.log(error)
                return false
            }
        }

        const createTopTracksPlayList = async (playlistname) => {

            try {
                const token = getToken()
                //create playlist — POST /me/playlists (replaces the removed /users/{id}/playlists)
                const new_playlist = await axios.post(`https://api.spotify.com/v1/me/playlists`,
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

                // POST /playlists/{id}/items (replaces the removed /playlists/{id}/tracks)
                const response = await axios.post(`https://api.spotify.com/v1/playlists/${new_playlist?.data?.id}/items`,
                    { uris: uids },
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
                deletePlayList: deletePlayList,
                updatePlayList: updatePlayList,
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