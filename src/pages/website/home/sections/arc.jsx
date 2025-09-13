import arc from "../../../../assets/images/vector.png"
// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import { Link } from "react-router-dom";


const Arc = ()=>{
    const { t } = useTranslation()
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    useEffect(()=>{
        const abortController = new AbortController()
        const signal  = abortController.signal
        getData(signal)
        setIsLoading(true)
        return () => abortController.abort() 
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            signal : signal,
            params : {is_provider: 1},
            method : "GET",
            hasToken : false
        })
        if(response){
            setData(response.data)
            setIsLoading(false)
            
        }else{
            console.log(message);
            
        }
    }
    return(<div className=" px-2  lg:px-16 arc pt-5 best-provider">
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
                
                    {data.map((ele,idx)=>( <SwiperSlide onClick={()=>{
                                 localStorage.setItem("click",JSON.stringify({
                                        service_id: 11,
                                        panel_id: ele.id
                                    }))
                            }} key={`Panals_${ele.title}_${idx}`}>
                        <Link target="_blank" to={ele.website}>
                            <div  className="flex container-img items-center py-2 logo">
                                <img className="object-contain " src={ele.logo} alt={ele.name} />
                            </div>
                        </Link>
                        
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
                
                    {data.reverse().map((ele,idx)=>( <SwiperSlide key={`Panals_${ele.name}_${idx}`}>
                        <Link target="_blank" to={ele.website}>
                            <div className="flex container-img items-center py-2 logo">
                                <img className="object-contain " src={ele.logo} alt={ele.name} />
                            </div>
                        </Link>
                    </SwiperSlide>))}

                </Swiper>
            </div>
        </div>
    </div>)
}

export default Arc