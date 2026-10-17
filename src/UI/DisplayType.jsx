import React from 'react'
import { Link } from 'react-router-dom'
import { Music } from 'lucide-react'

const ROW = 'flex items-center gap-3 p-2 rounded-md hover:bg-sp-tinted-hover active:bg-[#000000] transition-colors'
const TITLE = 'text-white text-[15px] font-medium truncate'
const SUBTITLE = 'text-sp-subdued text-sm truncate'

// square/round thumbnail with a fallback when Spotify returns no image
const Thumb = ({ src, round }) => src
    ? <img src={src} className={`w-12 h-12 shrink-0 object-cover ${round ? 'rounded-full' : 'rounded'}`} alt='' />
    : <div className={`w-12 h-12 shrink-0 flex items-center justify-center bg-sp-highlight text-sp-subdued ${round ? 'rounded-full' : 'rounded'}`}><Music size={20} /></div>

export default function DisplayType({ type, items }) {


    switch(type){
        case 'playlists':
            return items?.map((item)=><Link key={item?.id} to={`/playlist/${item?.id}`}>
                <div className={ROW}>
                    <Thumb src={item?.images?.[2]?.url ?? item?.images?.[0]?.url} />
                    <div className='min-w-0'>
                        <h6 className={TITLE}>{item?.name}</h6>
                        <p className={SUBTITLE}>
                            <span className='capitalize'>{item?.type}</span>
                            <span className='mx-1'>•</span>
                            <span>{item?.owner?.display_name}</span>
                        </p>
                    </div>
                </div>
            </Link>)
        case 'artists':
            return items?.map((item)=><Link key={item?.id} to={`/artist/${item?.id}`}>
                <div className={ROW}>
                    <Thumb src={item.images?.[2]?.url ?? item.images?.[0]?.url} round />
                    <div className='min-w-0'>
                        <h6 className={TITLE}>{item.name}</h6>
                        <p className={`${SUBTITLE} capitalize`}>{item?.type}</p>
                    </div>
                </div>
            </Link>)
        case 'albums':
            return items?.map((item)=><Link key={item?.album?.id} to={`/album/${item?.album?.id}`}>
                <div className={ROW}>
                    <Thumb src={item?.album?.images[2]?.url ?? item?.album?.images[0]?.url} />
                    <div className='min-w-0'>
                        <h6 className={TITLE}>{item?.album?.name}</h6>
                        <p className={SUBTITLE}>
                            <span>Album</span>
                            <span className='mx-1'>•</span>
                            <span>{item?.album?.artists[0]?.name}</span>
                        </p>
                    </div>
                </div>
            </Link>)
    }

}
