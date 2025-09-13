import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import { storeClick } from "../../../functionality/functions"

const AdsPage = ({isHome})=>{
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    useEffect(()=>{
        const abortController = new AbortController()
        const signal  = abortController.signal
        getData(signal)
        setIsLoading(true)
        return () => abortController.abort() 
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            signal : signal,
            params : {is_provider: 1},
            method : "GET",
            hasToken : false
        })
        if(response){
            setData(response.data)
            setIsLoading(false)
            
        }else{
            console.log(message);
            
        }
    }
    return(<div className={`px-2  lg:px-16 ${isHome ? "py-20":"flex flex-col gap-5"}`}>
        <div>
            <h2 className={`${isHome? "text-center pb-10":""}  `}>{"Best Provider"}</h2>
            {!isHome && <p> Showing 0 - 18 of all SMM Panels in our SMM Panel Database</p>}
        </div>
        
        { isloading ? <Loading/>:<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10">
            { 
                data.length > 0 && data.map((e,idx)=>(<div  key={`Ads_${idx}`}>
                <div className="card-imge "><img src={e.photo ? e.photo :""} alt={`Image_${idx}`} />
                    <div onClick={()=>{
                        localStorage.setItem("click",JSON.stringify({
                            service_id: 11,
                            panel_id: e.id
                        }))
                        navigate(`/smm-panel/${e.translations?.en?.name ?? ""}/${e.id}`)}} className="goddy p-3 flex flex-col items-center gap-1"> 
                        <h3>{e.translations?.en?.name ?? ""}</h3>
                        <div className="flex justify-between gap-2 goddy-info">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                    <g clipPath="url(#clip0_271_2)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7 0L8.92671 4.59712L14 4.96555L10.1175 8.17517L11.3262 13L7 10.3866L2.67376 13L3.88258 8.17517L0 4.96555L5.07329 4.59712L7 0Z" fill="#19770D"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_271_2">
                                    <rect width="14" height="13" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                                &nbsp; {e.rating ? e.rating : 0}
                            </div>
                            <div>-</div>
                            <div className="flex"> {e.services_count ? e.services_count: 0} &nbsp; Services</div>
                        </div>
                        {/* {t("viewDetails")} */}
                    </div>
                </div>
            </div>))
            }

        </div>}
        
    </div>)
}
export default AdsPage