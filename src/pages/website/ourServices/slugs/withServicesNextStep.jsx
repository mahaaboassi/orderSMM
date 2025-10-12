import { useEffect, useState, useRef } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router-dom"
import Periods from "../../../../components/periods"
import Service from "../../../../components/cards/service"
import Pagination from "../../../../components/pagination"
import Prices from "../../../../components/prices"
import SearchInput from "../../../../components/search"
import { useDispatch } from "react-redux"
import { callStatus } from "../../../../features/callNotification"
import { changePopupBalance } from "../../../../features/popupBalanceSlice"

const AddWithServicesNextStep = ()=>{
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {id, slug, panel_id} = useParams()
    const [ service, setService ] = useState({})
    const [isloading, setIsLoading ] = useState(false)
    const [ isSubmit, setIsSubmit ] = useState(false)
    const { t,i18n } = useTranslation()
    const [ period, setPeriod] = useState({})
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const [basicPrice, setBasicPrice] = useState(0)
    const abortControllerRef = useRef(null)

    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        getService(signal)
        getServices()
        return ()=> controller.abort()
    },[id])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.getOne(panel_id),
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            setSelectedPanel(response.data)
            setIsLoading(false)
        }else{
            console.log(message);
            
        }
    }
    const getService = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.services.getOne(id),
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            setService(response.data)
            setIsLoading(false)
            const max = Math.max(...response.data.prices.map(item => item.price));
            setBasicPrice(parseFloat(max));
        }else{
            console.log(message);
            
        }
    }
    const submit = async()=>{
        setIsSubmit(true)
        const formData = new FormData()
        formData.append("_method","PUT")
        // if(isSelectedAllServices){
        //     formData.append("panel_id",selectedPanel.id)
        // }else
        // {
            if(servicesSelected.length>0){
                servicesSelected.forEach((e,i)=>{
                    formData.append(`ads_ids[${i}]`,e)
                })
            }
        // }
        formData.append("service_id",id)
        formData.append("payment_period_id",period.id)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.services.request,
            method:'POST',
            body:formData,
            hasToken: true,
        })
        if(response){
            console.log(response);
            // confirm(response.data.id, "1")
            setIsSubmit(false)
            setErrorStatus({msg: response.message, open : true,type:"success"})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false,type:""})
            },3000)
            dispatch(callStatus({isCall : true}))
        }else{
            console.log(message);
             setIsSubmit(false)
            setErrorStatus({msg: message, open : true})  
        }
    } 

    const confirm = async(id,payment)=>{
        setIsSubmit(true)
        const formData = new FormData()
        formData.append("service_request_id",id)
        formData.append("payment_id",period.id)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.services.confirm,
            method:'POST',
            body:formData,
            hasToken: true,
        })
        if(response){
            console.log(response);
            setIsSubmit(false)
            setErrorStatus({msg: response.message, open : true,type:"success"})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false,type:""})
            },3000)
            dispatch(callStatus({isCall : true}))
        }else{
            console.log(message);
             setIsSubmit(false)
            setErrorStatus({msg: message, open : true})  
        }
    } 
    const [ selectedPanel , setSelectedPanel ] = useState({})
    const [ servicesSelected, setServicesSelected ] = useState([])
    const [ services, setServices ] = useState([])
    const [subLoading, setSubLoading ] = useState(false)
    const [ isSelectedAllServices, setIsSelectedAllServices ] = useState(false)
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)

    const getServices = async (page=1,search) => {
        
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setSubLoading(true)
        setServices([])
        const dataToSend = {page}
        
        dataToSend.panel_id = panel_id
        
        if(search) dataToSend.keywords = search
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel_services.list,
            method : "GET",
            params : dataToSend,
            signal: controller.signal,
            hasToken : true
        })
        if(response){
            setServices(response.data)
            setSubLoading(false)
            setLastPage(response.meta.last_page)
        }else{
            console.log(message);  
        }
    }

    return(<div className="ads-services with-services px-2 lg:px-16  flex flex-col gap-5">
        <div>
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={`/our-services/${slug}/${id}`}> {service?.translations?.[i18n.language]?.name}</Link> / <div> Services</div>
            </div>
            <h2>{service?.translations?.[i18n.language]?.name}</h2>
            <p>{service?.translations?.[i18n.language]?.description}</p>
            
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10">
            <div className="col-span-4 lg:col-span-3">
                <div className="">
                    <div className="flex flex-col gap-2">
                            <div className=" flex justify-end" >
                                <button onClick={()=>navigate(`/our-services/${slug}/${id}`)} className="dark-btn"> &lt; Go Back &gt;</button>
                            </div>
                            <div  className="p-4 card" >
                                <div className="flex items-center gap-4 ">
                                    <div> <img style={{objectFit:"cover",borderRadius:"10px"}} className="w-30 h-20" src={selectedPanel?.photo} alt="panel" /> </div>
                                    <div>
                                        <h3><strong>{selectedPanel?.translations?.en?.name}</strong></h3>
                                        <span>Services : {selectedPanel?.services_count ?? 0}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                
                                <div className="flex gap-2">
                                <SearchInput  onWheel={(e) => e.target.blur()} type="number" placeholder={`Id service`} onChange={(res)=>{
                                    getServices(1,res)
                                }} />   
                                {/* <button onClick={()=>getServices(1,selectedPanel.id)} className="dark-btn" >Search</button> */}
                                </div>                                     
                                
                                
                                {
                                    subLoading?<Loading/>:services.length> 0 && services.map((e,idx)=>(<Service key={`Services_Our_Services_${e.translations?.en?.name ?? ""}_${idx}`} 
                                    name={e.translations?.en?.name ?? ""} 
                                    isForSelected = {true}
                                    selectedObject = {servicesSelected}
                                    isSelectedAll = { isSelectedAllServices}
                                    returnedId = {(res,type)=>{
                                        if(type == "select"){
                                            setServicesSelected(prev=>[...prev,res])
                                        }else{
                                            setServicesSelected(prev=> prev.filter(e=>e!=res))
                                            
                                        }
                                    }}
                                    id={e.id}
                                    category={e.category_translations?.en?.name ?? ""}
                                    panel={e.panel_translations?.en?.name ?? ""}
                                    max={e.max}
                                    min={e.min}
                                    price={e.price}
                                    per_count={e.per_count}
                                    isPinned = {false}
                                    />))
                                }
                                <Pagination currentPage={currentPage} lastPage={lastPage} returnedPageNumber={(res)=>{
                                    setCurrentPage(res)
                                    getServices(res,selectedPanel.id)
                                }}/>
                            </div>
                            

                        </div>
                    
                </div>
            </div>
            <div className="col-span-4 lg:col-span-1  relative">
                    <div className=" sticky top-30 flex flex-col xs:flex-row lg:flex-col gap-4">
                    <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                        <h4 onClick={()=>{
                            console.log(services);
                            
                        }}>Our Pricing Plans</h4>
                        {
                            "prices" in service && <Prices basicPrice={basicPrice} prices={service?.prices}/>
                        }
                        
                    </div>
                    <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                        <h4>Choose Your Plan Duration</h4>
                        <Periods returnedSelected={(res)=>setPeriod(res)} price={basicPrice}/>
                    </div>
                    <div className="info-checkout w-full card p-4 flex flex-col gap-4">
                        <h4 >Invoice</h4>
                        <div> Total Services : <strong> {
                        isSelectedAllServices ?parseInt(selectedPanel.services_count) :  parseInt(servicesSelected.length)
                        }</strong> </div>
                        <div> Price per services : <strong>{basicPrice}</strong> </div>
                        
                        <div> Total price : <strong>{
                            isSelectedAllServices ? basicPrice * parseInt(selectedPanel.services_count) * period.factor * period.discount : (basicPrice * parseInt(servicesSelected.length) * period.factor * period.discount).toFixed(2)
                            }</strong> </div>
                        <div> 
                            <div className="py-2 error-container">
                                {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                                {errorStatus.open && errorStatus.type != "success"&& <div className="flex flex-col gap-1">
                                    <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>
                                    {errorStatus.msg == "NOT_ENOUGH_BALANCE" && <button onClick={()=>dispatch(changePopupBalance({
                                            type: "add",
                                            isOpen: true
                                        }))} className="dark-btn">Add funds</button>}
                                </div>}
                            </div>
                            <button disabled={isSubmit || (!isSelectedAllServices && servicesSelected.length === 0)
                            } onClick={submit} className="dark-btn w-full">
                                {isSubmit? <div className="loader m-auto"></div>:"Checkout"}
                            </button> 
                        </div>
                    </div>
                </div>
            </div>
        </div> 


    </div>)
}
export default AddWithServicesNextStep