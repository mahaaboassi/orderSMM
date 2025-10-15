import { useEffect, useState } from "react"
import SearchInput from "../../../../components/search"
import { useDispatch, useSelector } from "react-redux"
import { changePopup } from "../../../../features/popupSlice"
import OffersProviders from "../../../../components/bestOffers"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Countries from "../../../../components/countries"
import { settingsStatus } from "../../../../features/settingsSlice"
import SocialLine from "../../../../components/socialLine"

const Hero = ()=>{

    
    const { t, i18n} = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector(state => state.settings)
    const [ settingsObj, setSettingObj ] = useState({})
    const navigate = useNavigate()
    const [ values, setvalues ] = useState({
        search : "",
        country_id : ""
    })
    const half_border = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 18 14" fill="none">
            <path d="M17 13C12.6 7.4 4.5 2.66667 1 1H8C14.8 1 16.8333 6.33333 17 9V13Z" fill="#19770D" stroke="#19770D" strokeWidth="0.5"/>
            </svg>
    const half_border_bottom = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 18 15" fill="none">
            <path d="M1.5 13.6984C7.38108 10.3163 10.5 9 17.5 1.01552V4.77346C17.5 9.00108 14.473 13.0199 8.85135 13.6984C3.22973 14.3769 1.5 13.6984 1.5 13.6984Z" fill="#19770D" stroke="#19770D" strokeWidth="0.5"/>
            </svg>
    const keywords = [t("hero.sentences_1"), t("hero.sentences_2"), t("hero.sentences_3"),t("hero.sentences_4"),t("hero.sentences_5")]
    const [indexWord, setIndexWord ] = useState(0)
    useEffect(()=>{
        setTimeout(()=>{
            setIndexWord(prev=> prev== keywords.length - 1 ? 0 : prev+1)
        },5000)
    },[indexWord])
    const openPopup = ()=>{
        dispatch(changePopup({
            isOpen: true,
            component : <OffersProviders/>
        }))
    }
    const openPopupForPanels = (title, data)=>{
      if(window.innerWidth <= 1280)
        dispatch(changePopup({
                isOpen: true,
                component : <div className="px-3">
                    <h3 style={{fontWeight : "600"}} className="mb-2">{title}</h3>
                        {data.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
    
                        <div className="flex gap-2 items-center">
                            {e.icon}
                            <h4>{e.title}</h4>
                            {/* <span>{e.services}</span> */}
                        </div>
                        <div className="date">
                            {e.date}
                        </div>
                    </div>))}
                </div>
            }))
    }
    // Get Panels Proccess
    const [ panelsLatest, setPanelsLatest ] = useState([])
    const [ panelsActive, setPanelsActive ] = useState([])
    const [ loadingActive, setLoadingActive ] = useState([])
    const [ loadingLatest, setLoadingLatest ] = useState([])


    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getPanels(signal,"active")
        getPanels(signal,"latest")
        getSettings(signal)
        return()=> controller.abort()
    },[])
    const getPanels = async (signal, key)=>{
        if( key == "active" ) setLoadingActive(true)
        if( key == "latest" ) setLoadingLatest(true)
        const { response , message } = await Helper({
            method : "GET",
            url : apiRoutes.panel.list,
            signal : signal,
            params :  { orderBy : key == "active" ? "created_at" : "updated_at"} 
        })
        if(response){

            if( key == "active" ) {
                setLoadingActive(false)
                setPanelsActive(response.data)
            }
            if( key == "latest" ) {
                setLoadingLatest(false)
                setPanelsLatest(response.data)
            }
        }else{
            console.log(message);
            
        }
        
    }
    const getSettings = async (signal)=>{
        const { response , message } = await Helper({
            method : "GET",
            url : apiRoutes.settings.list,
            signal : signal,
        })
        if(response){

            setSettingObj(response.data)
            dispatch(settingsStatus(response.data))
        }else{
            console.log(message);
            
        }
        
    }
    return<div className="hero px-2  lg:px-16 pt-5 lg:pt-12 pb-5">
        <div className=" xl:px-10 flex flex-col gap-5 lg:gap-14">
            <div className="grid grid-cols-1  md:grid-cols-2 gap-5 lg:gap-10 ">
                <div className="">
                    <h1 className="flex gap-2 flex justify-center md:justify-start">Order SMM 

                       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="35" viewBox="0 0 52 55" fill="none">
                            <g clipPath="url(#clip0_260_9)">
                            <path d="M-3.49606 41.1765C22.0031 46.0263 27.4541 21.3258 28.378 10.1523L36 22.8037C28.5165 51.3317 10.0157 55.7971 -0.0314956 55.0839L-8 41.1765H-3.49606Z" fill="#19770D"/>
                            <path d="M51.2402 -0.0768228L42.7952 43.4007L31.9947 25.3469L7.74748 16.2842L51.2402 -0.0768228Z" fill="#19770D"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_260_9">
                            <rect width="52" height="55" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </h1>
                    <h2 className="justify-center text-center md:text-start md:justify-start flex items-center min-h-30 xs:min-h-20 lg:min-h-30">
                        <span key={indexWord} className="animated-word" >{keywords[indexWord]}</span>  
                    </h2>
                    <div className="card-info  ">
                        <div className="content flex justify-between items-center px-10 lg:px-20">
                            <div >{(parseInt(settingsObj?.services ?? 0) + parseInt(settingsObj?.real_services ?? 0)) ?? ""} {t("hero.services")}</div>
                            <div>{(parseInt(settingsObj?.panels ?? 0) + parseInt(settingsObj?.real_panels ?? 0)) ?? ""} {t("hero.panel")}</div>
                            <div className="flex justify-end">{ (parseInt(settingsObj?.platforms ?? 0) + parseInt(settingsObj?.real_platforms ?? 0)) ?? ""} {t("hero.platform")}</div>
                        </div>
                        <div className="left-top-side">{half_border}</div>
                        <div className="right-top-side">{half_border}</div>
                        <div className="left-bottom-side">{half_border_bottom}</div>
                        <div className="right-bottom-side">{half_border_bottom}</div>
                        <div className="top-line"></div>
                        <div className="bottom-line"></div>
                    </div>
                    
                    {/* <button onClick={openPopup} className="hero-btn">{t("hero.offer-btn")}</button> */}
                </div>
                <div className="hidden md:grid grid-cols-2 gap-2">
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1 ">
                        <h3>
                            {t("hero.latestPanelUpdates") } (Bumps)
                        </h3>
                        <div className="flex flex-col justify-between h-full ">
                            {loadingLatest ? <div className="flex flex-col gap-2 justify-between">
                                {[...Array(6)].map((_,i)=>(<div className="h-4 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_Latest_${i}`}>
                                </div>))}
                            </div>: panelsLatest.length > 0 &&  panelsLatest.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}
                                    onClick={()=>{
                                        localStorage.setItem("click",JSON.stringify({
                                                service_id: 36,
                                                panel_id: e.id
                                            }))
                                    }}>
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    <div> <img style={{borderRadius:"50%",width:"15px", height:"15px"}}  src={e.photo} /> </div>
                                    <Link target="_blank" to={`/smm-panel/${e.translations?.en?.name ?? ""}/${e.id}`}>
                                    <h4>{e?.translations?.en?.name || ""}</h4>
                                    </Link>
                                    
                                    </div>
                                </div>))}
                            </div>
                    </div>
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.finalActivePanels")}
                        </h3>
                         <div className="flex flex-col justify-between h-full ">
                            {loadingActive ? <div className="flex flex-col gap-2 justify-between">
                                {[...Array(6)].map((_,i)=>(<div className="h-4 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_${i}`}>

                                </div>))}
                            </div>:panelsActive.length > 0 && panelsActive.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
                                
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    <div> <img style={{borderRadius:"50%",width:"15px", height:"15px"}}  src={e.photo} /> </div>
                                    <Link target="_blank" to={`/smm-panel/${e.translations?.en?.name ?? ""}/${e.id}`}>
                                      <h4>{e?.translations?.en?.name || ""}</h4>
                                    </Link>
                                    
                                </div>
                            </div>))}
                         </div>

                    </div>

                </div>

            </div>
            <div className="flex flex-col gap-2">
                <SocialLine/>
                <div className="flex gap-2">
                    <SearchInput type="search" onChange={(res)=>setvalues(prev=>({...prev,search:res}))}  onEnter={()=>navigate(`/services?keywords=${values.search}&country=${values.country_id}`)}/>
                    <Countries returnedCountry={(res)=>{setvalues(prev=>({...prev, country_id : res}))}}/>
                    <div onClick={()=>navigate(`/services?keywords=${values.search}&country=${values.country_id}`)} style={{whiteSpace: "nowrap"}} className="flex p-2 justify-center items-center container-search ">{t("search")}</div>
                </div>
            </div>

            {/* In Mobile Size */}
            <div className="grid md:hidden flex grid-cols-2 gap-2">
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.latestPanelUpdates")} (Bumps)
                        </h3>
                        <div className="flex flex-col justify-between h-full">
                            {loadingLatest ? <div className="flex flex-col gap-2 justify-between">
                                {[...Array(9)].map((_,i)=>(<div className="h-4 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_Latest_${i}`}>
                                </div>))}
                            </div>: panelsLatest.length > 0 &&  panelsLatest.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}
                                    onClick={()=>{
                                        localStorage.setItem("click",JSON.stringify({
                                                service_id: 36,
                                                panel_id: e.id
                                            }))
                                    }}>
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    <div> <img style={{borderRadius:"50%",width:"15px", height:"15px"}}  src={e.photo} /> </div>
                                    <Link target="_blank" to={`/smm-panel/${e.translations?.en?.name ?? ""}/${e.id}`}>
                                      <h4>{e?.translations?.en?.name || ""}</h4>
                                    </Link>
                                    
                                </div>
                            </div>))}
                        </div>
                    </div>
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.finalActivePanels")} 
                        </h3>
                         <div className="flex flex-col justify-between h-full ">
                            {loadingActive ? <div className="flex flex-col gap-2 justify-between">
                                {[...Array(9)].map((_,i)=>(<div className="h-4 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_${i}`}>

                                </div>))}
                            </div>:panelsActive.length > 0 && panelsActive.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
                                
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    <div> <img style={{borderRadius:"50%",width:"15px", height:"15px"}}  src={e.photo} /> </div>
                                    <Link target="_blank" to={`/smm-panel/${e.translations?.en?.name ?? ""}/${e.id}`}>
                                      <h4>{e?.translations?.en?.name || ""}</h4>
                                    </Link>
                                    
                                </div>
                            </div>))}
                         </div>

                    </div>

                </div>
        </div>
    </div>
}
export default Hero