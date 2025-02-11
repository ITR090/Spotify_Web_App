// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
// import required modules
import { Navigation } from 'swiper/modules';

export default function Slider({children}) {
  return (
    <Swiper navigation={true} modules={[Navigation]}
    slidesPerView='auto'
    spaceBetween={15}
    freeMode
    centeredSlides
    centeredSlidesBounds
    >
        {children}
    </Swiper>
  )
}
