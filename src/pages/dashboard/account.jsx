import { useTranslation } from "react-i18next"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../functionality/apiRoutes";
import { Helper } from "../../functionality/helper";
import { useEffect, useState } from "react";


const Account  = ()=>{
    const {t} = useTranslation()
    const user = JSON.parse(localStorage.getItem("user"))
    const validationSchema = Yup.object({
        telegram: Yup.string(),
        whatsapp: Yup.string(), 
        name: Yup.string().required(t("auth.name-validation")), 
        website: Yup.string()
            .notRequired()
            .test("empty-or-valid", t("auth.invalid-website-url"), value => {
                return !value || /\.[a-z]{2,}$/.test(value);
            })
    });
    const { register, handleSubmit, reset, formState: { errors },watch } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ codewhatsapp, setCodeWhatsapp] = useState("")
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })

    useEffect(()=>{
        const abortController = new AbortController()
        const signal = abortController.signal
        getData(signal)
        return () => abortController.abort()
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.users.getOne(user?.id),
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            console.log(response);
            
            const data = {
                name: response.data.name || "",
                telegram: response.data.telegram|| "",
                whatsapp: response.data.whatsapp || "",
                website: response.data.website || "",
                email: response.data.email || "",
                instagram : response.data.instagram || "",
            };
            reset(data);
            
        }else{
            console.log(message);
            
        }
    }
    const onSubmit = async (data) => {
        
        setErrorStatus({msg: "", open : false})
        setLoading(true)

        const values = new FormData()
        values.append("website",data.website)
        values.append("telegram",data.telegram)
        values.append("whatsapp", data.whatsapp)
        values.append("name",data.name)

        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.users.update(user?.id),
            method:'POST',
            body:values,
            hasToken: true,
        })
        if(response){
            window.scrollTo({top: 0})
            setLoading(false)
            setErrorStatus({msg: response.message, open : true,type : "success"})
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),3000)
            getData()
        }else{
            window.scrollTo({top: 0})
            console.log(message);
            setErrorStatus({msg: message, open : true})
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),3000)  
            setLoading(false)
            
        }
        
        
    };
    return(<div className="account flex flex-col gap-5">
        <div>
            <h2>Setting Account</h2>
            <p>Manage your account details and settings.</p>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-5">
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label>{t("auth.email")} :</label>
                    <p className="email-container flex items-center">{watch("email")}</p>
                </div>
                <div className="flex flex-col gap-1">
                    <label>Name:</label>
                    <input {...register("name")} type="text" placeholder={"Name"}  />
                    {errors.name && <p className="pt-0.5 text-error">{errors.name.message}</p>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label>Whatsapp :</label>
                    <input {...register("whatsapp")} type="text" placeholder={"Whatsapp"}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
                <div className="flex flex-col gap-1">
                    <label>Telegram :</label>
                    <input {...register("telegram")} type="text" placeholder={"Telegram"}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label>Website :</label>
                    <input {...register("website")} type="text" placeholder={"https://example.com"}  />
                    {errors.website && <p className="pt-0.5 text-error">{errors.website.message}</p>}
                </div>
            </div>
            <div className="">
                <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Update"}</button>
            </div>
            
            
        </form>
    </div>)
}
export default Account