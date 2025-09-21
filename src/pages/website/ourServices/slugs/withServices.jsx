import { useEffect, useState, useRef } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Periods from "../../../../components/periods"
import Service from "../../../../components/cards/service"
import Pagination from "../../../../components/pagination"
import Prices from "../../../../components/prices"
import SearchInput from "../../../../components/search"

const AddWithServices = ({id, slug})=>{
    const [ data, setData ] = useState([])
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
            confirm(response.data.id)
        }else{
            console.log(message);
             setIsSubmit(false)
            setErrorStatus({msg: message, open : true})  
        }
    } 
    const confirm = async(id)=>{
        const data = {
            service_request_id: id,
            payment_id : "1"
        }
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.services.confirm,
            method:'POST',
            body: data,
            hasToken: true,
        })
        if(response){
            console.log(response);
            setIsSubmit(false)
            setErrorStatus({msg: response.message, open : true,type:"success"})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false,type:""})
            },3000)
        }else{
            console.log(message);
             setIsSubmit(false)
            setErrorStatus({msg: message, open : true})
            
        }
    } 
    // 0 the panels appear, 1 the interface (all services , or specific services with search  )
    const [ isSelectedPanel, setIsSelectedPanel ] = useState(0) 
    const [ selectedPanel , setSelectedPanel ] = useState({})
    const [ servicesSelected, setServicesSelected ] = useState([])
    const [ services, setServices ] = useState([])
    const [subLoading, setSubLoading ] = useState(false)
    const [ isSelectedAllServices, setIsSelectedAllServices ] = useState(false)
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
    const [ search , setSearch ] = useState("")

    const getServices = async (page=1,id,search) => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setSubLoading(true)
        setServices([])
        const dataToSend = { page}
        if(id){
            dataToSend.panel_id = id
        }else{
            dataToSend.panel_id = selectedPanel.id
        }
        if(search) dataToSend.id = search
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel_services.list,
            method : "GET",
            params : dataToSend,
            signal: controller.signal,
            hasToken : true
        })
        if(response){
            setServices(response)
            setSubLoading(false)
            setLastPage(response.meta.last_page)
        }else{
            console.log(message);  
        }
    }
    const reset = ()=>{
        setIsSelectedPanel(0)
        setSelectedPanel({})
        setServicesSelected([])
    }
    const handleChange = (e)=>{
        if(e.target.checked){
            setIsSelectedAllServices(true)
        }else{
            setIsSelectedAllServices(false)
        }
    }
    return(<div className="ads-services with-services">
        <div className="">
            { 
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10">
                    <div className="col-span-4 lg:col-span-3">
                        <div className="">
                            {
                                isSelectedPanel == 0 ? <div>
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
                                                onClick={()=>{
                                                    setSelectedPanel(e)
                                                    setIsSelectedPanel(1)
                                                    getServices(1,e.id)
                                                }}
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


                                </div>:
                            (
                                <div className="flex flex-col gap-2">
                                    <div className=" bg-zinc-200 flex mb-4 p-2" >
                                        <div onClick={reset} className="cursor-pointer link"> &lt; Previous Step &gt;</div>
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
                                        <SearchInput type="number" placeholder={`Id service`} onChange={(res)=>{
                                            getServices(1,selectedPanel.id,res)
                                            setSearch(res)
                                        }}  onEnter={()=>{getServices(1)}}/>   
                                        {/* <button onClick={()=>getServices(1,selectedPanel.id)} className="dark-btn" >Search</button> */}
                                        </div>                                     
                                        
                                        {/* <div className="card flex justify-between p-4">
                                            <div>
                                                All Services nn
                                            </div>
                                            <div>
                                                <input checked={isSelectedAllServices} onChange={handleChange} type="checkbox" />
                                            </div>
                                        </div> */}
                                        
                                        {
                                            subLoading?<Loading/>:services.data.map((e,idx)=>(<Service key={`Services_Our_Services_${e.translations?.en?.name ?? ""}_${idx}`} 
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
                            )
                            }
                            
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
                                <div> Total Services : <strong> {
                                isSelectedAllServices ?parseInt(selectedPanel.services_count) :  parseInt(servicesSelected.length)
                                }</strong> </div>
                                <div> Price per services : <strong>{basicPrice}</strong> </div>
                                
                                <div> Total price : <strong>{
                                    isSelectedAllServices ? basicPrice * parseInt(selectedPanel.services_count) * period.factor * period.discount : (basicPrice * parseInt(servicesSelected.length) * period.factor * period.discount).toFixed(2)
                                    }</strong> </div>
                                <div> 
                                    <div className="py-2">
                                        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                                        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
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
            }

        </div>

    </div>)
}
export default AddWithServices