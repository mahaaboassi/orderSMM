import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import { Link } from "react-router-dom"

const PlatformsSection = ()=>{
    const { t, i18n } = useTranslation()
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
            url : apiRoutes.platforms.list,
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
    return(<div className={`px-2 lg:px-16 `}>
        <div>
            <h2 className="text-center pb-10">Top Social Media Platforms</h2>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-5">
            {
            isloading ? [...Array(4)].map((_,i)=>(<div  className="h-20 w-full rounded-xl bg-gray-300 animate-pulse" key={`Skeleton_platforms_${i}`} >
                        </div>)) : data.length > 0 && data.map((e,idx)=>(<div key={`Paltforms_${e.name}_${idx}`} className="card-platform p-5 flex flex-col gap-3">
                    <Link to={`/platforms/${e.id}?keywords=${e.name}`}>
                    <div className="flex gap-2 items-center">
                        <div>
                            <img src={e.photo} /> 
                        </div>
                        <h3>{e.name} </h3>
                    </div>
                    </Link>
                    {/* <hr/>
                    <div className="flex gap-2 flex-wrap container-child items-center h-full">
                        {e?.platform_links.length>0 && e?.platform_links.map((child,i)=>(<div  key={`Platform_${e.name}_${child.name}_${i}`}
                            onClick={()=>navigate(`/platforms/${e.id}/${child.id}?keywords=${e.name+child.translations?.[i18n.language].name}`)} className="child-platforms p-1.5">
                            {child?.translations?.[i18n.language].name}
                        </div>))}
                    </div> */}
                    
                    {/* <div className="services-section">Services : <span>{e.count_services}</span></div> */}
                </div>))
            }
        </div>
        
    </div>)
}
export default PlatformsSection