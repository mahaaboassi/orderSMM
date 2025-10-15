import { useEffect, useRef, useState } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Periods from "../../../../components/periods"
import Prices from "../../../../components/prices"
import Pagination from "../../../../components/pagination"
import { callStatus } from "../../../../features/callNotification"
import { useDispatch } from "react-redux"
import { changePopupBalance } from "../../../../features/popupBalanceSlice"


const CustomImage = ({returnedFile,e,removeItem,memoryPhoto})=>{
    const inputRef = useRef()
    const [ photo, setPhoto ] = useState("")
    
    useEffect(()=> setPhoto( memoryPhoto ? URL.createObjectURL(memoryPhoto) : ""),[])
    return <div>
        <div className="flex items-center gap-2">
            <svg className="image-icon" xmlns="http://www.w3.org/2000/svg" width="43" height="40" viewBox="0 0 23 20" fill="none">
                <g clipPath="url(#clip0_313_669)">
                <path d="M2.23172 0H17.3834C17.9966 0 18.5541 0.243871 18.957 0.631729L18.9943 0.671077C19.3775 1.05764 19.6147 1.58127 19.6147 2.14857V8.31496C18.9934 8.14373 18.3376 8.0512 17.6592 8.0512C17.3336 8.0512 17.0133 8.07282 16.6993 8.11389L18.4139 6.57803V2.14857C18.4139 1.8913 18.3079 1.65175 18.1354 1.47317L18.1085 1.44896C17.9216 1.26908 17.6642 1.15536 17.3834 1.15536H2.23172C1.95994 1.15536 1.71287 1.25697 1.53004 1.42085L1.50398 1.44766C1.31711 1.62753 1.20031 1.87616 1.20031 2.14857V9.84218C2.5291 8.68898 4.65615 7.07701 5.99887 5.9904C6.21809 5.80793 6.54422 5.81182 6.75939 5.98867C6.80297 6.0237 6.83531 6.06607 6.8717 6.10758L10.0001 10.6745L11.1182 7.39871C11.2076 6.94124 11.7691 6.78947 12.1091 7.09344L14.1311 8.95706C13.7816 9.15078 13.4519 9.37303 13.1432 9.61949L12.1024 8.65785L10.9614 12.0643C10.8895 12.5464 10.2678 12.7293 9.93178 12.3574L6.3259 7.24045L1.20031 11.3776V14.8229C1.20031 15.0936 1.31846 15.3414 1.50533 15.5213C1.69355 15.7029 1.95275 15.8161 2.23172 15.8161H10.6564C10.7143 16.2131 10.8078 16.5992 10.934 16.9715H2.23172C1.62168 16.9715 1.06195 16.7285 0.656309 16.3385C0.253359 15.9502 0 15.4132 0 14.8229V2.14857C0 1.55749 0.251113 1.01959 0.654961 0.630432L0.696289 0.594543C1.09834 0.227007 1.6392 0 2.23172 0ZM17.6592 9.71808C19.134 9.71808 20.4696 10.2936 21.4354 11.2237C22.4021 12.1542 23 13.4393 23 14.8588C23 16.2784 22.4021 17.5643 21.4358 18.494C20.4696 19.4245 19.134 20 17.6592 20C16.1849 20 14.8494 19.4245 13.8827 18.494C12.9164 17.5643 12.3185 16.2784 12.3185 14.8588C12.3185 13.4406 12.9164 12.1564 13.8827 11.2258C14.8516 10.2936 16.1858 9.71808 17.6592 9.71808ZM17.2743 12.5762H18.0451C18.2275 12.5762 18.3771 12.7219 18.3771 12.8953V14.1692H19.6996C19.882 14.1692 20.0316 14.3162 20.0316 14.4887V15.2303C20.0316 15.4041 19.8802 15.5502 19.6996 15.5502H18.3771V16.8232C18.3771 16.997 18.2257 17.1427 18.0451 17.1427H17.2743C17.0937 17.1427 16.9423 16.9992 16.9423 16.8232V15.5502H15.6184C15.4379 15.5502 15.2865 15.4062 15.2865 15.2303V14.4887C15.2865 14.3127 15.4356 14.1692 15.6184 14.1692H16.9423V12.8953C16.9423 12.7198 17.0914 12.5762 17.2743 12.5762ZM20.7063 11.9255C19.9273 11.1757 18.8492 10.7109 17.6592 10.7109C16.4688 10.7109 15.3907 11.1748 14.6108 11.9246C13.8319 12.6748 13.3499 13.713 13.3499 14.8588C13.3499 16.0042 13.8328 17.0424 14.6117 17.7922C15.3916 18.5428 16.4697 19.0072 17.6592 19.0072C18.8492 19.0072 19.9273 18.5428 20.7067 17.7922C21.4861 17.0424 21.9686 16.0042 21.9686 14.8588C21.9686 13.7138 21.4861 12.6761 20.7063 11.9255ZM12.0346 2.64366C12.5305 2.64366 12.9806 2.83738 13.3063 3.15086C13.632 3.46435 13.8332 3.89718 13.8332 4.37497C13.8332 4.8519 13.632 5.2856 13.3063 5.59908C12.9806 5.91257 12.5305 6.10628 12.0346 6.10628C11.5382 6.10628 11.0885 5.91257 10.7628 5.59908C10.4371 5.2856 10.2359 4.8519 10.2359 4.37497C10.2359 3.89718 10.4371 3.46435 10.7628 3.15086C11.0885 2.83738 11.5382 2.64366 12.0346 2.64366ZM12.5835 3.84659C12.4378 3.70663 12.2404 3.62809 12.0346 3.62823C11.8203 3.62823 11.6258 3.71211 11.4856 3.84659C11.3404 3.98685 11.2589 4.17691 11.2592 4.37497C11.2592 4.58123 11.3459 4.76845 11.4856 4.90336C11.6258 5.03783 11.8203 5.12172 12.0346 5.12172C12.2488 5.12172 12.4434 5.03783 12.5835 4.90336C12.7232 4.76845 12.8104 4.58123 12.8104 4.37497C12.8104 4.16872 12.7232 3.98149 12.5835 3.84659Z" fill="#737373"/>
                </g>
                <defs>
                <clipPath id="clip0_313_669">
                <rect width="23" height="20" fill="white"/>
                </clipPath>
                </defs>
            </svg>
            <p>Upload a custom photo to boost your ad.&nbsp;
                <strong onClick={()=>{inputRef.current.click()}} className="cursor-pointer">Add Photo</strong>
            </p>
            
            <input  accept="image/*"  onChange={(ele)=>{
                setPhoto(URL.createObjectURL(ele.target.files[0]))
                returnedFile(ele.target.files[0])}} ref={inputRef} className="hidden" type="file"/>
            {e?.file?.name}
        </div>
        {photo && <div className="flex items-center justify-between">
            <div><img style={{width: "40px",height:"40px",borderRadius:"50%",objectFit:"cover"}} src={photo} alt="img" /></div>
            <div className="cursor-pointer" onClick={()=>{
                setPhoto("")
                removeItem(e.id)
            }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_17_1174)">
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="red"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_17_1174">
                    <rect width="24" height="24" fill="red"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>
            
        </div>}
    </div>
}

