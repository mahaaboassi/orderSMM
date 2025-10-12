import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import MobileInput from "../../../components/mobileInput";
import InputPassword from "../../../components/inputPassword";



const SignUp= ()=>{
    const { t }= useTranslation()
    const navigate = useNavigate()
    useEffect(()=>{
        if(localStorage.getItem("user")){
            navigate("/")
        }
    },[])
    const validationSchema = Yup.object({
        email: Yup.string().email(t("auth.invalid-email")).required(t('auth.email-is-required')),
        password: Yup.string().min(8,t("auth.password-length-validation")).required(t("auth.password-validation")),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], t("auth.confirm-password-not-matching")),
        // telegram: Yup.string().required(t("auth.telegram-is-required")),
        telegram: Yup.string().required(t("auth.telegram-is-required")),
        whatsapp: Yup.string().required("Whatsapp is required"), 
        name: Yup.string().required(t("auth.name-validation")), 
        website: Yup.string()
            .notRequired()
            .test("empty-or-valid", t("auth.invalid-website-url"), value => {
                return !value || /\.[a-z]{2,}$/.test(value);
            })
    });
    const { register, handleSubmit, formState: { errors },watch } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ codewhatsapp, setCodeWhatsapp] = useState("")
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const onSubmit = async (data) => {
        
        setErrorStatus({msg: "", open : false})
        setLoading(true)

        const values = new FormData()
        values.append("email",data.email)
        values.append("password",data.password)
        values.append("website",data.website)
        values.append("telegram",data.telegram)
        values.append("whatsapp",codewhatsapp.dial_code.replace("+","") + data.whatsapp)
        values.append("name",data.name)
        values.append("phone","0")
        values.append("_method","PUT")

        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.signUp,
            method:'POST',
            body:values,
            hasToken: false,
        })
        if(response){
            sendCode(data.email)
            
        }else{
            console.log(message);
            
            if(message == "The email has already been taken. (and 3 more errors)"){
                setErrorStatus({msg: t("error.email-taken"), open : true})
            }else{
                setErrorStatus({msg: message, open : true})
            }
            
            setLoading(false)
            
        }
        
        
    };
    const sendCode = async(email) =>{

        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.sendCode,
            method:'POST',
            body:{ email : email},
            hasToken: false,
        })
        if(response){
            setLoading(false)
            window.scrollTo({top : 0, behavior : "smooth"})
            setErrorStatus({msg: t("success.verified"), open : true,type : "success"})
        }else{
            console.log(message);
            // The selected email is invalid.
            setErrorStatus({msg: message, open : true})
            setLoading(false)
            
        }
    }
    return(<div className="auth-container px-2 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3">
                <h2 className="text-center">{t("auth.register")}</h2>
                {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                <div className="flex flex-col gap-1">
                    <label>{t("auth.email")} :<span className="required">*</span></label>
                    <input {...register("email")} type="text" placeholder={t("auth.email")}  />
                    {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.name")} :<span className="required">*</span></label>
                    <input {...register("name")} type="text" placeholder={t("auth.name")}  />
                    {errors.name && <p className="pt-0.5 text-error">{errors.name.message}</p>}
                </div>
                 <div className="flex flex-col gap-1">
                    <label>{t("auth.whatsapp")} :<span className="required">*</span></label>
                    <MobileInput register={register("whatsapp")} placeholder={t("auth.whatsapp")} returnedCountry={(res)=>{setCodeWhatsapp(res)}} />
                    {errors.whatsapp && <p className="pt-0.5 text-error">{errors.whatsapp.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.telegram")} :<span className="required">*</span></label>
                    <input {...register("telegram")} placeholder="https://t.me/example" />
                    {errors.telegram && <p className="pt-0.5 text-error">{errors.telegram.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.website")} :</label>
                    <input {...register("website")} type="text" placeholder={"website.com"}  />
                    {errors.website && <p className="pt-0.5 text-error">{errors.website.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.password")} :<span className="required">*</span></label>
                    <InputPassword register={register("password")} placeholder={t("auth.password")} />
                    {errors.password && <p className="pt-0.5 text-error">{errors.password.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.confirmation-password")} :<span className="required">*</span></label>
                    <InputPassword register={register("confirmPassword")} placeholder={t("auth.reType-password")} />
                    {errors.confirmPassword && <p className="pt-0.5 text-error">{errors.confirmPassword.message}</p>}
                </div>
                <p>{t("auth.have-an-account")}<Link to="/auth/signIn"><span>{t("auth.sign-in-here")}</span></Link></p>
                <div>
                    <button disabled={loading} className="dark-btn w-full">{loading ? <div className="loader m-auto"></div>: t("auth.sign-up")}</button>
                </div>
        </form>
    </div>)
}
export default SignUp