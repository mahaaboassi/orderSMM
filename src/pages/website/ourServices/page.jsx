import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import Ad from "../../../components/cards/ad"


const OurServices = ()=>{
    const { t,i18n } = useTranslation()
    const [ data, setData ] = useState([])
    const [ ads, setAds ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const [ loadingAds, setLoadingAds ] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        const abortController = new AbortController()
        const signal  = abortController.signal
        getData(signal)
        getAds(signal)
        setIsLoading(true)
        return () => abortController.abort() 
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.services.list,
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            setData(response.data)
            setIsLoading(false)
            
        }else{
            console.log(message);
            
        }
    }
    const getAds = async (signal) => {
        setLoadingAds(true)
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            signal : signal,
            method : "GET",
            params : {
                is_ad : 1
            },
            hasToken : true
        })
        if(response){
            console.log(response);
            setAds(response.data.sort(() => 0.5 - Math.random()).slice(0, 3))
            setLoadingAds(false)
        }else{
            console.log(message);
            
        }        
    }
    return(<div className="px-2 lg:px-16 flex flex-col gap-5">
        <h2>Our services</h2>
        <div className="grid grid-cols-4 gap-2 md:gap-5 lg:gap-10">
            <div className="flex flex-col gap-2 col-span-4 sm:col-span-3">
                {isloading? <Loading/>: <div className="grid grid-cols-1 gap-5">
                    { 
                        data.length>0 ?data.map((e,idx)=>(
                        <div onClick={()=> navigate(`/our-services/${e.slug}/${e.id}`)} key={`Our_Services_${idx}_${e.translations?.en?.name}`} 
                        className="card h-full flex flex-col gap-4 p-5 cursor-pointer">
                            <div className="flex items-center gap-2">
                                <div><img style={{height : "40px",width:"40px",objectFit:"contain"}} src={e.photo} alt={e.name} /></div>
                                <h3>{e.translations?.[i18n.language]?.name}</h3>
                            </div>
                            <p>{e.translations?.[i18n.language]?.description}</p>
                        </div>
                        
                    )):<div className="card p-4">No Data</div>
                    }

                </div>}
            </div>
            <div className=" col-span-4 sm:col-span-1 relative">
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1 flex-col gap-5 flex sticky top-20">
                        { loadingAds ? [...Array(3)].map((_,i)=>(<div  className="h-20 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_Ads_${i}`} >
                        </div>)): ads && ads.length > 0 && ads.map((e,idx)=>(<Ad key={`Ads_Our_Services_Page_${e.translations?.en?.name ?? ""}_${idx}`}
                            name={e.translations?.en?.name ?? ""} 
                            id={e.id}
                            photo={e.photo ? e.photo :""}
                            rating={e.rating ? e.rating : 0}
                            services_count={e.services_count ? e.services_count: 0}
                        />)) }
                    </div>
            </div>

        </div>
        
    </div>)
}

export default OurServices