import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../components/loading"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Ad from "../../../components/cards/ad"
import { Link, useNavigate } from "react-router-dom"

const Paltforms = ()=>{
    const navigate = useNavigate()
    const [ ads, setAds ] = useState([])
    const [ data, setData ] = useState([])
    const { t, i18n } = useTranslation()
    const [ loading, setLoading ] = useState(false)
    const [ loadingAds, setLoadingAds ] = useState(false)
    useEffect(()=>{
        const abortController = new AbortController()
        const signal = abortController.signal
        getAds(signal)
        getData(signal)
        return () => abortController.abort()
    },[])
    const getAds = async (signal) => {
        setLoadingAds(true)
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);

            setAds(response.data.sort(() => 0.5 - Math.random()).slice(0, 2))
            setLoadingAds(false)
        }else{
            console.log(message);
            
        }        
    }
    const getData = async (signal) => {
        setLoading(true)
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.platforms.list,
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            setData(response.data)
            setLoading(false)
        }else{
            console.log(message);
            
        }        
    }
    return(<div className="px-2 lg:px-16 flex flex-col gap-5">
        <div>
            <h2>Top Social Media Platforms</h2>
            <p>Discover the leading Social Media Marketing (SMM) services across a wide range of panels. Browse over 538,980 SMM service options covering more than 56 social platforms from 300+ SMM panels worldwide. Easily compare and select SMM services by platform and category to find the perfect fit for your needs.</p>
        </div>
        <div className="grid grid-cols-4 gap-5 md:gap-10">
            <div className=" col-span-4 sm:col-span-3">
                {loading? <Loading/> : data.length>0? <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {
                        data.map((e,idx)=>(<div key={`Paltforms_${e.name}_${idx}`} className="card-platform p-5 flex flex-col gap-3">
                            <Link to={`/platforms/${e.id}?keywords=${e.name}`}>
                            <div className="flex gap-2 items-center">
                                <div>
                                    <img src={e.photo} /> 
                                </div>
                                <h3>{e.name} </h3>
                            </div>
                            </Link>
                            <hr/>
                            <div className="flex gap-2 flex-wrap container-child items-center h-full">
                                {e?.platform_links.length>0 && e?.platform_links.map((child,i)=>(<div  key={`Platform_${e.name}_${child.name}_${i}`}
                                    onClick={()=>navigate(`/platforms/${e.id}/${child.id}?keywords=${e.name+" "+child.translations?.[i18n.language].name}`)} className="child-platforms p-1.5">
                                    {child?.translations?.[i18n.language].name}
                                </div>))}
                            </div>
                            
                            {/* <div className="services-section">Services : <span>{e.count_services}</span></div> */}
                        </div>))
                    }
                </div>
                : <div className="card p-5">{t("no-data")}</div>
                } 
               
            </div>
            <div className="flex sm:flex-col gap-5 col-span-4  sm:col-span-1">
                {loadingAds ?[...Array(4)].map((_,i)=>(<div  className="h-20 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_Ads_${i}`} >
                </div>)):ads && ads.length > 0 && ads.map((e,idx)=>(<Ad key={`Ads_Services_Page_${e.translations?.en?.name ?? ""}_${idx}`} name={e.translations?.en?.name ?? ""} id={e.id}
                    photo={e.photo ? e.photo :""}
                    rating={e.rating ? e.rating : 0}
                    services_count={e.services_count ? e.services_count: 0}
                />)) }
               
            </div>
        </div>

    </div>)
}
export default Paltforms