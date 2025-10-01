import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../components/loading"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Ad from "../../../components/cards/ad"
import { useLocation, useParams } from "react-router-dom"
import Pagination from "../../../components/pagination"
import Service from "../../../components/cards/service"

const ResultPaltforms = ()=>{
    const { id, subId } = useParams() 
    const [ ads, setAds ] = useState([])
    const [ data, setData ] = useState([])
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const controllerRef = useRef(null);
    const [ loading, setLoading ] = useState(false)
    const [ loadingAds, setLoadingAds ] = useState(false)
    const [ services, setServices ] = useState([])
    const [ idLink, setIdLink ] = useState([])
    const queryParams = new URLSearchParams(location.search);
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
    useEffect(()=>{
        const abortController = new AbortController()
        const signal = abortController.signal
        getAds(signal)
        getData(signal)
        setIdLink(subId)
        return () => abortController.abort()
    },[])
    const getData= async (signal) => {
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.platforms.getOne(id),
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            
            setData(response.data)
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
            hasToken : true
        })
        if(response){
            console.log(response);
            setAds(response.data.sort(() => 0.5 - Math.random()).slice(0, 4))
            setLoadingAds(false)
        }else{
            console.log(message);
            
        }        
    }
    useEffect(()=>{
        if(queryParams.get('page')) setCurrentPage(queryParams.get('page') || 1)
        window.scrollTo({top:0})
        if(id != data.id) getData()
        getServices()
    },[location])
    const getServices = async () => {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const abortController = new AbortController();
        controllerRef.current = abortController;

        const signal = abortController.signal;

        setLoading(true)
        setServices([])
        const temp = {page : queryParams.get('page') || 1}
        if( queryParams.get('keywords') )
            temp["keywords"] = queryParams.get('keywords') || ""
        
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel_services.list,
            signal : signal,
            method : "GET",
            params :temp,
            hasToken : true
        })
        if(response){
            console.log(response);
            
            setServices(response)
            setLoading(false)
            setLastPage(response.meta.last_page)
        }else{
            console.log(message);
            // if(message == "signal is aborted without reason") setLoading(true)
            
            
        }
    }
    const changeParams = (key,value)=>{
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set(key,value)
        const params = queryParams.toString()
        window.history.replaceState({}, '', params ? `?${params}` : window.location.pathname);
        getServices()
    }
    return(<div className="px-2 lg:px-16 flex flex-col gap-5">
        <div>
            <h2>Top Clip Views for {data.name}</h2>
            <p>Showing {data.name} SMM services from our database.</p>
        </div>
        <div className="flex flex-col xs:flex-row justify-between line-links-platforms ">
            {data?.platform_links?.length>0 && data?.platform_links.map((e,idx)=>(<div className={`flex flex-col w-full items-center p-1 xs:py-3 ${idLink==e.id ? "active-child-link" : ""} child-link justify-center cursor-pointer`}
                key={`Links_Platform_${e.name}_${idx}`}
                onClick={()=>{
                    setIdLink(e.id)
                    changeParams("keywords",data.name+" "+e.translations?.[i18n.language].name)
                    changeParams("page",1)
                    setCurrentPage(1)
                }}
                >
                <div><span>{data.name}</span></div>
                <div className="text-center">
                    {e.translations?.[i18n.language].name}
                </div>
            </div>))}
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-5 lg:gap-10">
            <div className="flex flex-col gap-2 col-span-4 sm:col-span-3">
                { loading ? <Loading/> : (services?.data && services.data.length > 0) ? 
                    services.data.map((e,idx)=>(<Service key={`Services_Platform_${e.translations?.en?.name ?? ""}_${idx}`} 
                        name={e.translations?.en?.name ?? ""} 
                        pin={"up"}
                        category={e.category_translations?.en?.name ?? ""}
                        panel={e.panel_translations?.en?.name ?? ""}
                        max={e.max}
                        min={e.min}
                        is_top_result={e.is_top_result}
                        id={e.id}
                        // price={e.price*currency.exchange_factor}
                        panel_id={e.panel_id}
                        per_count={e.per_count}
                        isPinned = {false}
                        />)): <div className="card p-5">{t("no-data")}</div>
                } 
                <Pagination currentPage={currentPage} lastPage={lastPage} returnedPageNumber={(res)=>{
                    setCurrentPage(res)
                    changeParams("page",res)
                }} />
            </div>
            <div className=" flex-col flex col-span-4 sm:col-span-1 relative">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 flex-col sticky top-15 gap-5 flex">
                    { loadingAds ? [...Array(4)].map((_,i)=>(<div  className="h-20 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_Ads_${i}`} >
                        </div>)): ads && ads.length > 0 && ads.map((e,idx)=>(<Ad key={`Ads_Platform_Page_${e.translations?.en?.name ?? ""}_${idx}`}
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
export default ResultPaltforms