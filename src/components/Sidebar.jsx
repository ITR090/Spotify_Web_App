import React, { useEffect, useContext, useState } from 'react'
import { StoreContext } from '../store/ContextStore'
// UI
import DisplayType from '../UI/DisplayType'
import SecondaryButton from '../UI/Buttons/SecondaryButton'
import Modal from '../UI/Modal'
// HOOKS
import useFetch from '../hooks/useFetch'
import useFetchPost from '../hooks/useFetchPost'
// ICONS
import plus from '../assets/icons/plus.png'

export default function Sidebar() {

    //** 
    // calling 3 apis followed albmus followed playlist followed artists
    const ctx = useContext(StoreContext)
    // get
    const { data: userSavedAlbums, setFetchedData: setUserSavedAlbums } = useFetch('https://api.spotify.com/v1/me/albums')
    const { data: followedArtists, setFetchedData: setFollowedArtists } = useFetch('https://api.spotify.com/v1/me/following?type=artist')
    const { data: playlist, setFetchedData: setPlaylist } = useFetch('https://api.spotify.com/v1/me/playlists') // NEED TO CHANGE
    
    // post
    const { handlePost } = useFetchPost()
    // state
    const [modalState, setModalState] = useState(false);


    const filters = {
        playlists: playlist,
        followedArtists: followedArtists,
        userSavedAlbums: userSavedAlbums,
    }

    const [currentFilter, setCurrentFilter] = useState({
        type: "Artists",
        data: filters?.followedArtists
    });
    
    const createPlayList = async () => {
            const data={
                "name": "Raghad3",
                "description": "New playlist description",
                "public": true
            }
           const postedData = await handlePost('https://api.spotify.com/v1/users/4p667cfn1nwx361pghuzs3g1q/playlists',data) 
           setPlaylist((perData)=>{
               return{
                 ...perData,
                 items: perData.items.concat(postedData)
               }
           })
    }



    let displayCurrectFilter;

    if (currentFilter.type == 'Playlist') {
        displayCurrectFilter = <DisplayType type='playlists' items={playlist?.items} />
    } else if (currentFilter.type == 'Artists') {
        displayCurrectFilter = <DisplayType type='artists' items={followedArtists?.artists?.items} />
    } else if (currentFilter.type == 'Albums') {
        displayCurrectFilter = <DisplayType type='albums' items={userSavedAlbums?.items} />
    } else {

    }

    const onClickFliter = (filter_type) => {

        switch (filter_type) {
            case 'X':
                setCurrentFilter({
                    type: 'X',
                    data: filters.all
                })
                return;
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

    return (
        <>
            <div className='w-1/3 px-8 py-16 bg-main-bg-gray text-white rounded-r-xl overflow-y-auto no-scrollbar'>
                <div className='flex justify-between mb-3'>
                    <span>
                        <span className='ml-1 text-lg font-bold'>Your Library</span>
                    </span>
                    <SecondaryButton
                        id='plus'
                        clickFun={()=>setModalState(true)}
                        type='button'
                        data-modal-target="default-modal" data-modal-toggle="default-modal"
                    >
                        <h3 className='text-lg font-bold'>+</h3>
                    </SecondaryButton>
                </div>

                <div className='flex'>
                    {/* <button id='cancle'  onClick={()=>onClickFliter('X')} className='bg-main-bg-gray text-sm rounded-full p-1 mr-2 w-10 focus:bg-violet-700' type="button">X</button> */}
                    <SecondaryButton id='Artists' clickFun={() => onClickFliter('Artists')} type="button">Artists</SecondaryButton>
                    <SecondaryButton id='Playlist' clickFun={() => onClickFliter('Playlist')} type="button">Playlist</SecondaryButton>
                    <SecondaryButton id='Albums' clickFun={() => onClickFliter('Albums')} type="button">Albums</SecondaryButton>
                </div>

                <div className='my-4'>
                    {(ctx.authenticated && currentFilter) && displayCurrectFilter}
                </div>
            </div>
            <Modal open={modalState} onClose={setModalState} onClick={createPlayList} />
        </>
    )
}

