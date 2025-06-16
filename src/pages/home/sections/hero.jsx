import { useEffect, useState } from "react"
import SearchInput from "../../../components/search"
import { useDispatch } from "react-redux"
import { changePopup } from "../../../features/popupSlice"
import OffersProviders from "../../../components/bestOffers"
import { useTranslation } from "react-i18next"

const Hero = ()=>{

    const data = [{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "135 services",
        date : "8m ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#676767"/>
            </svg>,
        title : "Panel Name",
        services : "105 services",
        date : "8m ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "230 services",
        date : "8m ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#A9A932"/>
            </svg>,
        title : "Panel Name",
        services : "150 services",
        date : "17m ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#676767"/>
            </svg>,
        title : "Panel Name",
        services : "135 services",
        date : "about 1h ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "300 services",
        date : "about 2h ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "300 services",
        date : "about 4h ago"
    }]
    const icons = [{
        name : "Facebook",
    },{
        name : "Instagram",
    },{
        name : "Twitter",
    },{
        name : "Tiktok",
    },{
        name : "Pintreset",
    },{
        name : "Linkedin",
    },{
        name : "Telegram",
    },{
        name : "Bottem",
    },{
        name : "Snapchat",
    },{
        name : "Spotify",
    },{
        name : "Youtube",
    },{
        name : "Google Play",
    },{
        name : "Anghami",
    },{
        name : "iOS App store",
    },{
        name : "Twitch",
    }]
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const half_border = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="16" viewBox="0 0 18 14" fill="none">
            <path d="M17 13C12.6 7.4 4.5 2.66667 1 1H8C14.8 1 16.8333 6.33333 17 9V13Z" fill="#19770D" stroke="#19770D" strokeWidth="0.5"/>
            </svg>
    const half_border_bottom = <svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 18 15" fill="none">
            <path d="M1.5 13.6984C7.38108 10.3163 10.5 9 17.5 1.01552V4.77346C17.5 9.00108 14.473 13.0199 8.85135 13.6984C3.22973 14.3769 1.5 13.6984 1.5 13.6984Z" fill="#19770D" stroke="#19770D" strokeWidth="0.5"/>
            </svg>
    const keywords = [t("hero.sentences_1"), t("hero.sentences_2"), t("hero.sentences_3")]
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
    return<div className="hero px-2  lg:px-16 pt-5 lg:pt-12 pb-5">
        <div className=" xl:px-10 flex flex-col gap-5 lg:gap-14">
            <div className="grid grid-cols-1  md:grid-cols-2 gap-5 lg:gap-10 ">
                <div className="flex flex-col gap-4 lg:gap-7">
                    <h2 className="text-center md:text-start">
                        <span key={indexWord} className="animated-word" >{keywords[indexWord]}</span>  
                    </h2>
                    <div className="card-info  ">
                        <div className="content flex justify-between items-center px-10 lg:px-20">
                            <div>{t("hero.services")}</div>
                            <div>{t("hero.panel")}</div>
                            <div className="flex justify-end">{t("hero.platform")}</div>
                        </div>
                        <div className="left-top-side">{half_border}</div>
                        <div className="right-top-side">{half_border}</div>
                        <div className="left-bottom-side">{half_border_bottom}</div>
                        <div className="right-bottom-side">{half_border_bottom}</div>
                        <div className="top-line"></div>
                        <div className="bottom-line"></div>
                    </div>
                    
                    <button onClick={openPopup} className="hero-btn">{t("hero.offer-btn")}</button>
                </div>
                <div className="hidden md:grid grid-cols-2 gap-2">
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.latestPanelUpdates")}
                        </h3>
                        <div className="flex flex-col justify-between h-full">
                            {data.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    {e.icon}
                                    <h4>{e.title}</h4>
                                    {/* <span>{e.services}</span> */}
                                </div>
                                <div className="date">
                                    {e.date}
                                </div>
                            </div>))}
                        </div>
                    </div>
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.finalActivePanels")}
                        </h3>
                         <div className="flex flex-col justify-between h-full ">
                            {data.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
                                
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    {e.icon}
                                    <h4>{e.title}</h4>
                                    {/* <span>{e.services}</span> */}
                                </div>
                                <div className="flex date">
                                    {e.date}
                                </div>
                            </div>))}
                         </div>

                    </div>

                </div>

            </div>
            <div className="flex flex-col gap-2">
                <div style={{overflow:"hidden"}} className="flex gap-5">
                    {icons.map((e,idx)=>(<div className="flex gap-1 items-center icons-hero" key={`Icons_Before_Search_${e.title}_${idx}`}>
                        <div className="cursor-pointer" style={{whiteSpace: "nowrap",fontWeight:"600"}}>{e.name}</div>
                    </div>))}
                </div>
                <div className="flex gap-2">
                    <SearchInput/>
                    <div style={{whiteSpace: "nowrap"}} className="flex p-2 justify-center items-center country-select">
                        {t("selectCountry")} &nbsp; <svg style={{transform:"rotate(90deg)"}} xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                                            <path d="M0.589966 10.59L5.16997 6L0.589966 1.41L1.99997 0L7.99997 6L1.99997 12L0.589966 10.59Z" fill="#08392B"/>
                                    </svg>
                    </div>
                    <div style={{whiteSpace: "nowrap"}} className="flex p-2 justify-center items-center container-search ">{t("search")}</div>
                </div>
            </div>

            {/* In Mobile Size */}
            <div className="grid md:hidden flex grid-cols-2 gap-2">
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.latestPanelUpdates")}
                        </h3>
                        <div className="flex flex-col justify-between h-full">
                            {data.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    {e.icon}
                                    <h4>{e.title}</h4>
                                    {/* <span>{e.services}</span> */}
                                </div>
                                <div className="date">
                                    {e.date}
                                </div>
                            </div>))}
                        </div>
                    </div>
                    <div className="card-panals p-2 sm:p-5 flex flex-col gap-1">
                        <h3>
                            {t("hero.finalActivePanels")}
                        </h3>
                         <div className="flex flex-col justify-between h-full ">
                            {data.map((e,idx)=>(<div className="flex justify-between items-center" key={`Panal_Card_${e.title}_${idx}`}>
                                
                                <div className="flex gap-1 sm:gap-2 items-center">
                                    {e.icon}
                                    <h4>{e.title}</h4>
                                    {/* <span>{e.services}</span> */}
                                </div>
                                <div className="flex date">
                                    {e.date}
                                </div>
                            </div>))}
                         </div>

                    </div>

                </div>
        </div>
    </div>
}
export default Hero