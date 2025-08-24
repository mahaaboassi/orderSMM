import { useEffect, useState } from "react"
import { Helper } from "../../../../functionality/helper"
import { apiRoutes } from "../../../../functionality/apiRoutes"
import Loading from "../../../../components/loading"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Periods from "../../../../components/periods"
import Prices from "../../../../components/prices"

const AddWithoutServices = ({id, slug})=>{
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const [ isSubmit, setIsSubmit ] = useState(false)
    const { t,i18n } = useTranslation()
    const [ panels, setPanels ] = useState([])
    const [ period, setPeriod] = useState({})
    const [basicPrice, setBasicPrice] = useState(0)
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
    useEffect(()=>{
        const abortController = new AbortController()
        const signal  = abortController.signal
        getData(signal)
        setIsLoading(true)
        return () => abortController.abort() 
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.panel.list,
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
    const handleChecked = ( value , panel)=>{
        if(value){
            setPanels(prev=> [...prev, panel])
        }else{
            setPanels(prev=>(prev.filter((e)=> e != panel)))
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
        }else{
            console.log(message);
             setIsSubmit(false)
            setErrorStatus({msg: message, open : true})
            
        }
    } 
    return(<div className="ads-services">
        { isloading ? <Loading/>:<div className="">
            { 
                data.length > 0 && <div>
                   <div className=" bg-zinc-200 flex mb-4 p-2" >
                        <div className="link"> &lt; Choose Panel What you Want &gt;</div>
                    </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 lg:gap-10">
                    <div className="col-span-4 lg:col-span-3">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-5">
                            {data.map((e,idx)=>(<div className="card-panel-user card"  key={`Panels_User_${idx}`}>
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
                                            <input onChange={(ele)=>{handleChecked(ele.target.checked, e.id)}} type="checkbox"/>
                                            {t("Choose")}
                                        </div>
                                    </div>
                                </div>
                            </div>))}
                            
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
                                <div> Total Panels : <strong> {panels.length}</strong> </div>
                                <div> Price per  {slug?.slug == "ads"? "ads":(slug?.slug == "pin_up" || slug?.slug == "pin_down" ?"service":(slug?.slug == "best_providers"? "panel":""))} : <strong>{basicPrice}</strong> </div>
                                
                                <div > Total price : <strong>{basicPrice * parseInt(panels.length) * period.factor * period.discount}</strong> </div>
                                <div> 
                                    <div className="py-2">
                                        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                                        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
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

        </div>}

    </div>)
}
export default AddWithoutServices