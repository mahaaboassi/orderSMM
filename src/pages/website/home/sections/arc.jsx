import arc from "../../../../assets/images/vector.png"
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import { Link } from "react-router-dom";
import Loading from "../../../../components/loading";
import { useSelector } from "react-redux";

const Arc = ()=>{
    const { t } = useTranslation()
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const service = useSelector(state=> state.services)
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
            params : {is_ad: 1,results: 10},
            method : "GET",
            hasToken : false
        })
        if(response){
            setData(response.data)
            setIsLoading(false)
            getDataProvider(response.data)
        }else{
            console.log(message);
            
        }
    }
    const getDataProvider = async (adsData)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            params : { is_provider:1, results: 10},
            method : "GET",
            hasToken : false
        })
        if(response){
            const existedIds = new Set(adsData.map(e=>e.id))
            let newItems = response.data.filter(ele=> !existedIds.has(ele.id))
            setData([...adsData, ...newItems]);
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
                        {[...data,{ isAddCard: true },...data].map((ele, idx) => (<div key={`Marquee_left_${idx}`}>
                            {ele.isAddCard ? <Link className="container-add" to={`/our-services/${service.best_providers.slug}/${service.best_providers.id}`}>
                            <div className="flex gap-2 items-center !py-2  marquee__item">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14" fill="none">
                                        <g clipPath="url(#clip0_235_21)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M11.9501 2.05044C14.6837 4.78416 14.6837 9.21639 11.9501 11.9501C9.21639 14.6837 4.78416 14.6837 2.05044 11.9501C-0.683156 9.21639 -0.683156 4.78416 2.05044 2.05044C4.78416 -0.683156 9.21639 -0.683156 11.9501 2.05044ZM10.6652 6.60253C10.8848 6.60253 11.0628 6.78061 11.0628 7.00016C11.0628 7.21982 10.8847 7.39779 10.6652 7.39779H7.3979V10.6652C7.3979 10.8848 7.21982 11.0628 7.00027 11.0628C6.78072 11.0628 6.60276 10.8847 6.60276 10.6652V7.3979H3.33527C3.11561 7.3979 2.93753 7.21982 2.93753 7.00027C2.93753 6.78072 3.11561 6.60265 3.33527 6.60265H6.60265V3.33515C6.60265 3.11561 6.78072 2.93753 7.00016 2.93753C7.21982 2.93753 7.39779 3.11561 7.39779 3.33515V6.60253H10.6652Z" fill="#08392B"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_235_21">
                                        <rect width="14" height="14" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <h3>Add </h3>
                            </div>
                        </Link> : <Link
                            to={`/smm-panel/${ele.translations?.en?.name ?? ""}/${ele.id}`}
                            target="_blank"
                            rel="noreferrer"
                            >
                            <div onClick={()=>{
                                    localStorage.setItem("click",JSON.stringify({
                                            service_id: 11,
                                            panel_id: ele.id
                                        }))
                                }} className="flex  items-center !py-2  marquee__item">
                                <img className="object-contain w-full h-full" src={ele.logo} alt={ele.name} />
                            </div>
                            </Link>}
                        </div>
                            
                        ))}
                    
                    </div>
                    
                    
                </div>

                <div style={{marginTop: "10px"}} className="marquee marquee-right py-2">
                    <div className="marquee__track gap-2">
                        {[...data,{ isAddCard: true },...data].map((ele, idx) => (<div key={`Marquee_right_${idx}`}>
                            {ele.isAddCard? <Link className="container-add" to={`/our-services/${service.best_providers.slug}/${service.best_providers.id}`}>
                            <div className="flex gap-2 items-center !py-2  marquee__item">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14" fill="none">
                                        <g clipPath="url(#clip0_235_21)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M11.9501 2.05044C14.6837 4.78416 14.6837 9.21639 11.9501 11.9501C9.21639 14.6837 4.78416 14.6837 2.05044 11.9501C-0.683156 9.21639 -0.683156 4.78416 2.05044 2.05044C4.78416 -0.683156 9.21639 -0.683156 11.9501 2.05044ZM10.6652 6.60253C10.8848 6.60253 11.0628 6.78061 11.0628 7.00016C11.0628 7.21982 10.8847 7.39779 10.6652 7.39779H7.3979V10.6652C7.3979 10.8848 7.21982 11.0628 7.00027 11.0628C6.78072 11.0628 6.60276 10.8847 6.60276 10.6652V7.3979H3.33527C3.11561 7.3979 2.93753 7.21982 2.93753 7.00027C2.93753 6.78072 3.11561 6.60265 3.33527 6.60265H6.60265V3.33515C6.60265 3.11561 6.78072 2.93753 7.00016 2.93753C7.21982 2.93753 7.39779 3.11561 7.39779 3.33515V6.60253H10.6652Z" fill="#08392B"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_235_21">
                                        <rect width="14" height="14" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <h3>Add </h3>
                            </div>
                        </Link>  :<Link
                            to={`/smm-panel/${ele.translations?.en?.name ?? ""}/${ele.id}`}
                            target="_blank"
                            rel="noreferrer"
                            >
                            <div onClick={()=>{
                                        localStorage.setItem("click",JSON.stringify({
                                            service_id: 11,
                                            panel_id: ele.id
                                        }))
                                }} className="flex  items-center  !py-2 marquee__item">
                                <img className="object-contain" src={ele.logo} alt={ele.name} />
                            </div>
                            </Link>}
                        </div>
                            
                        ))}
                        
                    </div>
                </div>
                </div>
            
            </>}
        </div>
    </div>)
}

export default Arc