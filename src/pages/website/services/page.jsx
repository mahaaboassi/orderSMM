import { useEffect, useRef, useState } from "react"
import SearchInput from "../../../components/search"
import { useTranslation } from "react-i18next"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Service from "../../../components/cards/service"
import Ad from "../../../components/cards/ad"
import Pagination from "../../../components/pagination"
import Loading from "../../../components/loading"
import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

const Services = ()=>{
    const [ services, setServices ] = useState([])
    const [ ads, setAds ] = useState([])
    const { t ,i18n} = useTranslation()
    const [ loading, setLoading ] = useState(false)
    const [ search, setSearch ] = useState("")
    const location = useLocation()
    const navigate = useNavigate()
    const controllerRef = useRef(null);
    const queryParams = new URLSearchParams(location.search);
    // For Currency 
    const currency = useSelector(state => state.currency)
    
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
    useEffect(()=>{
        const abortController = new AbortController();
        const signal = abortController.signal;

        if(queryParams.get('page')) setCurrentPage(queryParams.get('page') || 1)
        if(queryParams.get('keywords')) setSearch(queryParams.get('keywords') || 1)

        getAds(signal)
        getServices()
        return () => abortController.abort() 
    },[])
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
        if( queryParams.get('country_id'))
            temp["country_id"] = queryParams.get('country_id') || ""
        
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
            setServices(response)
            setLoading(false)
            setLastPage(response.meta.last_page)
        }else{
            console.log(message);
            
        }
    }
    const resetQuery = ()=>{
       navigate(location.pathname, { replace: true }); 
    }
    const onSearch = ()=>{
        resetQuery()
        getServices()
    }
    const getAds = async (signal) => {
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
            
        }else{
            console.log(message);
            
        }        
    }
    const changeParams = (key,value)=>{
        queryParams.set(key,value)
        const params = queryParams.toString()
        window.history.replaceState({}, '', params ? `?${params}` : window.location.pathname);
        getServices()
    }
    return(<div className="px-2 lg:px-16 flex flex-col gap-5 ">
        <div>
            <h2>Explore Top SMM Panel Services</h2>
            <p>All services listed are sourced from our internal database of SMM panels.</p>
        </div>
        <div className="flex gap-2">
            <SearchInput value={search} onChange={(e)=>{
                setSearch(e)
                changeParams("keywords",e)
            }} onEnter={onSearch}/>
            <div style={{whiteSpace: "nowrap"}} className="flex p-2 justify-center items-center country-select">
                {t("selectCountry")} &nbsp; <svg style={{transform:"rotate(90deg)"}} xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                                    <path d="M0.589966 10.59L5.16997 6L0.589966 1.41L1.99997 0L7.99997 6L1.99997 12L0.589966 10.59Z" fill="#08392B"/>
                            </svg>
            </div>
            <div onClick={onSearch} style={{whiteSpace: "nowrap"}} className="flex p-2 justify-center items-center container-search ">{t("search")}</div>
        </div>
        {
            loading ? <Loading/>: <>
            <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
            {
                services?.pinnedUp && services.pinnedUp.length > 0 && 
                services.pinnedUp.map((e,idx)=>(<Service key={`Services_PinnedUp_${e.translations?.en?.name ?? ""}_${idx}`} 
                    name={e.translations?.en?.name ?? ""} 
                    category={e.category_translations?.en?.name ?? ""}
                    panel={e.panel_translations?.en?.name ?? ""}
                    max={e.max}
                    min={e.min}
                    price={e.price*currency.exchange_factor}
                    panel_id={e.panel_id}
                    per_count={e.per_count}
                    isPinned = {true}
                    />))
            }
        </div>
        <div className="grid grid-cols-4 gap-2 md:gap-10">
            <div className="flex flex-col gap-2 col-span-4 sm:col-span-3">
                {(services?.data && services.data.length > 0) ? 
                services.data.map((e,idx)=>(<Service key={`Services_PinnedUp_${e.translations?.en?.name ?? ""}_${idx}`} 
                    name={e.translations?.en?.name ?? ""} 
                    category={e.category_translations?.en?.name ?? ""}
                    panel={e.panel_translations?.en?.name ?? ""}
                    max={e.max}
                    min={e.min}
                    price={e.price*currency.exchange_factor}
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
            <div className=" flex-col gap-5 hidden sm:flex sm:col-span-1">
                {ads && ads.length > 0 && ads.map((e,idx)=>(<Ad key={`Ads_Services_Page_${e.translations?.en?.name ?? ""}_${idx}`} name={e.translations?.en?.name ?? ""} id={e.id}
                    photo={e.photo ? e.photo :""}
                    rating={e.rating ? e.rating : 0}
                    services_count={e.services_count ? e.services_count: 0}
                />)) }
               
            </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {
                services?.pinnedDown && services.pinnedDown.length > 0 && 
                services.pinnedDown.map((e,idx)=>(<Service key={`Services_pinnedDown_${e.translations?.en?.name ?? ""}_${idx}`} 
                    name={e.translations?.en?.name ?? ""} 
                    category={e.category_translations?.en?.name ?? ""}
                    panel={e.panel_translations?.en?.name ?? ""}
                    max={e.max}
                    min={e.min}
                    price={e.price*currency.exchange_factor}
                    panel_id={e.panel_id}
                    per_count={e.per_count}
                    isPinned = {true}
                    />))
            }
        </div>
            </>
        }
         <div className="grid grid-cols-2 gap-4 sm:hidden">
                {ads && ads.length > 0 && ads.map((e,idx)=>(<Ad key={`Ads_Services_Page_${e.translations?.en?.name ?? ""}_${idx}`} name={e.translations?.en?.name ?? ""} id={e.id}
                    photo={e.photo ? e.photo :""}
                    rating={e.rating ? e.rating : 0}
                    services_count={e.services_count ? e.services_count: 0}
                />)) }
               
            </div>

    </div>)
}

export default Services