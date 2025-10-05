import { useEffect, useState, useRef } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import Periods from "../../../../components/periods"
import Pagination from "../../../../components/pagination"
import Prices from "../../../../components/prices"
import { useDispatch } from "react-redux"

const AddWithServices = ({id, slug})=>{
    const dispatch = useDispatch()
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const { t,i18n } = useTranslation()
    const navigate = useNavigate()
    const [ period, setPeriod] = useState({})

    const [basicPrice, setBasicPrice] = useState(0)
    const abortControllerRef = useRef(null)
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
    useEffect(()=>{
        if(slug?.prices){
            const max = Math.max(...slug.prices.map(item => item.price));
            setBasicPrice(parseFloat(max));
        }
    },[slug])
    useEffect(()=>{getData()},[])
    const getData = async (page=1,search)=>{
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setData([])
        setIsLoading(true)
        let params = {page}
        if(search) params.keywords = search
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            signal : controller.signal,
            params: params,
            method : "GET",
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
 


    return(<div className="ads-services with-services ">
        <div className="">
            { 
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10">
                    <div className="col-span-4 lg:col-span-3">
                        <div className="">
                            <div>
                                <div className=" bg-zinc-200 flex flex-col gap-3 mb-4 p-2" >
                                    <div className="link"> &lt; Choose Panel What you Want &gt;</div>
                                    <div>
                                        <input onChange={(e)=>getData(1,e.target.value)} className="px-2 py-1" placeholder="Search Panel" />
                                    </div>
                                </div>
                                {isloading ? <Loading/>:  data.length > 0  && <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                                    {
                                        data.map((e,idx)=>(<div
                                                className="card-panel-user card cursor-pointer relative"  key={`Panels_User_${idx}`}
                                                onClick={()=>navigate(`/our-services/${slug.slug}/${id}/${e.id}`)}
                                            >
                                            <div className="absolute tooltip-panel">Choose the panel</div>
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
                                                </div>
                                            </div>
                                        </div>)) 
                                    }
                                </div>}
                                <Pagination currentPage={currentPage} lastPage={lastPage} returnedPageNumber={(res)=>{
                                            setCurrentPage(res)
                                            getData(res)
                                        }}/>


                                </div>
                        </div>
                    </div>
                    <div className="col-span-4 lg:col-span-1  relative">
                         <div className=" sticky top-30 flex flex-col xs:flex-row lg:flex-col gap-4">
                            <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                                <h4>Our Pricing Plans</h4>
                                <Prices basicPrice={basicPrice} prices={slug?.prices}/>
                            </div>
                            <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                                <h4>Choose Your Plan Duration</h4>
                                <Periods returnedSelected={(res)=>setPeriod(res)} price={basicPrice}/>
                            </div>
                            <div className="info-checkout w-full card p-4 flex flex-col gap-4">
                                <h4 >Invoice</h4>
                                <div> Total Services : <strong> {0}</strong> </div>
                                <div> Price per services : <strong>{basicPrice}</strong> </div>
                                
                                <div> Total price : <strong>{0}</strong> </div>
                                <div> 
                                    
                                    <button disabled={true} className="dark-btn w-full">
                                        {"Checkout"}
                                    </button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            }
        </div>

    </div>)
}
export default AddWithServices