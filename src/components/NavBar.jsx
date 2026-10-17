import React, {useContext, useEffect, useRef, useState} from 'react'
import Spotify_Logo from '../assets/Spotify_logo.png'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
// contexts
import { StoreContext } from '../store/ContextStore'
import { SpotifyContext } from '../store/SpotifyStore'
// icons
import { House, Menu, Search as SearchIcon, X } from 'lucide-react'


export default function NavBar({ }) {


    const ctx = useContext(StoreContext)
    const sopt = useContext(SpotifyContext)

    const userProfile = sopt.getUserDetails()

    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const isSearchPage = location.pathname === '/search'

    const [query, setQuery] = useState(isSearchPage ? (searchParams.get('q') ?? '') : '')
    // true only while the latest change came from the user typing
    const typedRef = useRef(false)
    const inputRef = useRef()

    const goToSearch = (value) => {
        typedRef.current = false
        const q = value.trim()
        navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search', { replace: isSearchPage })
    }

    // live search: update the results page shortly after the user stops typing
    useEffect(() => {
        if (!typedRef.current) return
        const timer = setTimeout(() => goToSearch(query), 350)
        return () => clearTimeout(timer)
    }, [query])

    // like Spotify, clear the box when leaving the search page
    useEffect(() => {
        if (!isSearchPage) {
            typedRef.current = false
            setQuery('')
        }
    }, [isSearchPage])

    const onChangeQuery = (e) => {
        typedRef.current = true
        setQuery(e.target.value)
    }

    const onSubmitSearch = (e) => {
        e.preventDefault()
        goToSearch(query)
    }

    const onClearSearch = () => {
        typedRef.current = true
        setQuery('')
        inputRef.current?.focus()
    }

    return (
        <div className="h-16 shrink-0 flex items-center justify-between gap-2 px-4 bg-black">
            <div className="flex items-center gap-2">
                <label htmlFor="my-drawer-3" aria-label="open library" className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-sp-subdued hover:text-white hover:bg-sp-highlight cursor-pointer transition-colors">
                    <Menu size={22} />
                </label>
                <Link to={'/'} className="flex items-center justify-center w-10 h-10 rounded-full hover:scale-105 transition-transform">
                   <img src={Spotify_Logo} className='w-8 h-8' alt="Spotify" />
                </Link>
            </div>
            <div className="flex items-center justify-center gap-2 flex-1 min-w-0">
                <Link to={'/'} aria-label="Home" className={`shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-sp-elevated hover:scale-105 hover:bg-sp-highlight transition-all ${location.pathname === '/' ? 'text-white' : 'text-sp-subdued hover:text-white'}`}>
                    <House size={24} fill={location.pathname === '/' ? 'currentColor' : 'none'} />
                </Link>
                <form role="search" onSubmit={onSubmitSearch} className="group relative flex-1 min-w-0 max-w-md">
                    <SearchIcon size={22} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sp-subdued group-focus-within:text-white pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={onChangeQuery}
                        onFocus={() => { if (!isSearchPage) goToSearch(query) }}
                        placeholder="What do you want to play?"
                        aria-label="Search"
                        className="w-full h-12 pl-12 pr-11 rounded-full bg-sp-elevated text-white text-[15px] placeholder:text-sp-subdued border-2 border-transparent hover:bg-sp-highlight hover:border-white/10 focus:border-white focus:outline-none transition-colors [&::-webkit-search-cancel-button]:hidden"
                    />
                    {query &&
                        <button type="button" onClick={onClearSearch} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-sp-subdued hover:text-white cursor-pointer">
                            <X size={22} />
                        </button>
                    }
                </form>
            </div>
            <div className="flex items-center justify-end">
                {ctx.authenticated &&
                <div className="flex items-center gap-2 rounded-full bg-sp-elevated hover:bg-sp-highlight p-1 sm:pr-3 transition-colors">
                  <img src={(ctx?.authenticated && userProfile) ? userProfile?.images[0]?.url : null} className='rounded-full w-8 h-8 object-cover bg-sp-highlight' alt="" />
                  <h6 className='text-white text-sm font-bold max-w-40 truncate hidden md:block'>{userProfile?.display_name}</h6>
                </div>
                }
            </div>
        </div>
    )
}
