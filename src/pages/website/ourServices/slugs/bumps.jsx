import { useEffect, useState, useRef } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Periods from "../../../../components/periods"
import Prices from "../../../../components/prices"
import Dropdown from "../../../../components/DropDownComponent" 
import Pagination from "../../../../components/pagination"
import { useDispatch } from "react-redux"
import { callStatus } from "../../../../features/callNotification"
import { changePopupBalance } from "../../../../features/popupBalanceSlice"
import { triggerBalance } from "../../../../features/balance"
import { changePopup } from "../../../../features/popupSlice"

const Bumps = ({id, slug})=>{
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const [ isSubmit, setIsSubmit ] = useState(false)
    const { t,i18n } = useTranslation()
    const dispatch = useDispatch()
    const [ panels, setPanels ] = useState([])
    const abortControllerRef = useRef(null)
    // For Pagination
    const [ currentPage, setCurrentPage ] = useState(1)
    const [ lastPage , setLastPage ] = useState(1)
     const intervalInfo = [{
                            label:"30 miuntes",
                            value : "30m"
                        },{
                            label : "a hour",
                            value : "1h"
                        },{
                            label :"6 hours",
                            value : "6h"
                        },{
                            label :"12 hours",
                            value : "12h"
                        },{
                            label :"Day",
                            value : "24h"
                        }]
    const [ selectedOptions, setSelectedOptions] = useState({
        interval :  {},
        count : {}
    })
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
   
    const [basicPrice, setBasicPrice] = useState(0)
    useEffect(()=>{
        if(slug?.prices){
            const maxPriceObj = slug.prices.reduce((max, item) =>
            item.price*item.max > max.price*max.max ? item : max
            , slug.prices[0]);
            const max = maxPriceObj.price;
            setBasicPrice(parseFloat(max));
            setSelectedOptions({
                interval: intervalInfo[0],
                count : {
                ...maxPriceObj,
                label : JSON.stringify(maxPriceObj.max),
                value : maxPriceObj.max
            }
            })
        }
    },[slug])
    useEffect(()=>{getData()},[])
    const getData = async (page=1,search)=>{
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setIsLoading(true)
        let params = {page, approved:1}
        if(search) params.keywords = search
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
            signal : controller.signal,
            params: params,
            method : "GET",
            hasToken : true
        })
        if(response){setData(response.data.map((ele) => {
                const match = panels.find((p) => p === ele.id);
                return match
                    ? { ...ele, active: true }
                    : ele;
            }));
            
            setIsLoading(false)
            setLastPage(response.meta.last_page)
            
        }else{
            console.log(message);
        }
    }
    const handleChecked = ( value , panel)=>{
        if(value){
            setPanels(prev=> [...prev, panel])
            setData(data.map( e => e.id == panel ? {...e,
                active : true} : e))
        }else{
            setPanels(prev=>(prev.filter((e)=> e != panel)))
            setData(data.map( e => e.id == panel ? {...e,
                active : false} : e))
        }
    }
    const submit = async()=>{
        setIsSubmit(true)
        const formData = new FormData()
        formData.append("_method","PUT")
        formData.append("service_id",id)
        panels.forEach((e,i)=>{
            formData.append(`panel_ids[${i}]`,e)
        })
        formData.append("count",selectedOptions.count.value)
        formData.append("interval",selectedOptions.interval.value)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.services.request,
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
            dispatch(triggerBalance({count: Math.random()*100}))
            dispatch(changePopup({isOpen:true, type:3}))
        }else{
            console.log(message);
            setIsSubmit(false)
            if(message == "NOT_ENOUGH_BALANCE"){
                dispatch(changePopup({isOpen:true, type:4}))
            }else{
                dispatch(changePopup({isOpen:true, type:5}))
            }
            
            
        }
    } 
    return(<div className="ads-services">
        { <div className="">
            
            <div>
                <div className=" bg-zinc-200 flex flex-col gap-3 mb-4 p-2" >
                    <div className="link"> &lt; Choose Panel What you Want &gt;</div>
                    <div>
                        <input onChange={(e)=>getData(1,e.target.value)} className="px-2 py-1" placeholder="Search Panel" />
                    </div>
                </div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10">
                <div className="col-span-4 lg:col-span-3">
                    {isloading ? <Loading/>: <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                        { data.length > 0 &&  data.map((e,idx)=>(<div className="card-panel-user card"  key={`Panels_User_${idx}`}>
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
                                        <input checked={e.active} onChange={(ele)=>{handleChecked(ele.target.checked, e.id)}} type="checkbox"/>
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
                <div className="col-span-4 lg:col-span-1  relative">
                        <div className=" sticky top-30 flex flex-col xs:flex-row lg:flex-col gap-4">
                        <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                            <h4>Our Pricing Plans</h4>
                            <Prices type="bumps" prices={slug?.prices}  basicPrice={basicPrice}/>
                        </div>
                        <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                            <div>
                                <h4>Choose Count of Bumps</h4>
                                <Dropdown 
                                    defaultOption={selectedOptions.count} 
                                    count={true} 
                                    selected={selectedOptions.count ? selectedOptions.count : null}
                                    returnedOption={(res)=>{
                                    setSelectedOptions(prev=>({...prev,count:res}))}} 
                                    data={slug?.prices.map(e=>({
                                        ...e,
                                        label: e.max,
                                        value : e.max,
                                    }))}
                                 />
                            </div>
                            <div className="opacity-20"> <hr/></div>
                            <div>
                                <h4>Choose Bump Interval:</h4>
                                <Dropdown  
                                    count={true} 
                                    defaultOption={selectedOptions.interval} 
                                    selected={selectedOptions.interval? selectedOptions.interval : null}
                                    returnedOption={(res)=>{setSelectedOptions(prev=>({...prev,interval:res}))}} 
                                    data={intervalInfo} />
                            </div>

                        </div>
                        <div className="info-checkout w-full card p-4 flex flex-col gap-4">
                            <h4 >Invoice</h4>
                            <div> Total Panels : <strong> {panels.length}</strong> </div>
                            <div> Total Bumps : <strong> {selectedOptions.count.max}</strong> </div>
                            <div> Price per bump : <strong>{selectedOptions.count.price}</strong> </div>
                            
                            <div> Total price : <strong>{selectedOptions.count.price*selectedOptions.count.max * parseInt(panels.length)}</strong> </div>
                            <div> 
                                <div className="py-2 error-container">
                                    {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                                    {errorStatus.open && errorStatus.type != "success"&& <div className="flex flex-col gap-1">
                                        <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>
                                    </div>}
                                
                                </div>
                                <button disabled={isSubmit || panels.length==0} onClick={submit} className="dark-btn w-full">
                                    {isSubmit? <div className="loader m-auto"></div>:"Checkout"}
                                </button> 
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
            </div>
        </div>}

    </div>)
}
export default Bumps