import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";



const validationSchema = Yup.object({
    skybe : Yup.string(),
    telegram : Yup.string(),
    instagram : Yup.string(),
    tiktok : Yup.string(),
    whatsapp : Yup.string(),
    facebook : Yup.string(),
    panels : Yup.number().typeError("Panels must be a number"),
    services : Yup.number().typeError("Services must be a number"),
    platforms : Yup.number().typeError("Platforms must be a number"),
});


const Basic = ()=>{
    const [ loading, setLoading ] = useState(false)
    const [ submit, setSubmit ] = useState(false)
    const [ data, setData ] = useState([])
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const { register, handleSubmit, formState: { errors },reset } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });

    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        if(!localStorage.getItem("user")){
            navigate("/auth/signIn",{
                state: { message: "Please sign in to continue." },
            })
        }
        getData(signal)
        return () => controller.abort() 
    },[])
    const getData = async(signal) => {
        setData([])
        setLoading(true)
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.settings.list,
            method : "GET",
            signal : signal,
        })
        if(response){
            console.log(response);
            setData(response.data)
            setLoading(false)
            const temp = {}
            Object.keys(response.data).forEach(key => {
                temp[key] = response.data[key]
            });
            reset(temp); 
        }else{
            console.log(message);
        }
    }

    const onSubmit = async (data) => {
  
        setErrorStatus({msg: "", open : false})
        setSubmit(true) 
        const values = new FormData()
        values.append("tiktok",data.tiktok)
        values.append("skybe",data.skybe)
        values.append("instagram",data.instagram)
        values.append("whatsapp",data.whatsapp)
        values.append("facebook",data.facebook)
        values.append("telegram",data.telegram)
        values.append("panels",data.panels)
        values.append("platforms",data.platforms)
        values.append("services",data.services)

        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.settings.list,
            method:'POST',
            body:values,
            hasToken: true,
        })
        if(response){
            setErrorStatus({msg: "Successfully updated", open : true, type:"success"})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false, type:""})
            },2000)
            
            window.scrollTo({top : 0})
            setSubmit(false)
        }else{
            console.log(message);
            window.scrollTo({top : 0})
            setErrorStatus({ msg:message, open : true})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false, type:""})
            },2000)
            setSubmit(false)
            
        }
    };
    
    return (<div className="settings flex flex-col gap-1">        
        {loading ? <Loading/> : <div className="flex flex-col gap-4">
                <div>
                        <p>
                            <strong className="text-xl">Note:</strong>
                            &nbsp; The values you enter below will be added to the existing values.
                            <br/>Current values:
                        </p>
                        <div className="flex gap-5">
                            <p className="border-[1px] rounded-md p-1 border-[var(--green_2)]">Panals:<strong>{data.real_panels}</strong></p>
                            <p className="border-[1px] rounded-md p-1 border-[var(--green_2)]">Services: <strong>{data.real_services}</strong></p>
                            <p className="border-[1px] rounded-md p-1 border-[var(--green_2)]">Platforms:<strong>{data.real_platforms}</strong></p>
                        </div>
                    </div>
                <form onSubmit={handleSubmit(onSubmit)} className="panel-card shadow p-4 sm:p-10 flex flex-col gap-3 rounded">
                                        
                    {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                    {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                    <div className=" flex flex-col gap-5">
                        {/* Panel Information  */}
                        <div className="flex flex-col gap-2">
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label>Panels:</label>
                                    <input type="number"  {...register("panels")} placeholder={"Panels"}  />
                                    {errors.panels && <p className="pt-0.5 text-error">{errors.panels.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Platforms:</label>
                                    <input type="number"  {...register("platforms")}  placeholder={"Platforms"}  />
                                    {errors.platforms && <p className="pt-0.5 text-error">{errors.platforms.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Services:</label>
                                    <input type="number" {...register("services")}  placeholder={"Services"}  />
                                    {errors.services && <p className="pt-0.5 text-error">{errors.services.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Skybe:</label>
                                    <input  {...register("skybe")} type="text" placeholder={"Skybe"}  />
                                    {errors.skybe && <p className="pt-0.5 text-error">{errors.skybe.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Telegram:</label>
                                    <input {...register("telegram")} type="text" placeholder={"Telegram"}  />
                                    {errors.telegram && <p className="pt-0.5 text-error">{errors.telegram.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Instagram:</label>
                                    <input {...register("instagram")} type="text" placeholder={"Instagram"}  />
                                    {errors.instagram && <p className="pt-0.5 text-error">{errors.instagram.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Tiktok:</label>
                                    <input {...register("tiktok")} type="text" placeholder={"Tiktok"}  />
                                    {errors.tiktok && <p className="pt-0.5 text-error">{errors.tiktok.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Whatsapp:</label>
                                    <input {...register("whatsapp")} type="text" placeholder={"Whatsapp"}  />
                                    {errors.whatsapp && <p className="pt-0.5 text-error">{errors.whatsapp.message}</p>}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label>Facebook:</label>
                                    <input {...register("facebook")} type="text" placeholder={"Facebook"}  />
                                    {errors.facebook && <p className="pt-0.5 text-error">{errors.facebook.message}</p>}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div>
                        <button disabled={submit} type="submit" className="dark-btn w-full">{submit ? <div className="loader m-auto" ></div> : "Update"}</button>
                    </div> 

                </form>
            </div>}
    </div>)
}
export default Basic