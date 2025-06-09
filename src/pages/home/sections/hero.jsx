import { useEffect, useState } from "react"
import SearchInput from "../../../components/search"
import { useDispatch } from "react-redux"
import { changePopup } from "../../../features/popupSlice"
import OffersProviders from "../../../components/bestOffers"
import { useTranslation } from "react-i18next"

const Hero = ()=>{
    const data = []
    const datam = [{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "135 services",
        date : "8 minutes ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#676767"/>
            </svg>,
        title : "Panel Name",
        services : "105 services",
        date : "8 minutes ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "230 services",
        date : "8 minutes ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#A9A932"/>
            </svg>,
        title : "Panel Name",
        services : "150 services",
        date : "17 minutes ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#676767"/>
            </svg>,
        title : "Panel Name",
        services : "135 services",
        date : "about 1 hours ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "300 services",
        date : "about 2 hours ago"
    },{
        icon : <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="#872121"/>
            </svg>,
        title : "Panel Name",
        services : "300 services",
        date : "about 4 hours ago"
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
    return<div className="hero px-2  lg:px-16 pt-5 lg:pt-12 pb-5">
        <div className=" sm:px-10 flex flex-col gap-5 lg:gap-14">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 lg:gap-10 ">
                <div className="flex flex-col gap-7">
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
                <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="card-panals p-5 flex flex-col gap-1">
                        <h3 className="mb-2">{t("hero.latestPanelUpdates")}</h3>
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
                    <div className="card-panals p-5 flex flex-col gap-1">
                        <h3 className="mb-2">{t("hero.finalActivePanels")}</h3>
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

                </div>

            </div>
            <div className="flex flex-col gap-2">
                <div style={{overflow:"hidden"}} className="flex gap-5">
                    {icons.map((e,idx)=>(<div className="flex gap-1 items-center icons-hero" key={`Icons_Before_Search_${e.title}_${idx}`}>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="24" viewBox="0 0 18 24" fill="none">
                                <g clipPath="url(#clip0_213_2)">
                                <path d="M6.65358 1.68874C6.76171 1.14781 7.27173 0.801535 7.79255 0.91384C8.31338 1.02614 8.64678 1.55585 8.53865 2.09678L7.44113 7.58287H12.626L13.8082 1.67751C13.9163 1.13658 14.4263 0.790305 14.9471 0.902609C15.468 1.01491 15.8014 1.54462 15.6932 2.08555L14.5921 7.58474H17.0358C17.5693 7.58474 18 8.03396 18 8.58612C18 9.13829 17.5675 9.58751 17.0358 9.58751H14.1902L12.9774 15.6426H17.034C17.5675 15.6426 17.9982 16.0918 17.9982 16.644C17.9982 17.198 17.5657 17.6454 17.034 17.6454H12.5773L11.4888 23.0828C11.3807 23.6237 10.8706 23.97 10.3498 23.8577C9.829 23.7454 9.4956 23.2157 9.60373 22.6747L10.6111 17.6435H5.42451L4.34141 23.0566C4.23328 23.5975 3.72327 23.9438 3.20244 23.8315C2.68162 23.7192 2.34822 23.1895 2.45635 22.6485L3.45835 17.6416H0.964157C0.432519 17.6454 0 17.1961 0 16.644C0 16.0899 0.432519 15.6426 0.964157 15.6426H3.85843L5.07129 9.58751H0.964157C0.432519 9.58751 0 9.13829 0 8.58425C0 8.03021 0.432519 7.58287 0.964157 7.58287H5.47317L6.65358 1.68874ZM11.0112 15.6407L12.2241 9.58563H7.03745L5.82459 15.6407H11.0112Z" fill="#08392B"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_213_2">
                                <rect width="18" height="23" fill="white" transform="translate(0 0.880005)"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </div>
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
        </div>
    </div>
}
export default Hero