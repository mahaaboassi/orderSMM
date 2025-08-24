import arc from "../../../../assets/images/vector.png"
// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { panals } from "../../../../data/data";
import { useTranslation } from "react-i18next";



const Arc = ()=>{
    const { t } = useTranslation()
    return(<div className=" px-2  lg:px-16 arc pt-5">
        <div className="flex justify-center w-full">
            <img  className="w-full" src={arc} alt="Arc" />
        </div>
        <div className="content-arc flex flex-col gap-2">
            <h2 className="text-center pb-10">{t("topProviders")}</h2>
            <div style={{direction:"ltr"}}>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={3}
                    speed={2000}
                    autoplay={{ delay: 2000 }}
                    loop={true}
                    breakpoints={{
                        0: {
                        slidesPerView: 2,
                        },
                        640: {
                        slidesPerView: 3,
                        },
                        768: {
                        slidesPerView: 3,
                        },
                        1024: {
                        slidesPerView: 4,
                        },
                        1280: {
                        slidesPerView: 5,
                        },
                    }}
                    >
                
                    {panals.map((ele,idx)=>( <SwiperSlide key={`Panals_${ele.title}_${idx}`}>
                        <div className="flex container-img items-center py-2">
                            <img className="object-contain " src={ele.img} alt={ele.title} />
                        </div>
                    </SwiperSlide>))}

                </Swiper>
            </div>
             <div style={{direction:"ltr"}}>
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={30}
                    slidesPerView={3}
                    speed={2000}
                    autoplay={{ delay: 2000 ,reverseDirection: true }}
                    loop={true}
                    breakpoints={{
                        0: {
                        slidesPerView: 2,
                        },
                        640: {
                        slidesPerView: 3,
                        },
                        768: {
                        slidesPerView: 3,
                        },
                        1024: {
                        slidesPerView: 4,
                        },
                        1280: {
                        slidesPerView: 5,
                        },
                    }}
                    >
                
                    {panals.reverse().map((ele,idx)=>( <SwiperSlide key={`Panals_${ele.title}_${idx}`}>
                        <div className="flex container-img items-center py-2">
                            <img className="object-contain " src={ele.img} alt={ele.title} />
                        </div>
                    </SwiperSlide>))}

                </Swiper>
            </div>
        </div>
    </div>)
}

export default Arc