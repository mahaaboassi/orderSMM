import { apiRoutes } from "../../../../functionality/apiRoutes";
import { Helper } from "../../../../functionality/helper";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FileUpload from "../../../../components/fileUpload";
import Periods from "../../../../components/periods";
import { callStatus } from "../../../../features/callNotification";
import { useDispatch } from "react-redux";
import GetPanels from "./getPanels";
import { changePopupBalance } from "../../../../features/popupBalanceSlice";
import PromotionSelect from '../../../../components/promotionSelect';
import Prices from "../../../../components/prices";
import Dropdown from "../../../../components/DropDownComponent";
import { changePopup } from "../../../../features/popupSlice";


const Promotion = ({slug,isPromotion})=>{
    const {t,i18n} = useTranslation()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // Track selected panel
    const [selectedPanel, setSelectedPanel] = useState(null)
    useEffect(()=>{
        if(!localStorage.getItem("user")){
            navigate("/auth/signIn",{
                state: { message: "Please sign in to continue." },
            })
        }
    },[])
    const [isSubmit, setIsSubmit] = useState(false)
    const [file, setFile] = useState("")
    const [ messageForm, setMessage] = useState("")
    const [ valuesSelected, setValuesSelected] = useState({})
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const [ period, setPeriod] = useState({})
    const [ periodPlans, setPeriodPlans] = useState([])
    
    useEffect(()=>{
        if(slug?.prices){
            const max = Math.max(...slug.prices.map(item => item.price));
            const value = slug?.prices.find(e=>e.price == max)
            setValuesSelected({
                ...value,
                label: value.name,
                value: value.id
            })
        }
    },[slug])

    const submit = async()=>{

        if(!messageForm){
            setErrorStatus({msg: "Message is required!", open : true})
            return
        }
        if(!selectedPanel){
            setErrorStatus({msg: "Select Panel!", open : true})
            return
        }
        setIsSubmit(true)
        const formData = new FormData()
        formData.append("_method","PUT")
        formData.append("service_id",slug.id)
        formData.append("description",messageForm)
        formData.append(`panels[0][id]`,selectedPanel)
        if( file &&  "name" in file ) formData.append("file",file)
        if(isPromotion) formData.append("payment_period_id",period.id)
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

    return(<div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10 '>
            <div className="relative">
                <div className="flex flex-col gap-3 sticky top-25">
                    <form className="card p-4 flex flex-col gap-1" >
                        <label>Message</label>
                        <textarea onChange={(e)=>{
                            setErrorStatus({msg: "", open : false})
                            setMessage(e.target.value)}} placeholder="Message" />
                    </form>
                    <div className="card p-4 flex flex-col gap-1">
                        <label>Upload File</label>
                        <FileUpload fromApi={""} returnedFile={(res)=>setFile(res)} />
                    </div>

                </div>

            </div>
            <div className="md:hidden block">
                <GetPanels returnedPanelId={(res)=>{
                    setErrorStatus({msg: "", open : false})
                    setSelectedPanel(res)}}/>
            </div>
            <div className=" relative">
                 <div className="sticky top-20 flex flex-col gap-3">
                    <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                        <h4>Our Pricing Plans</h4>
                        <Prices type="promotion"  prices={slug?.prices}/>
                    </div>
                    {isPromotion && <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                        <h4>Our Plan Duration</h4>
                        <Periods returnPlans={(res)=>{
                            setPeriodPlans(res)
                            setPeriod({...res[res.length-1],
                                    label: res[res.length-1]?.translations?.[i18n.language].name,
                                    value: res[res.length-1].id
                                })
                        }} price={valuesSelected.price}/>
                    </div>}
                    <div className="card p-4 flex flex-col gap-4">
                        <div>
                            <h4 >Select service</h4>
                            <Dropdown 
                                data={slug?.prices.map(e=>({
                                ...e,
                                label: e.name,
                                value: e.id
                                }))} count={true} defaultOption={valuesSelected}  
                                selected={Object.keys(valuesSelected).length>0 ? valuesSelected : null}
                                returnedOption={(res)=>{setValuesSelected(res)}}
                                />
                        </div>
                        {isPromotion && <div className="opacity-20"> <hr/></div>}
                        {isPromotion && <div>
                            <h4>Choose period plan:</h4>
                            { periodPlans.length > 0 && <Dropdown 
                                data={periodPlans.map(e=>({
                                ...e,
                                label: e?.translations?.[i18n.language].name,
                                value: e.id
                                }))} 
                                count={true} 
                                defaultOption={period} 
                                selected={Object.keys(period).length > 0 ? period : null}
                                returnedOption={(res)=>{setPeriod(res)}} 
                             />}
                        </div>}
                        
                    </div>
                    <div className="info-checkout w-full card p-4 flex flex-col gap-4 ">
                        <h4>Invoice</h4>
                        <div > Total price : <strong>{isPromotion ? ((valuesSelected?.price ?? 0) * (parseFloat(period?.factor)?? 0) * ((1-(parseFloat(period?.discount ?? 0)*0.01))?? 0) * ((1-(parseFloat(valuesSelected?.discount??0)*0.01))?? 0)).toFixed(2).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')
                                                                    : ((valuesSelected?.price ?? 0)* ((1-(parseFloat(valuesSelected?.discount ?? 0)*0.01)) ?? 0)).toFixed(2).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}</strong> </div>
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
                            <button disabled={isSubmit} onClick={submit} className="dark-btn w-full">
                                {isSubmit? <div className="loader m-auto"></div>:"Checkout"}
                            </button> 
                        </div>
                    </div>
                 </div>
            </div>
        </div>
        <div className="hidden md:block">
            <GetPanels returnedPanelId={(res)=>{
                setErrorStatus({msg: "", open : false})
                setSelectedPanel(res)}}/>
        </div>
            
    </div>)
}
export default Promotion
