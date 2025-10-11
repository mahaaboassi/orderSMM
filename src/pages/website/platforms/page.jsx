import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../components/loading"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Ad from "../../../components/cards/ad"
import { Link, useNavigate } from "react-router-dom"
import CardBumps from "../../../components/cards/bumps"
import { useSelector } from "react-redux"

const Paltforms = ()=>{
    const navigate = useNavigate()
    const [ ads, setAds ] = useState([])
    const [ data, setData ] = useState([])
    const { t, i18n } = useTranslation()
    const [ loading, setLoading ] = useState(false)
    const [ loadingAds, setLoadingAds ] = useState(false)
    const servicesRedux = useSelector(state => state.services)
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
            params: {orderBy: "updated_at"},
            method : "GET",
            hasToken : true
        })
        if(response){
            setAds(response.data)
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
            params: {results: 50},
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
                                    <img className="w-[30px]" src={e.photo} /> 
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
            <div className="flex flex-col gap-5 col-span-4  sm:col-span-1">
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
                            Add Your panel to Bumps
                    </div>
                </div>
                
            </div>
        </div>

    </div>)
}
export default Paltforms