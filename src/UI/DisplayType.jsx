import React from 'react'
import { Link } from 'react-router-dom'

export default function DisplayType({ type, items }) {


    return items?.map((item) => <Link key={type == 'playlists' || type == 'artists' ? item.id : item.added_at} to={type =='albums' && `/album/${item.album.id}` || type == 'playlists' && `/playlist/${item.id}` || type == 'artists' && `/artist/${item.id}`}>
        <div className='hover:bg-light-gray-hover flex justify-start items-center my-2 p-2 rounded-lg'>
            <img src={type == 'albums' ? item.album?.images[2]?.url : item.images?.[2]?.url || ''} className={type == 'artists' ? 'w-1/4 rounded-full mr-5' : 'w-1/4 rounded-lg mr-5'} alt="" />
            <div>
                <h6>{type == 'albums' ? item.album.name : item.name}</h6>
                <span className='capitalize mr-1'>{type == 'albums' ? item.album.album_type : item.type}</span>
                {type == 'playlists' || type == 'albums' ? <span className='mx-1'>|</span> : null}
                <span>{type == 'albums' && item.album.artists[0].name || type == 'playlists' && item.owner.display_name}</span>
            </div>
        </div>
    </Link>

    )
}


