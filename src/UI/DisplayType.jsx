import React from 'react'
import { Link } from 'react-router-dom'

export default function DisplayType({ type, items }) {


    switch(type){
        case 'playlists':
            return items?.map((item)=><Link key={item?.id} to={`/playlist/${item?.id}`}>
                <div className='hover:bg-light-gray-hover flex justify-start items-center my-2 p-2 rounded-lg'>
                    <img src={item?.images?.[2]?.url} className='w-1/4 rounded-lg mr-5'/>
                    <div>
                        <h6>{item?.name}</h6>
                        <span className='capitalize mr-1'>{item?.type}</span>
                        <span className='mx-1'>|</span>
                        <span>{item?.owner?.display_name}</span>
                    </div>
                </div>
            </Link>)
        case 'artists':
            return items?.map((item)=><Link key={item?.id} to={`/artist/${item?.id}`}>
                <div className='hover:bg-light-gray-hover flex justify-start items-center my-2 p-2 rounded-lg'>
                    <img src={item.images?.[2]?.url} className='w-1/4 rounded-full mr-5' />
                    <div>
                        <h6>{item.name}</h6>
                        <span className='capitalize mr-1'>{item?.type}</span>
                    </div>
                </div>
            </Link>)
        case 'albums':
            return items?.map((item)=><Link key={item?.album?.id} to={`/album/${item?.album?.id}`}>
                <div className='hover:bg-light-gray-hover flex justify-start items-center my-2 p-2 rounded-lg'>
                    <img src={item?.album?.images[2]?.url} className='w-1/4 rounded-lg mr-5' />
                    <div>
                        <h6>{item?.album?.name}</h6>
                        <span>{item?.album?.artists[0]?.name}</span>
                    </div>
                </div>
            </Link>)        
    }

}