const AddWithoutServices = ({id, slug, isAd})=>{
    const [ data, setData ] = useState([])
    const dispatch = useDispatch()
    const [isloading, setIsLoading ] = useState(false)
    const [ isSubmit, setIsSubmit ] = useState(false)
    const { t,i18n } = useTranslation()
    const [ panels, setPanels ] = useState([])
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
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    
    useEffect(()=>{getData()},[])
    const getData = async (page=1,search)=>{

        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setIsLoading(true)
        let params = {page}
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
            setData(response.data.map((ele) => {
                const match = panels.find((p) => p.id === ele.id);
                return match
                    ? { ...ele, customFile: match.file, active: true }
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
            setPanels(prev=> [...prev,{
                id :  panel,
                file : ""
            }])
            setData(data.map( e => e.id == panel ? {...e,
                customFile : "",
                active : true} : e))
        }else{
            setPanels(prev=>(prev.filter((e)=> e.id != panel)))
            setData(data.map( e => e.id == panel ? {...e,
                customFile : "",
                active : false} : e))
        }
    }
    const changeFile = (value, panel) => {
        setPanels(panels.map(e => e.id === panel ? { ...e, file: value } : e)); 
        setData(data.map( e => e.id == panel ? {...e,
                customFile : value} : e)) 
    }
    const removeCustomPhoto = (panel)=>{
        setPanels(panels.map(e => e.id === panel ? { ...e, file: "" } : e));
        setData(data.map( e => e.id == panel ? {...e,
                customFile : ""} : e)) 
    }
    const submit = async()=>{
        setIsSubmit(true)
        const formData = new FormData()
        formData.append("_method","PUT")
        formData.append("service_id",id)
        panels.forEach((e,i)=>{
            formData.append(`panels[${i}][id]`,e.id)
        })
        if(isAd){
            panels.forEach((e,i)=>{
                if(e.file) formData.append(`panels[${i}][file]`,e.file)
            }) 
        }
        // formData.append("count","500")
        // formData.append("interval","15h")
        formData.append("payment_period_id",period.id)
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
        }else{
            console.log(message);
            setIsSubmit(false)
            setErrorStatus({msg: message, open : true})
            
        }
    } 

    return(<div className="ads-services">
        <div className="">
            { 
               <div>
                   <div className=" bg-zinc-200 flex flex-col gap-3 mb-4 p-2" >
                        <div className="link"> &lt; Choose Panel What you Want &gt;</div>
                        <div>
                            <input onChange={(e)=>getData(1,e.target.value)} className="px-2 py-1" placeholder="Search Panel" />
                        </div>
                    </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10">
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
                                            <input checked={e?.active} onChange={(ele)=>{handleChecked(ele.target.checked, e.id)}} type="checkbox"/>
                                            {t("Choose")}
                                        </div>
                                        {isAd &&<div className={`${!e?.active ? "disabled-div" : "active-div"} p-1`}>
                                             <CustomImage memoryPhoto={e.customFile ?? ""} removeItem={(res)=>{
                                                        removeCustomPhoto(res)
                                                    }} returnedFile={(res)=>changeFile(res,e.id)} e={e} />
                                            </div>}
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
                                <Prices basicPrice={basicPrice} prices={slug?.prices}/>
                            </div>
                            <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                                <h4>Choose Your Plan Duration</h4>
                                <Periods returnedSelected={(res)=>setPeriod(res)} price={basicPrice}/>
                            </div>
                            <div className="info-checkout w-full card p-4 flex flex-col gap-4">
                                <h4 >Invoice</h4>
                                <div> Total Panels : <strong> {panels.length}</strong> </div>
                                <div> Price per  {slug?.slug == "ads"? "ads":(slug?.slug == "pin_up" || slug?.slug == "pin_down" ?"service":(slug?.slug == "best_providers"? "panel":""))} : <strong>{basicPrice}</strong> </div>
                                
                                <div > Total price : <strong>{(basicPrice * parseInt(panels.length) * (period?.factor ?? 0) * ((1-period?.discount*0.01) ?? 0)).toFixed(2)}</strong> </div>
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
                                    <button disabled={isSubmit || panels.length==0} onClick={submit} className="dark-btn w-full">
                                        {isSubmit? <div className="loader m-auto"></div>:"Checkout"}
                                    </button> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
                </div>
            }

        </div>

    </div>)
}
export default AddWithoutServices