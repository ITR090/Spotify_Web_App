// Import Swiper React components
import React from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { FreeMode } from 'swiper/modules';

export default function Slider({children}) {
  return (
    <Swiper
      slidesPerView='auto'
      spaceBetween={10}
      freeMode
      centeredSlides
      centeredSlidesBounds
      modules={[FreeMode]}
    >
        {children}
    </Swiper>
  )
}
