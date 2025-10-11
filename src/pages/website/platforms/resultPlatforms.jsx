import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../components/loading"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Pagination from "../../../components/pagination"
import Service from "../../../components/cards/service"
import CardBumps from "../../../components/cards/bumps"
import { useSelector } from "react-redux"

const ResultPaltforms = ()=>{
    const { id, subId } = useParams() 
    const [ ads, setAds ] = useState([])
    const [ data, setData ] = useState([])
    const { t, i18n } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()
    const controllerRef = useRef(null);
    const [ loading, setLoading ] = useState(false)
    const [ loadingAds, setLoadingAds ] = useState(false)
    const [ services, setServices ] = useState([])
    const [ idLink, setIdLink ] = useState([])
    const queryParams = new URLSearchParams(location.search);
    const servicesRedux = useSelector(state=> state.services) 
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
            params: {orderBy: "updated_at"},
            hasToken : true
        })
        if(response){
            console.log(response);
            setAds(response.data)
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
            <div className="flex flex-col gap-5 col-span-4  sm:col-span-1 relative">

                <h2 className="!text-xl">
                    {t("hero.latestPanelUpdates") } (Bumps)
                </h2>
               <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-1  gap-4 ">  
                    {loadingAds ?[...Array(6)].map((_,i)=>(<div className="h-12 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_Latest_${i}`}>
                        </div>)): ads.length > 0 &&  ads.map((e,idx)=>(<CardBumps key={`Panal_Card_${e.title}_${idx}`}
                                                                            name={e?.translations?.en?.name || ""}
                                                                            id={e.id}
                                                                            rating={e.rating}
                                                                            logo={e.logo}
                                                                        />))}
                    <div className="flex gap-2 card-panals border-[var(--green_2)] cursor-pointer hover:text-[var(--green_2)]  p-4 items-center text-sm md:text-md"
                    style={(i18n.language == "ar" || i18n.language == "ur")?{borderRight:"4px solid"}:{ borderLeft:"4px solid"}}    
                        onClick={()=>navigate(`/our-services/${servicesRedux.bumps.slug}/${servicesRedux.bumps.id}`)}>
                            <div >
                                <svg className="!min-w-10" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 14 14" fill="none">
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
                            Add Your panel to Bumps</div>
                    </div>
            </div>
        </div>

    </div>)
}
export default ResultPaltforms