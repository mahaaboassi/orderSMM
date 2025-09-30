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
import Loading from "../../../../components/loading";


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
        <div className="content-arc flex flex-col gap-5">
            <h2 className="text-center pb-10">{t("topProviders")}</h2>
            {isloading ? <Loading/> : <>
            <div style={{direction:"ltr"}}>
                <div className="marquee marquee-left py-2">
                    <div className="marquee__track gap-2">
                    {[...data, ...data].map((ele, idx) => (
                        <a
                        key={ele.id + "_" + idx}
                        href={`/smm-panel/${ele.translations?.en?.name ?? ""}/${ele.id}`}
                        target="_blank"
                        rel="noreferrer"
                        >
                        <div className="flex items-center !py-2  marquee__item">
                            <img className="object-contain w-full h-full" src={ele.logo} alt={ele.name} />
                        </div>
                        </a>
                    ))}
                    </div>
                </div>

                <div style={{marginTop: "10px"}} className="marquee marquee-right py-2">
                    <div className="marquee__track gap-2">
                    {[...data, ...data].map((ele, idx) => (
                        <a
                        key={ele.id + "_" + idx + "_rev"}
                        href={`/smm-panel/${ele.translations?.en?.name ?? ""}/${ele.id}`}
                        target="_blank"
                        rel="noreferrer"
                        >
                        <div className="flex  items-center !py-2 marquee__item">
                            <img className="object-contain" src={ele.logo} alt={ele.name} />
                        </div>
                        </a>
                    ))}
                    </div>
                </div>
                </div>
            
            </>}
        </div>
    </div>)
}

export default Arc