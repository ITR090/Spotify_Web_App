// Import Swiper React components
import React, { useState } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
// import required modules
import { FreeMode, Mousewheel } from 'swiper/modules';
// icons
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Spotify-style round arrow, shown when hovering the row
const ArrowButton = ({ direction, onClick, hidden }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'prev' ? 'Scroll left' : 'Scroll right'}
      tabIndex={hidden ? -1 : 0}
      className={`absolute top-[40%] -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-9 h-9 rounded-full bg-sp-elevated/90 text-white shadow-lg shadow-black/50 hover:bg-sp-highlight hover:scale-105 transition-all cursor-pointer
        ${direction === 'prev' ? 'left-1' : 'right-1'}
        ${hidden ? 'opacity-0! pointer-events-none' : 'opacity-0 group-hover/slider:opacity-100 focus-visible:opacity-100'}`}
    >
      <Icon size={20} />
    </button>
  )
}

export default function Slider({children}) {

  const [swiper, setSwiper] = useState(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)

  // keep the arrows in sync with the scroll position
  const updateEdges = (s) => {
    setAtStart(s.isBeginning)
    setAtEnd(s.isEnd)
  }

  // move by roughly one "page" of cards, like Spotify
  const scrollBy = (dir) => {
    if (!swiper) return
    const step = Math.max(1, Math.floor(swiper.slidesPerViewDynamic()) - 1)
    const last = swiper.slides.length - 1
    const target = Math.min(last, Math.max(0, swiper.activeIndex + dir * step))
    swiper.slideTo(target)
  }

  return (
    <div className="group/slider relative">
      <Swiper
        slidesPerView='auto'
        spaceBetween={8}
        // free scrolling, but rows start flush left (no centering — that offset the first card)
        freeMode={{ enabled: true, sticky: false, momentumBounce: false }}
        mousewheel={{ forceToAxis: true }}
        watchOverflow
        modules={[FreeMode, Mousewheel]}
        onSwiper={(s) => { setSwiper(s); updateEdges(s) }}
        onProgress={updateEdges}
        onResize={updateEdges}
        onUpdate={updateEdges}
        onSlidesLengthChange={updateEdges}
      >
          {children}
      </Swiper>
      <ArrowButton direction="prev" onClick={() => scrollBy(-1)} hidden={atStart} />
      <ArrowButton direction="next" onClick={() => scrollBy(1)} hidden={atEnd} />
    </div>
  )
}
