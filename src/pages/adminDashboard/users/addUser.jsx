// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useEffect, useState } from 'react';
import UploadFile from '../../../components/uploadFile';
import { useNavigate, useParams } from 'react-router-dom';
import MobileInput from '../../../components/mobileInput';
import Countries from '../../../components/countries';
import UsersSelect from '../../../components/users';



const validationSchema = Yup.object({
    name : Yup.string().required("Name Field is required."),
    email: Yup.string().email("Invalid email"),
    telegram: Yup.string(),
    whatsapp: Yup.string(), 
    website: Yup.string(), 
    role: Yup.string(),

});
const AddUser = ()=>{
    const { id } = useParams()
    const { register, handleSubmit, watch, setValue, formState: { errors },reset  } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange',
            defaultValues : id ? {} : { approved : 0}
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const [ file, setFile ] = useState({})
    const [ user, setUser ] = useState("")
    const [ photoFromApi, setPhotoFromApi ] = useState("")
    const [ codes, setCodes ] = useState({
        telegram : "",
        whatsapp : ""
    })
    const [ countryObj, setCountryObj ] = useState({
        id : "",
        msg : ""
    })
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        if(id)
          getData(signal)
        return () => controller.abort()
    },[])
    const getData = async (signal)=>{
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.panel.getOne(id),
            method : "GET",
            hasToken : true,
            signal : signal
        })
        if(response){
            const data = {
                name: response.data.name || "",
                telegram: response.data.telegram || "",
                whatsapp: response.data.whatsapp || "",
                email: response.data.email || "",
                role: response.data.role || "",
                website: response.data.website || "",
            };
            setUser(response.data.user)
            setCountryObj(prev =>({...prev, id: response.data.country_id ?? ""}))
            setPhotoFromApi(response.data.photo)
            reset(data); 
        }else{
            console.log(message);
            
        }
    }
    const onSubmit = async (data) => {
        
        setErrorStatus({msg: "", open : false})
        if(!countryObj.id){
            setCountryObj({msg: "Country Feild is required!", id : ""})
            return
        }
        setLoading(true)
        
        const values = new FormData()
        values.append("name",data.name)
        values.append("email",data.email)
        values.append("website",data.url_panel)
        values.append("telegram",data.telegram)
        values.append("whatsapp",data.whatsapp)
        values.append("role",data.role)
        
        if("name" in file)
            values.append("file",file)
        
        if(!id)
            values.append("_method","PUT")


        const obj = Object.fromEntries(values.entries());
        console.log("Data user",obj);
        return
        const {response , message,  statusCode} = await Helper({
            url: id ? apiRoutes.panel.update(id) : apiRoutes.panel.add,
            method:'POST',
            body:values,
            hasToken : true,
        })
        if(response){
            console.log(response);
            setLoading(false)
            setErrorStatus({msg: response.message, open : true,type: "success"})
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),1000)
            window.scrollTo({top: 0})
        }else{
            console.log(message);
            window.scrollTo({top: 0})
            setTimeout(()=>setErrorStatus({msg: message, open : true,type: ""}),1000)
            setLoading(false)
        }
    };

    return(<div className="flex flex-col gap-5">
        <div>
            <h2>{id ? "Edit User" : "Add User"}</h2>
            <p>
                Add a new user to your website 
             </p>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        {/* <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="flex flex-col gap-1">
                            <label>Name:</label>
                            <input  {...register("name")} type="text" placeholder={"Name"}  />
                            {errors.name && <p className="pt-0.5 text-error">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Email :</label>
                            <input  {...register("email")} type="text" placeholder={"Email"}  />
                            {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>username :</label>
                            <input {...register("username")} type="text" placeholder={"Username"}  />
                            {errors.url_panel && <p className="pt-0.5 text-error">{errors.url_panel.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Password :</label>
                            <input  {...register("password")} type="text" placeholder={"Password"}  />
                            {errors.password && <p className="pt-0.5 text-error">{errors.password.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>API URL :</label>
                            <input {...register("api_url")} type="text" placeholder={"https://panel.com/api/v2"}  />
                            {errors.api_url && <p className="pt-0.5 text-error">{errors.api_url.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Token:</label>
                            <input {...register("api_key")} type="text" placeholder={"123456789123456789"}  />
                            {errors.api_key && <p className="pt-0.5 text-error">{errors.api_key.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Referral Url :</label>
                            <input {...register("referral_url")} type="text" placeholder={"https://panel.com/"}  />
                            {errors.referral_url && <p className="pt-0.5 text-error">{errors.referral_url.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>User:</label>
                            <UsersSelect currentValue={user} returnedUser={(res)=>{setUser(res)}} />
                            {errors.referral_url && <p className="pt-0.5 text-error">{errors.referral_url.message}</p>}
                        </div>
                    </div>
                    


                </div>
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <h4><strong>Contact Info</strong></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Email :</label>
                            <input  {...register("email")} type="text" placeholder={"Email"}  />
                            {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Whatsapp :</label>
                            <MobileInput value={watch("whatsapp")} returnedCountry={(res)=>{setCodes(prev=>({...prev,whatsapp:res}))}} register={register("whatsapp")}  />
                            {errors.whatsapp && <p className="pt-0.5 text-error">{errors.whatsapp.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Telegram :</label>
                            <MobileInput returnedCountry={(res)=>{setCodes(prev=>({...prev,telegram:res}))}} register={register("telegram")}  />
                            {errors.telegram && <p className="pt-0.5 text-error">{errors.telegram.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Whatsapp Group :</label>
                            <input  {...register("whatsapp_group")} type="text" placeholder={"https://t.me/mygroup"}  />
                            {errors.telegram_group && <p className="pt-0.5 text-error">{errors.telegram_group.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Whatsapp Channel :</label>
                            <input  {...register("whatsapp_channel")} type="text" placeholder={"https://chat.whatsapp.com/invitecode"}  />
                            {errors.whatsapp_channel && <p className="pt-0.5 text-error">{errors.whatsapp_channel.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Telegram Group :</label>
                            <input  {...register("telegram_group")} type="text" placeholder={"https://t.me/mygroup"}  />
                            {errors.telegram_group && <p className="pt-0.5 text-error">{errors.telegram_group.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Tiktok :</label>
                            <input  {...register("tiktok")} type="text" placeholder={"https://www.tiktok.com/@username"}  />
                            {errors.tiktok && <p className="pt-0.5 text-error">{errors.tiktok.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Facebook :</label>
                            <input  {...register("facebook")} type="text" placeholder={"https://facebook.com/username"}  />
                            {errors.facebook && <p className="pt-0.5 text-error">{errors.facebook.message}</p>}
                        </div>
                         <div className="flex flex-col gap-1">
                            <label>Instagram :</label>
                            <input  {...register("instagram")} type="text" placeholder={"https://instagram.com/username"}  />
                            {errors.instagram && <p className="pt-0.5 text-error">{errors.instagram.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Select Country :</label>
                            <Countries currentValue={countryObj.id} isAddPanel={true}  returnedCountry={(res)=>{setCountryObj(prev=>({...prev, id:res}))}} />
                            {<p className="pt-0.5 text-error">{countryObj.msg}</p>}
                        </div>

                    </div>
                </div>
                <div className='card p-2 sm:p-4 flex flex-col gap-4'>
                    Upload File
                    <h4><strong>Upload File is not required</strong></h4>
                    <UploadFile fromApi={photoFromApi} returnedValue={(res)=>setFile(res)}/>
                </div>
                <div>
                    <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Submit"}</button>
                </div>
        </form> */}
    </div>)
}

export default AddUser