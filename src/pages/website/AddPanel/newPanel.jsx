import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import UploadFile from "../../../components/uploadFile"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import MobileInput from "../../../components/mobileInput";
import Countries from "../../../components/countries";


const validationSchema = Yup.object({
    title : Yup.string().required("Panel Title Field is required."),
    url_panel : Yup.string().required("URL Panel Field is required."),
    api_url : Yup.string(),
    api_key : Yup.string(),
    email: Yup.string().email("Invalid email").required("Email Field is required."),
    telegram: Yup.string().required("Telegram Field is required."),
    whatsapp: Yup.string().required("Whatsapp Field is required."), 
    country: Yup.string()
});

const NewPanel = ()=>{
    const {t} = useTranslation()
    const navigate = useNavigate()
    const [ country, setCountry ] = useState("")
    useEffect(()=>{
        if(!localStorage.getItem("user")){
            navigate("/auth/signIn",{
                state: { message: "Please sign in to continue." },
            })
        }
    },[])
    const { register, handleSubmit, formState: { errors },watch } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const [ codes, setCodes ] = useState({
        telegram : "",
        whatsapp : ""
    })
    const [ file, setFile ] = useState({})
    const onSubmit = async (data) => {
  
        setErrorStatus({msg: "", open : false})

        console.log(codes.whatsapp)
        
        
        setLoading(true) 
        const values = new FormData()
        values.append("name",data.title)
        values.append("website",data.url_panel)
        values.append("api_url",data.api_url)
        values.append("token",data.api_key)
        values.append("email",data.email)
        values.append("telegram",codes.telegram.dial_code + data.telegram)
        values.append("whatsapp",codes.whatsapp.dial_code + data.whatsapp)
        values.append("languages[1][name]",data.title)
        values.append("languages[2][name]",data.title)
        values.append("languages[3][name]",data.title)
        values.append("languages[4][name]",data.title)
        values.append("languages[5][name]",data.title)
        values.append("languages[6][name]",data.title)
        if(country) 
            {values.append("country",country)} 
        else{values.append("country",codes.whatsapp.name)}
            
        if("name" in file) values.append("file",file)
        values.append("_method","PUT")

        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.panel.add,
            method:'POST',
            body:values,
            hasToken: true,
        })
        if(response){
            setErrorStatus({msg: response.message, open : true, type:"success"})
            window.scrollTo({top : 0})
            setLoading(false)
        }else{
            console.log(message);
            window.scrollTo({top : 0})
            setErrorStatus({ msg:message, open : true})
            setLoading(false)
            
        }
        
        
    };
    return(<div className="px-2 lg:px-16 image-container">
        <form onSubmit={handleSubmit(onSubmit)} className="panel-card shadow p-4 sm:p-10 flex flex-col gap-3">
            <h2 className="text-center">Add new SMM Panel</h2>
            {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
            {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
            <div className="py-2">
                <hr/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Panel Information  */}
                <div className="flex flex-col gap-3">
                    <h3><strong>Panel Information</strong></h3>
                    <div className="flex flex-col gap-1">
                        <label>SMM Panel Title (Max 22 characters) :</label>
                        <input  {...register("title")} type="text" placeholder={"Panel Title"}  />
                        {errors.title && <p className="pt-0.5 text-error">{errors.title.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>SMM Panel URL :</label>
                        <input {...register("url_panel")} type="text" placeholder={"https://example.com"}  />
                        {errors.url_panel && <p className="pt-0.5 text-error">{errors.url_panel.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>API URL :</label>
                        <input {...register("api_url")} type="text" placeholder={"https://panel.com/api/v2"}  />
                        {errors.api_url && <p className="pt-0.5 text-error">{errors.api_url.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>API KEY:</label>
                        <input {...register("api_key")} type="text" placeholder={"123456789123456789"}  />
                        {errors.api_key && <p className="pt-0.5 text-error">{errors.api_key.message}</p>}
                    </div>
                    
                </div>
                {/* Contact Information  */}
                <div className="flex flex-col gap-3">
                    <h3><strong>Contact Information</strong></h3>
                    <div className="flex flex-col gap-1">
                        <label>Email:</label>
                        <input {...register("email")} type="text" placeholder={"Email"}  />
                        {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Whatsapp:</label>
                        <MobileInput returnedCountry={(res)=>{setCodes(prev=>({...prev,whatsapp:res}))}} register={register("whatsapp")}   />
                        {errors.whatsapp && <p className="pt-0.5 text-error">{errors.whatsapp.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Telegram:</label>
                        <MobileInput returnedCountry={(res)=>{setCodes(prev=>({...prev,telegram:res}))}}  register={register("telegram")}   />
                        {errors.telegram && <p className="pt-0.5 text-error">{errors.telegram.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Country:</label>
                        <Countries returnedCountry={(res)=>setCountry(res)} isAddPanel={true}/>
                    </div>
                </div>
            </div>
            <div>
                <UploadFile returnedValue={(res)=>{setFile(res)}} />
            </div>
            <div>
                <button type="submit" className="dark-btn w-full">{loading ? <div className="loader m-auto" ></div> : "Create Panel"}</button>
            </div> 

        </form>
    </div>)
}
export default NewPanel