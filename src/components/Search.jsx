import React ,{useRef} from 'react'
// UI
import Dropdown from '../UI/Dropdown'
import SecondaryButton from '../UI/Buttons/SecondaryButton';
import SearchBar from '../UI/SearchBar';
// API
import {SearchSpotLibrary} from '../Http/APIs'

export default function Search() {

    const searchRef = useRef();
    const dropdownRef = useRef();
    
    const genres = [
        { label: 'album', value: 'album' },
        { label: 'playlist', value: 'playlist' },
        { label: 'track', value: 'track' },
        { label: 'artist', value: 'artist' },
        { label: 'episode', value: 'episode' },
        { label: 'audiobook', value: 'audiobook' },
        { label: 'show', value: 'show' },
    ];

    const handleClick = async () => {
        const value = searchRef.current?.getValue();
        const selected = dropdownRef.current.getValue();
        const results = await SearchSpotLibrary(`https://api.spotify.com/v1/search?q=${value}&type=${selected.value}&market=US`)
      };

    return (
        <div className="rounded-2xl">
            <div className="w-full max-w-md mx-auto">
                    <SearchBar ref={searchRef} styles='bg-black' placeholder="Search for songs and episodes"/>
                    <div className='flex-row justify-between items-center mt-2'>
                        <Dropdown ref={dropdownRef}  label="Select" options={genres} />
                        <SecondaryButton clickFun={handleClick}>Seach</SecondaryButton>
                    </div>
            </div>
        </div>
    )
}
