import React, { useEffect, useContext, useState } from 'react'
import { StoreContext } from '../store/ContextStore'
import { SpotifyContext } from '../store/SpotifyStore'
// UI
import DisplayType from '../UI/DisplayType'
import SecondaryButton from '../UI/Buttons/SecondaryButton'
import Modal from '../UI/Modal'
// HOOKS
import useFetch from '../hooks/useFetch'
import useFetchPost from '../hooks/useFetchPost'
// ICONS
import plus from '../assets/icons/plus.png'
import { Plus } from "lucide-react";

export default function Sidebar() {

    //** 
    // calling 3 apis followed albmus followed playlist followed artists
    const ctx = useContext(StoreContext)
    const sopt = useContext(SpotifyContext)

    // get
    //const { data: userSavedAlbums, setFetchedData: setUserSavedAlbums } = useFetch('https://api.spotify.com/v1/me/albums')
    //const { data: followedArtists, setFetchedData: setFollowedArtists } = useFetch('https://api.spotify.com/v1/me/following?type=artist')
    //const { data: playlist, setFetchedData: setPlaylist } = useFetch('https://api.spotify.com/v1/me/playlists') // NEED TO CHANGE
    const userSavedAlbums = sopt.userSavedAlbums
    const followedArtists = sopt.followedArtists
    const playlist = sopt.playlist
    // post
    //const { handlePost } = useFetchPost()
    // state
    const [createPlayListModalState, setCreatePlayListModalState] = useState(false);



    const filters = {
        playlists: playlist,
        followedArtists: followedArtists,
        userSavedAlbums: userSavedAlbums,
    }

    const [currentFilter, setCurrentFilter] = useState({
        type: "Artists",
        data: filters?.followedArtists
    });

    const createPlayList = () => {
        // we need to add user input    
        sopt.createPlayList('Gaming', 'my frist play list', true)
    }

    const onClickFliter = (filter_type) => {

        switch (filter_type) {

            case 'Playlist':
                setCurrentFilter({
                    type: "Playlist",
                    data: filters.playlists
                })
                return;
            case 'Artists':
                setCurrentFilter({
                    type: 'Artists',
                    data: filters.followedArtists
                })
                return;
            case 'Albums':
                setCurrentFilter({
                    type: 'Albums',
                    data: filters.userSavedAlbums
                })
                return;
            default:
                console.log('default case');
                return;
        }
    }


    let displayCurrectFilter;

    if (currentFilter.type == 'Playlist') {
        displayCurrectFilter = <DisplayType type='playlists' items={playlist?.items} />
    } else if (currentFilter.type == 'Artists') {
        displayCurrectFilter = <DisplayType type='artists' items={followedArtists?.artists?.items} />
    } else {
        displayCurrectFilter = <DisplayType type='albums' items={userSavedAlbums?.items} />
    }


    return (
        <>
            {/* <div className='w-1/3 px-8 py-16 bg-main-bg-gray text-white rounded-r-xl overflow-y-auto no-scrollbar'>
                <div className='flex justify-between mb-3'>
                    <span>
                        <span className='ml-1 text-lg font-bold'>Your Library</span>
                    </span>
                    <SecondaryButton
                        id='plus'
                        clickFun={()=>setCreatePlayListModalState(true)}
                        type='button'
                        data-modal-target="default-modal" data-modal-toggle="default-modal"
                    >
                        <h6 className='text-lg font-bold'>+</h6>
                    </SecondaryButton>
                </div>

                <div className='flex'>
                    <SecondaryButton id='Artists' clickFun={() => onClickFliter('Artists')} type="button">Artists</SecondaryButton>
                    <SecondaryButton id='Playlist' clickFun={() => onClickFliter('Playlist')} type="button">Playlist</SecondaryButton>
                    <SecondaryButton id='Albums' clickFun={() => onClickFliter('Albums')} type="button">Albums</SecondaryButton>
                </div>

                <div className='my-4'>
                    {(currentFilter) && displayCurrectFilter}
                </div>
            </div> */}


             <div>
                <div className='flex justify-between'>
                    <h4 className='font-bold my-3'>
                        Your Library
                    </h4>
                    <SecondaryButton
                        id='plus'
                        clickFun={()=>setCreatePlayListModalState(true)}
                        type='button'
                        data-modal-target="default-modal" data-modal-toggle="default-modal"
                    >
                        <Plus size={24} strokeWidth={1.75}/>
                    </SecondaryButton>
                </div>

                <div className='flex'>
                    <SecondaryButton id='Artists' clickFun={() => onClickFliter('Artists')} type="button">Artists</SecondaryButton>
                    <SecondaryButton id='Playlist' clickFun={() => onClickFliter('Playlist')} type="button">Playlist</SecondaryButton>
                    <SecondaryButton id='Albums' clickFun={() => onClickFliter('Albums')} type="button">Albums</SecondaryButton>
                </div>

                <div className='my-4'>
                    {(currentFilter) && displayCurrectFilter}
                </div>
            </div>
            {/* <Modal type='create-playlist' open={createPlayListModalState} onClose={setCreatePlayListModalState} onClick={createPlayList} /> */}
        </>
    )
}

