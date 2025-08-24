import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"


const OurServices = ()=>{
    const { t,i18n } = useTranslation()
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const navigate = useNavigate()
    useEffect(()=>{
        const abortController = new AbortController()
        const signal  = abortController.signal
        getData(signal)
        setIsLoading(true)
        return () => abortController.abort() 
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.services.list,
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            setData(response.data)
            setIsLoading(false)
            
        }else{
            console.log(message);
            
        }
    }

    return(<div className="px-2 lg:px-16 flex flex-col gap-5">
        <h2>Our services</h2>
        {isloading? <Loading/>: <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            { 
                data.length>0 ?data.map((e,idx)=>(
                <div onClick={()=> navigate(`/our-services/${e.slug}/${e.id}`)} key={`Our_Services_${idx}_${e.translations?.en?.name}`} 
                className="card h-full flex flex-col gap-4 p-5 cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div><img style={{height : "40px",width:"40px",objectFit:"cover"}} src={e.photo} alt={e.name} /></div>
                        <h3>{e.translations?.[i18n.language]?.name}</h3>
                    </div>
                    <p>{e.translations?.[i18n.language]?.description}</p>
                </div>
                
               )):<div className="card p-4">No Data</div>
            }

        </div>}
    </div>)
}

export default OurServices