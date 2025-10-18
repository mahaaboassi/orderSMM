import { useEffect, useRef, useState } from "react"
import Pagination from "../../../../components/pagination"
import { useTranslation } from "react-i18next"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { Link } from "react-router-dom"

const GetPanels = ({returnedPanelId})=>{
    const { t, i18n } = useTranslation()
    const abortControllerRef = useRef(null)
    const [isloading, setIsLoading ] = useState(false)
    const [ data, setData ] = useState([])
    // Track selected panel
    const [selectedPanel, setSelectedPanel] = useState(null)
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
    useEffect(()=>{getData()},[])
    const getData = async (page=1,search)=>{

        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setIsLoading(true)
        let params = {page, approved: 1}
        if(search) params.keywords = search
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            method : "GET",
            params : params,
            signal: controller.signal,
            hasToken : true
        })
        if(response){
            console.log(response);
            setData(response.data)
            setIsLoading(false)
            setLastPage(response.meta.last_page)
        }else{
            console.log(message);
            
        }
    }

    return(<div className="ads-services">
        <div className=" bg-zinc-200 flex flex-col gap-3 mb-4 p-2" >
            <div className="link"> &lt; Choose Panel What you Want &gt;</div>
            <div>
                <input onChange={(e)=>getData(1,e.target.value)} className="px-2 py-1" placeholder="Search Panel" />
            </div>
        </div>
        <div className="col-span-4 lg:col-span-3">
                { isloading ? <Loading/> :  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                    { data.length > 0 && data.map((e,idx)=>(<div className="card-panel-user card"  key={`Panels_User_${idx}`}>
                        <div className=""><img src={e.photo ? e.photo :""} alt={`Image_${idx}`} />
                            <div className=" p-3 flex flex-col items-center gap-1"> 
                                <Link to={`/smm-panel/${e.translations?.[i18n.language]?.name ?? ""}/${e.id}`}>
                                    <h3>{e.translations?.[i18n.language]?.name ?? ""}</h3>
                                </Link>
                                <div className="flex justify-between gap-2 info-panel">
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
                                <div className="flex items-center gap-2">
                                    <input name="panel" 
                                            checked={selectedPanel === e.id}
                                            onChange={() => {
                                                setSelectedPanel(e.id)
                                                returnedPanelId(e.id)
                                            }} type="radio"/>
                                    {t("Choose")}
                                </div>
                            </div>
                        </div>
                    </div>))}
                    
                </div>}
                {/* Pagination */}
                <Pagination currentPage={currentPage} lastPage={lastPage} returnedPageNumber={(res)=>{
                    setCurrentPage(res)
                    getData(res)
                }} />
        </div>

    </div>)
}
export default GetPanels