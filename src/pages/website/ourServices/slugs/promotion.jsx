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


const Promotion = ({slug,isPromotion})=>{

    const {t} = useTranslation()
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
    const [basicPrice, setBasicPrice] = useState(0)
    
    useEffect(()=>{
        if(slug?.prices){
            const max = Math.max(...slug.prices.map(item => item.price));
            setBasicPrice(parseFloat(max));
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
        // formData.append("count","500")
        // formData.append("interval","15h")
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
        }else{
            console.log(message);
            setIsSubmit(false)
            setErrorStatus({msg: message, open : true})
            
        }
    } 

    return(<div className='flex flex-col gap-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-10'>
            <div className="flex flex-col gap-3">
                <div className="card p-4 flex flex-col gap-4">
                    <h4>Select</h4>
                    <PromotionSelect returnedSelected={(res)=>{setValuesSelected(res)}} prices={slug?.prices} />
                </div>
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
            <div className="md:hidden block">
                <GetPanels returnedPanelId={(res)=>{
                    setErrorStatus({msg: "", open : false})
                    setSelectedPanel(res)}}/>
            </div> 
            <div className=" relative">
                 <div className="sticky top-20 flex flex-col gap-3">
                    {isPromotion && <div className="info-checkout w-full  card p-4 flex flex-col gap-4">
                        <h4>Choose Your Plan Duration</h4>
                        <Periods returnedSelected={(res)=>setPeriod(res)} price={valuesSelected.price}/>
                    </div>}
                    <div className="info-checkout w-full card p-4 flex flex-col gap-4 ">
                        <h4>Invoice</h4>
                        <div > Total price : <strong>{isPromotion ? ((valuesSelected?.price ?? 0) * (parseFloat(period?.factor)?? 0) * ((1-(parseFloat(period?.discount)*0.01))?? 0)).toFixed(2): (valuesSelected?.price ?? 0)}</strong> </div>
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
