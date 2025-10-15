import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import { Helper } from "../../../../functionality/helper"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import Promotion from "./promotion"
import Bumps from "./bumps"
import AddWithServices from "./withServices"
import AddWithoutServices from "./withoutServices"

const ServicesWrapper = () => {
    const { slug, id } = useParams()
    const [ loading, setLoading ] = useState(true)
    const [ data, setData ] = useState({})
    const [ authorized, setAuthorized ] = useState(false)
    const navigate = useNavigate()
    const { i18n } = useTranslation()
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        if(!localStorage.getItem("user")){
            navigate("/auth/signin", {
                    state: { message: "Please sign in to continue." },
                })
        }else{
            setAuthorized(true)
        }
        getOne(signal)
        return () => controller.abort()
    },[id])
    const getOne = async(signal)=>{
        setLoading(true)
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.services.getOne(id),
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            setData(response.data)
            setLoading(false)
        }else{
            console.log(message);
        }
    }
    if(!authorized) return null
    return(loading? <Loading/>:<div className="px-2 lg:px-16 flex flex-col gap-5 md:gap-10 ">
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/our-services"}> Services</Link> / <div>{data?.translations?.[i18n.language]?.name ?? ""}</div>
            </div>
            <h2>{data?.translations?.[i18n.language]?.name}</h2>
            <p>{data?.translations?.[i18n.language]?.description}</p>
            
        </div>

        <div>
            {data?.slug == "promotion" && <Promotion isPromotion={true} slug={data} id={id}/> }
            {data?.slug == "best_providers" && <AddWithoutServices slug={data} id={id}/> }
            {data?.slug == "ads" && <AddWithoutServices isAd={true} slug={data}  id={id}/> }

            {data?.slug == "search_results" && <AddWithoutServices slug={data} id={id}/> }
            {(data?.slug == "pin_up" || data?.slug == "pin_down") && <AddWithServices slug={data} id={id}/> }

            {data?.slug == "api_emails" && <Promotion slug={data} id={id}/> }

            {data?.slug == "bumps" && <Bumps  slug={data} id={id}/> }
        </div>
    </div>)
}   
export default ServicesWrapper