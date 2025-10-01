import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import Ad from "../../../../components/cards/ad"

const Ads = ({isHome})=>{
    const { t } = useTranslation()
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
            url : apiRoutes.panel.featured,
            signal : signal,
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
    return(<div className={`px-2  lg:px-16 ${isHome ? "":"flex flex-col gap-5"}`}>
        <div>
            <h2 className={`${isHome? "text-center pb-10":""}  `}>{t("featuredSMMPanels")}</h2>
            {!isHome && <p> Showing 0 - 18 of all SMM Panels in our SMM Panel Database</p>}
        </div>
        
        { isloading ? <Loading/>:<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10">
            { 
                data.length > 0 && data.map((e,idx)=>(<Ad key={`Ads_${idx}`}
                    name={e.translations?.en?.name ?? ""} 
                    id={e.id}
                    photo={e.photo ? e.photo :""}
                    rating={e.rating ? e.rating : 0}
                    services_count={e.services_count ? e.services_count: 0}
                />))
            }

        </div>}
        
    </div>)
}
export default Ads