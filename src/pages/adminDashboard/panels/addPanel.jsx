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



const validationSchema = Yup.object({
    title : Yup.string().required("Panel Title Field is required."),
    username: Yup.string().required("Username Field is required."),
    email: Yup.string().email("Invalid email"),
    telegram: Yup.string(),
    whatsapp: Yup.string(), 
    password: Yup.string().min(4,"Password must be at least 4 characters").required("Password Field is required."),
    url_panel : Yup.string().required("URL Panel Field is required."),
    api_url : Yup.string().required("API URL Field is required."),
    api_key : Yup.string().required("Token Field is required."),
    whatsapp_channel : Yup.string(),
    whatsapp_group : Yup.string(),
    telegram_group : Yup.string(),
    referral_url : Yup.string(),
    tiktok : Yup.string(),
    facebook : Yup.string(),
    instagram : Yup.string(),
    
    // name_en: Yup.string().required("Name Field in English language is required."),
    // name_ar: Yup.string().required("Name Field in Arabic language is required."),
    // name_tr: Yup.string().required("Name Field in Turkish language is required."),
    // name_ru: Yup.string().required("Name Field in Russian language is required."),
    // name_hi: Yup.string().required("Name Field in Hindi language is required."),
    // name_ur: Yup.string().required("Name Field in Urdu language is required."),

});
const AddPanel = ()=>{
    const { id } = useParams()
    const { register, handleSubmit, formState: { errors },reset  } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const [file, setFile ] = useState({})
    const [photoFromApi, setPhotoFromApi ] = useState("")
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
            signal : signal
        })
        if(response){
            const data = {
                title: response.data.translations?.en?.name || "",
                username: response.data.username || "",
                telegram: response.data.telegram || "",
                whatsapp: response.data.whatsapp || "",
                email: response.data.email || "",
                url_panel: response.data.website || "",
                api_url: response.data.api_url || "",
                api_key: response.data.token || "",
                whatsapp_channel : response.data.whatsapp_channel || "",
                whatsapp_group : response.data.whatsapp_group || "",
                telegram_group : response.data.telegram_group || "",
                referral_url : response.data.referral_url || "",
                tiktok : response.data.tiktok || "",
                facebook : response.data.facebook || "",
                instagram : response.data.instagram || "",
                // name_en: response.data.translations?.en?.name || "",
                // name_ar: response.data.translations?.ar?.name || "",
                // name_tr: response.data.translations?.tr?.name || "",
                // name_ru: response.data.translations?.ru?.name || "",
                // name_hi: response.data.translations?.hi?.name || "",
                // name_ur: response.data.translations?.ur?.name || "",
            };
            setCountryObj(prev =>({...prev, id: response.data.country_id ?? ""}))
            setPhotoFromApi(response.data.photo)
            console.log(data)
            reset(data); 
        }else{
            console.log(message);
            
        }
    }
    const onSubmit = async (data) => {
        
        setErrorStatus({msg: "", open : false})
        setLoading(true)
        
        const values = new FormData()
        values.append("name",data.title)
        values.append("username",data.username)
        values.append("email",data.email)
        values.append("website",data.url_panel)
        values.append("api_url",data.api_url)
        values.append("token",data.api_key)
        values.append("whatsapp_channel",data.whatsapp_channel)
        values.append("whatsapp_group",data.whatsapp_group)
        values.append("telegram_group",data.telegram_group)
        values.append("referral_url",data.referral_url)
        values.append("tiktok",data.tiktok)
        values.append("facebook",data.facebook)
        values.append("instagram",data.instagram)
        values.append("telegram",codes.telegram.dial_code + data.telegram)
        values.append("whatsapp",codes.whatsapp.dial_code + data.whatsapp)
        values.append("languages[1][name]",data.title)
        values.append("languages[2][name]",data.title)
        values.append("languages[3][name]",data.title)
        values.append("languages[4][name]",data.title)
        values.append("languages[5][name]",data.title)
        values.append("languages[6][name]",data.title)
        if("name" in file)
            values.append("file",file)
        
        if(!id)
            values.append("_method","PUT")

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
            <h2>{id ? "Edit panel" : "Add Panel"}</h2>
            <p>
                Add a new panel to your website along with accurate descriptions in multiple languages:
                {/* <br />
                <strong>(en)</strong> English, <strong>(ar)</strong> Arabic, <strong>(tr)</strong> Turkish, 
                <strong>(ru)</strong> Russian, <strong>(hi)</strong> Hindi, <strong>(ur)</strong> Urdu. */}
             </p>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                    


                </div>
                {/* <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <h4><strong>Name in Languages</strong></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(en)</strong> :</label>
                            <input  {...register("name_en")} type="text" placeholder={"Name (en)"}  />
                            {errors.name_en && <p className="pt-0.5 text-error">{errors.name_en.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(ar)</strong> :</label>
                            <input {...register("name_ar")}  type="text" placeholder={"Name (ar)"}  />
                            {errors.name_ar && <p className="pt-0.5 text-error">{errors.name_ar.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(tr)</strong> :</label>
                            <input {...register("name_tr")} type="text" placeholder={"Name (tr)"}  />
                            {errors.name_tr && <p className="pt-0.5 text-error">{errors.name_tr.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(ru)</strong> :</label>
                            <input {...register("name_ru")} type="text" placeholder={"Name (ru)"}  />
                            {errors.name_ru && <p className="pt-0.5 text-error">{errors.name_ru.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(hi)</strong> :</label>
                            <input {...register("name_hi")}  type="text" placeholder={"Name (hi)"}  />
                            {errors.name_hi && <p className="pt-0.5 text-error">{errors.name_hi.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(ur)</strong> :</label>
                            <input {...register("name_ur")} type="text" placeholder={"Name (ur)"}  />
                            {errors.name_ur && <p className="pt-0.5 text-error">{errors.name_ur.message}</p>}
                        </div>

                    </div>
                </div> */}
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
                            <MobileInput returnedCountry={(res)=>{setCodes(prev=>({...prev,whatsapp:res}))}} register={register("whatsapp")}  />
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
                            <Countries isAddPanel={true}  returnedCountry={(res)=>{setCountryObj(prev=>({...prev, id:res}))}} />
                            {<p className="pt-0.5 text-error">{countryObj.msg}</p>}
                        </div>

                    </div>
                </div>
                <div className='card p-2 sm:p-4 flex flex-col gap-4'>
                    {/* Upload File */}
                    <h4><strong>Upload File is not required</strong></h4>
                    <UploadFile fromApi={photoFromApi} returnedValue={(res)=>setFile(res)}/>
                </div>
                <div>
                    <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Submit"}</button>
                </div>
        </form>
    </div>)
}

export default AddPanel