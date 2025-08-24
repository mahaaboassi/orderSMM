import { Link, useParams } from "react-router-dom"
import img from "../../../assets/images/ads_1.png"
import Pagination from "../../../components/pagination"
import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import Service from "../../../components/cards/service"
import { useTranslation } from "react-i18next"

const DetailsPanel = () => {
    const { name , id } = useParams()
    const { t } = useTranslation()
    const [ data, setData ] = useState({})
    const [ services, setServices] = useState([])
    const [ loading ,setLoading ] = useState(false)
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
    useEffect(()=>{
        const abortController = new AbortController()
        const signal = abortController.signal
        window.scrollTo({top :0})
        getData(signal)
        getServices(signal)
        return () => abortController.abort()
    },[id, name])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.getOne(id),
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
    const getServices = async (signal,page=1) => {
        setLoading(true)
        setServices([])
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel_services.list,
            signal : signal,
            method : "GET",
            params : {panel_id : id,page},
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
    return(<div className="px-2 lg:px-16 details-panel">
        <div className="flex flex-col-reverse sm:grid grid-cols-3 gap-5">
            <div className="col-span-3 sm:col-span-2 flex flex-col gap-5">
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <img className="!w-16 !h-16" src={data.photo? data.photo : ""} alt={name} />
                        <div>
                            <h2 className="capitalize">{name}</h2>
                            <div className="flex gap-2 goddy-info">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 14 13" fill="none">
                                        <g clipPath="url(#clip0_271_2)">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M7 0L8.92671 4.59712L14 4.96555L10.1175 8.17517L11.3262 13L7 10.3866L2.67376 13L3.88258 8.17517L0 4.96555L5.07329 4.59712L7 0Z" fill="#19770D"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_271_2">
                                        <rect width="14" height="13" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                    &nbsp; {data.rating ? data.rating : 0}
                                </div>
                                <div>-</div>
                                <div className="flex"> {data.services_count ? data.services_count : 0} &nbsp; Services</div>
                            </div>
                            </div>
                    </div>
                    <div className="flex items-center items-center gap-2 ">
                        {/* Telegram */}
                        
                        <div className="cursor-pointer">
                           <Link target="_blank" to={data.telegram ? `https://t.me/${data.telegram}` : ""}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 50 50" fill="none">
                                <path d="M49 25.0506C49 37.2377 40.2014 47.3127 28.7721 48.9481C27.703 49.101 26.6096 49.1802 25.5 49.1802C24.2185 49.1802 22.9614 49.0746 21.7353 48.8717C10.5469 47.0223 2 37.0598 2 25.0492C2 11.7227 12.5213 0.919556 25.5 0.919556C38.4787 0.919556 49 11.7227 49 25.0492V25.0506Z" fill="#00B0F2"/>
                                <path d="M10.3341 23.9625C10.4004 23.9277 10.4667 23.8958 10.533 23.8652C11.6629 23.3275 12.8077 22.8245 13.9512 22.3215C14.0134 22.3215 14.1176 22.2493 14.1745 22.2229C14.2624 22.184 14.3504 22.1451 14.4397 22.1061C14.6089 22.0311 14.7794 21.9575 14.9485 21.8824C15.2882 21.7338 15.6265 21.5837 15.9661 21.435C16.6441 21.1377 17.3234 20.8389 18.0014 20.5402C19.3587 19.9441 20.7159 19.348 22.0732 18.752C23.4305 18.1559 24.7878 17.5598 26.1451 16.9637C27.5023 16.3676 28.8596 15.7715 30.2169 15.1754C31.5742 14.5794 32.9315 13.9833 34.2887 13.3872C34.5905 13.2552 34.918 13.0551 35.24 12.9968C35.512 12.9481 35.7773 12.8509 36.0493 12.7981C36.5676 12.6966 37.14 12.6549 37.6366 12.8759C37.8085 12.9523 37.9654 13.0607 38.0994 13.1954C38.7286 13.836 38.6407 14.8864 38.5081 15.7868C37.5798 22.0617 36.6514 28.3352 35.7218 34.61C35.5946 35.4701 35.4227 36.415 34.7596 36.9582C34.1994 37.4182 33.4024 37.471 32.7122 37.275C32.0207 37.0791 31.4104 36.6665 30.8123 36.2593C28.3305 34.5725 25.8487 32.8843 23.3669 31.1975C22.7769 30.7959 22.1206 30.2735 22.1274 29.5468C22.1314 29.1091 22.3858 28.7187 22.6456 28.3713C24.8013 25.484 27.9151 23.4984 30.2291 20.7431C30.5552 20.3554 30.8123 19.6523 30.3644 19.4286C30.0978 19.2952 29.7906 19.4759 29.5484 19.6496C26.4888 21.8324 23.4292 24.0153 20.3695 26.1968C19.3708 26.9082 18.3248 27.6418 17.1218 27.8169C16.046 27.9739 14.9621 27.6668 13.9201 27.3514C13.0472 27.0874 12.1758 26.8179 11.307 26.5386C10.8456 26.3913 10.3692 26.2329 10.012 25.898C9.65474 25.5646 9.4504 25.0032 9.66556 24.5586C9.79953 24.2793 10.062 24.1028 10.3368 23.9597L10.3341 23.9625Z" fill="#FEFFFC"/>
                                </svg>
                            </Link>
                        </div>
                        {/* Whatsapp */}
                        <div className="cursor-pointer">
                            <Link target="_blank" to={data.whatsapp ? `https://wa.me/${data.whatsapp}` : ""}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 50 50" fill="none">
                                    <path d="M48.9574 25.1071C48.9574 37.2828 40.167 47.3484 28.7484 48.9823C27.6804 49.135 26.588 49.2141 25.4794 49.2141C24.1991 49.2141 22.9431 49.1086 21.7183 48.9059C10.5376 47.0583 2 37.1065 2 25.1071C2 11.7931 12.5114 1 25.478 1C38.4446 1 48.9561 11.7931 48.9561 25.1071H48.9574Z" fill="#00E510"/>
                                    <path d="M29.8404 32.2435C23.758 32.2421 18.8085 27.16 18.8071 20.916C18.8098 19.3335 20.0631 18.0453 21.603 18.0453C21.7611 18.0453 21.918 18.0592 22.0667 18.0869C22.3966 18.1425 22.7089 18.2577 22.9982 18.4298C23.0401 18.4548 23.0685 18.4964 23.0752 18.545L23.7174 22.7054C23.7255 22.754 23.7107 22.8026 23.6796 22.8386C23.324 23.2426 22.8711 23.5327 22.3682 23.6785L22.1262 23.7493L22.2181 23.9908C23.0482 26.1578 24.7354 27.8916 26.8472 28.7439L27.0824 28.8384L27.15 28.5885C27.292 28.0707 27.5746 27.6057 27.968 27.242C27.9964 27.2156 28.0342 27.2003 28.0734 27.2003C28.0815 27.2003 28.091 27.2003 28.0991 27.2031L32.1496 27.8625C32.1982 27.8708 32.2374 27.8985 32.2631 27.9416C32.4294 28.2387 32.5416 28.5607 32.5971 28.898C32.6227 29.0493 32.6363 29.2076 32.6363 29.3742C32.6363 30.9553 31.3817 32.2421 29.8404 32.2449V32.2435Z" fill="#FDFDFD"/>
                                    <path d="M40.6267 23.7369C40.2982 19.9305 38.6001 16.4003 35.8448 13.7975C33.0733 11.178 29.4758 9.73572 25.7146 9.73572C17.4596 9.73572 10.7431 16.6322 10.7431 25.1084C10.7431 27.9528 11.507 30.7249 12.9535 33.139L9.72778 40.4727L20.0594 39.3427C21.8562 40.0979 23.7584 40.481 25.7146 40.481C26.2297 40.481 26.757 40.4533 27.2856 40.3977C27.752 40.3464 28.2225 40.2714 28.6862 40.1756C35.6001 38.7416 40.647 32.4407 40.6862 25.1903V25.1084C40.6862 24.6461 40.6659 24.1852 40.6253 23.7383L40.6267 23.7369ZM20.4555 36.1235L14.7395 36.7482L16.447 32.8655L16.1063 32.3949C16.0806 32.3602 16.0563 32.3255 16.0279 32.2866C14.5461 30.1863 13.7634 27.7043 13.7634 25.107C13.7634 18.3396 19.1252 12.8355 25.7146 12.8355C31.889 12.8355 37.1211 17.7816 37.6254 24.095C37.6524 24.4337 37.6659 24.7738 37.6659 25.1084C37.6659 25.2042 37.6646 25.2986 37.6619 25.3985C37.5348 31.0595 33.6831 35.8667 28.2955 37.0911C27.8845 37.1855 27.4627 37.2563 27.0423 37.3035C26.6056 37.3549 26.1581 37.3798 25.7133 37.3798C24.1301 37.3798 22.5916 37.0647 21.1369 36.4428C20.976 36.3762 20.8179 36.3054 20.6691 36.2318L20.4528 36.1249L20.4555 36.1235Z" fill="#FDFDFD"/>
                                </svg>
                            </Link>
                        </div>
                        {/* Website */}
                        <div className="cursor-pointer ">
                            <Link target="_blank" to={data.website ? data.website : ""}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 52 53" fill="none">
                                <g clipPath="url(#clip0_217_2)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M25.9996 0.880005C40.3571 0.880005 51.9996 12.5229 51.9996 26.8796C51.9996 41.2376 40.3567 52.8796 25.9996 52.8796C11.6424 52.88 0 41.2376 0 26.8796C0 12.5229 11.6424 0.880005 25.9996 0.880005ZM33.1407 3.62854C41.8658 6.52857 48.4123 14.2067 49.6734 23.5606L48.8469 23.4722C48.7001 24.1048 48.5651 24.1209 48.5651 24.8826C48.5651 25.5546 49.4114 26.0045 49.4114 27.4229C49.4114 27.803 48.5189 28.563 48.4796 28.6954L47.1542 27.1407V29.1165L46.9528 29.1089L46.5956 25.4632L45.8555 25.6964L44.9748 22.9842L42.074 26.0121L42.0393 28.2291L41.0922 28.8643L40.0863 23.1776L39.4845 23.6173L38.1219 21.7786L36.0852 21.8391L35.3048 20.9475L34.5063 21.1671L32.9355 19.3669L32.632 19.5734L33.6053 22.0609H34.7348V21.4963H35.2989C35.706 22.6212 36.1457 21.9551 36.1457 22.6258C36.1457 24.9732 33.2465 26.6989 31.3473 27.1407C31.4488 27.5651 31.4095 27.9883 31.9114 27.9883C32.9748 27.9883 32.4463 27.8021 33.6053 27.706C33.5516 30.1042 30.8547 32.9683 29.7032 34.7536L30.2187 38.431C30.3545 39.2296 28.5602 40.0747 27.95 40.9739L28.2428 42.3827L27.4164 42.7166C27.2716 44.1638 25.8667 45.7694 24.2908 45.7694H22.5981C22.5981 43.7876 21.1864 40.9595 21.1864 39.5592C21.1864 38.3701 21.7505 38.2101 21.7505 36.7371C21.7505 35.3761 20.34 33.4244 20.34 33.0681V30.8101H19.2105C19.043 30.1808 19.1454 29.9637 18.3642 29.9637H18.0819C16.8488 29.9637 17.057 30.5278 15.8239 30.5278H14.6944C13.6762 30.5278 11.8722 27.2604 11.8722 26.8584V23.4717C11.8722 22.0101 13.2099 20.4189 14.1303 19.8019V18.3915L15.4007 17.1L16.1061 16.9798C17.6207 16.9798 17.4408 16.1334 18.3642 16.1334H20.9049V18.1092L23.6979 19.3018L23.9611 18.0965C25.2269 18.3932 25.5561 18.9564 27.1155 18.9564H27.6796C28.7507 18.9564 28.8082 17.5354 28.8082 16.4165L26.5472 16.64L25.5637 14.497L24.5857 14.7573C24.7614 15.524 24.8574 15.2054 24.8574 15.852C24.8574 16.2329 24.5438 16.2752 24.2925 16.4165L23.3145 13.9346L21.2118 12.4327L20.9325 12.707L22.7229 14.5909C22.4851 15.2668 22.4572 17.2184 21.4699 15.8516L22.3933 15.4073L20.092 12.9956L18.7133 13.5347L17.3524 14.8381C17.2102 15.888 16.9241 16.4161 15.8256 16.4161C15.0943 16.4161 15.5357 16.2269 14.4138 16.1338V13.3117H16.9537L16.1307 11.4319L15.8256 11.6181V11.0532L19.9503 9.15142C19.8724 8.5594 19.7776 8.87678 19.7776 8.23101C19.7776 8.19251 20.0548 7.67157 20.0599 7.66565L21.1267 8.32792L20.8715 7.11298L19.2258 7.45152L18.9202 5.97463C20.2253 5.28739 23.097 2.86851 24.0102 2.86851H24.8574C25.7491 2.86851 28.1375 3.7483 28.5259 4.27896L26.2611 4.0496L27.9415 5.43381L28.1028 4.84348L29.3571 4.49986L29.3723 3.71487H29.9377V4.56122L33.1407 3.62854ZM49.4961 31.2789C49.4309 31.6352 49.359 31.9882 49.2794 32.3386L49.1495 31.4279L49.4961 31.2789ZM48.6831 34.4794C48.6209 34.6682 48.5575 34.8577 48.4906 35.0448H48.2832V34.4794H48.6831ZM4.97572 40.3116C3.44212 37.9871 2.29658 35.3854 1.62585 32.5988L6.20505 34.807L6.22832 36.1734C6.22832 36.6753 5.37139 37.7434 5.09971 38.1492L4.97572 40.3116Z" fill="black"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_217_2">
                                <rect width="52" height="52" fill="white" transform="translate(0 0.880005)"/>
                                </clipPath>
                                </defs>
                                </svg>
                            </Link>
                        </div>

                    </div>
                </div>
                {/* Services */}
                {loading ? <Loading/> : <div className="flex flex-col gap-2">
                    {(services?.data && services.data.length > 0) ? 
                    services.data.map((e,idx)=>(<Service key={`Services_PinnedUp_${e.translations?.en?.name ?? ""}_${idx}`} 
                    name={e.translations?.en?.name ?? ""} 
                    category={e.category_translations?.en?.name ?? ""}
                    panel={e.panel_translations?.en?.name ?? ""}
                    max={e.max}
                    min={e.min}
                    price={e.price}
                    per_count={e.per_count}
                    isPinned = {false}
                    />)) : <div className="card p-5">{t("no-data")}</div>
                }

                </div>}
                {/* Pagination */}
                <Pagination currentPage={currentPage} lastPage={lastPage} returnedPageNumber={(res)=>{
                    setCurrentPage(res)
                    getServices(null,res)
                }} />
            </div>
            <div className="col-span-1 relative">
                <div className="sticky-img ">
                    <img src={data.photo? data.photo : ""} alt={name} />
                    <Link target="_blank" to={data.website ? data.website : ""}>
                        <div className="view-btn flex gap-2 ">
                            <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 12 11" fill="none">
                                    <g clipPath="url(#clip0_262_27)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 3.39561L8.58848 6.79121V5.09962C6.43115 4.6592 4.72695 5.14465 3.43262 6.76148C3.65732 3.43621 5.9626 1.83151 8.58838 1.72528L8.58848 0L12.0001 3.39561Z" fill="white"/>
                                    <path d="M0.674609 2.28491H4.15371C3.70576 2.66595 3.30313 3.10887 2.95605 3.61423H1.34912V9.67078H9.22051V8.25891L10.5695 6.9523V10.3354C10.5695 10.7024 10.2675 11 9.89502 11H0.674609C0.302051 11 0 10.7024 0 10.3354V2.94952C0 2.58243 0.302051 2.28491 0.674609 2.28491Z" fill="white"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_262_27">
                                    <rect width="12" height="11" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <div className="flex capitalize items-center">
                                View {name}
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    </div>)
}
export default DetailsPanel