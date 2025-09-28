import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import FileUpload from "../../../components/fileUpload";
import SwitchComponent from "../../../components/switchComponent";
import Dropdown from "../../../components/DropDownComponent";
import Loading from "../../../components/loading";



const AddBalance = ({close})=>{
    const { t } = useTranslation()
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ data, setData ] = useState({})
    const [ methods, setMethods ] = useState([])
    const [ currencies, setCurrencies ] =  useState([])
    const [ values, setValues ] = useState({
        amount : "",
        method : "",
        currency : {}
    })
    const [ loading, setLoading ] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        setLoading(true)
        getCurrencies(signal)
        getMethods(signal)
        return () => controller.abort()
        
    },[])

    const getCurrencies = async (signal)=>{
        setCurrencies([])
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.currencies.list,
            method : "GET",
            signal : signal,
            hasToken: true,
            params : {
                results : 20
            }
        })
        if(response){
            console.log(response);
            setLoading(false)
            setCurrencies(response.data)    
        }else{
            console.log(message);
        }
    }
    const getMethods = async (signal)=>{
        setMethods([])
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.payment_methods.list,
            method : "GET",
            signal : signal,
            hasToken: true,
            params : {
                results : 20
            }
        })
        if(response){
            console.log(response);
            setLoading(false)
            setMethods(response.data)    
        }else{
            console.log(message);
        }
    }
    const submit = async()=>{
        if(!values.amount){
            setErrorStatus({msg: "Amount is required!", open : true})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false})
            },2000)
            return
        }
        if(Object.keys(values.currency) == 0){
            setErrorStatus({msg: "Select Currency please!", open : true})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false})
            },2000)
            return
        }
        if(!values.method){
            setErrorStatus({msg: "Select Payment Method please!", open : true})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false})
            },2000)
            return
        }
        
        
        setIsSubmit(true)
        const formData = new FormData()
        formData.append("payment_method_id",values.method)
        formData.append("currency",values.currency.id)
        formData.append("amount",values.amount)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.wallet.charge,
            method:'POST',
            body:formData,
            hasToken: true,
        })
        if(response){
            console.log(response);
            setIsSubmit(false)
            window.location.href = response.data
            // setErrorStatus({msg: response.message, open : true,type:"success"})
            // setTimeout(()=>{
            //     setErrorStatus({msg: "", open : false,type:""})
            // },3000)
        }else{
            console.log(message);
            setIsSubmit(false)
            setErrorStatus({msg: message, open : true})
            
        }
    } 

    return(<div className='popup'>
        <div className="flex flex-col gap-5 content-popup p-4 ">
            <div className="flex justify-between">
                <h2>Add Balance </h2>
                <div className="cursor-pointer" onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_17_1174)">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#19770D"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_17_1174">
                        <rect width="24" height="24" fill="#19770D"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {loading ? <Loading/>: <form className=" flex flex-col gap-4" >
                    <div>
                        <label><strong>Currency</strong></label>
                        <p>Factor is : {values.currency?.exchange_factor ?? "0"}</p>
                        <Dropdown  data={currencies.map((e)=>({label:e.name,value:e.id}))}
                            defaultOption={{label: "Select",value: "0"}}
                            selected={Object.keys(values.currency).length > 0 ? {label:values.currency.name,value:values.currency.id} : null}
                            returnedOption={(res)=>{
                                console.log(res);
                                setValues(prev=>({...prev,currency:currencies.find(e=> e.id == res.value)}))
                            }} />
                    </div>
                    <div>
                        <label><strong>Amount</strong></label>
                        <div>
                            <input placeholder="Amount" type="number" onChange={(e)=>setValues(prev=>({...prev,amount:e.target.value}))} />
                        </div>
                    </div>
                    <div>
                        <label><strong>Select Method</strong></label>
                        <div>
                            {methods.map((e)=>{
                                if(e.name == "Cryptomous"){
                                    return (<div className={`${values.method == e.id ? "border":""} w-fit p-1 rounded cursor-pointer`} onClick={()=>setValues(prev=>({...prev,method:e.id}))}>
                                        <svg width="35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 36" class="header-logo_logo__icon__abhXd"><path d="M30.611 8.507 16.935.61a2.01 2.01 0 0 0-2.005 0L1.254 8.507A2.01 2.01 0 0 0 .25 10.245v15.791c0 .713.384 1.378 1.004 1.738L14.93 35.67a2.034 2.034 0 0 0 2.008 0l13.677-7.896a2.01 2.01 0 0 0 1.004-1.738V10.245c0-.713-.385-1.378-1.004-1.738zM16.242 17.16a.62.62 0 0 1-.62 0L2.328 9.487l13.296-7.675a.64.64 0 0 1 .62 0l13.295 7.675zm-1.312 1.197q.146.084.312.142v15.743l-13.296-7.67a.62.62 0 0 1-.311-.537V10.684z"></path></svg>
                                    </div>)
                                }
                            })}
                            
                        </div>
                        
                    </div>
                </form>}
            </div>
            <div> 
                <div className="py-2">
                    {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                    {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                </div>
                <button disabled={isSubmit} onClick={submit} className="dark-btn w-full">
                    {isSubmit? <div className="loader m-auto"></div>:"Submit"}
                </button> 
            </div>
        </div>
            
    </div>)
}
export default AddBalance