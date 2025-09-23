import { useTranslation } from "react-i18next"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { useEffect, useState } from "react";
import { Helper } from "../../../functionality/helper";



const TypeEmail = ()=>{
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role") || "";
    
    const validationSchema = Yup.object({
        email: Yup.string().email(t("auth.invalid-email")).required(t('auth.email-is-required')),
    });

    const { register, handleSubmit, formState: { errors },watch } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    useEffect(()=>{
        if(localStorage.getItem("user")){
            navigate("/",{
                state: { message: "Denid access." },
            })
        }
    },[])
    const onSubmit = async (data) => {
        setErrorStatus({msg: "", open : false})
        setLoading(true)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.sendCode,
            method:'POST',
            body:{
                email: data.email,
                type: "forget_password"
            },
            hasToken: false,
        })
        if(response){
            setLoading(false)
            window.scrollTo({top : 0, behavior : "smooth"})
            setErrorStatus({msg: t("success.verified"), open : true,type : "success"})
            localStorage.setItem("email", data.email)
        }else{
            console.log(message);
            setLoading(false)
            setErrorStatus({msg: message, open : true})
        } 
    };

    return(<div className="auth-container px-2 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3">
            {/* <div> */}
            <h2 className="text-center">{t("auth.enter-your-email")}</h2>
            {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
            {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
            <div className="flex flex-col gap-1">
                <label>{t("auth.email")} :</label>
                <input {...register("email")} type="text" placeholder={t("auth.email")}  />
                {errors.email && <p className="p-0.5 text-error">{errors.email.message}</p>}
            </div>
            <p>{t("auth.have-an-account")}<Link to={role?`/auth/admin`:`/auth/signIn`}><span>{t("auth.sign-in-here")}</span></Link></p>
            <div>
                <button disabled={loading} className="dark-btn w-full">{loading ? <div className="loader m-auto"></div> : t("submit") }</button>
            </div>
        </form>
    </div>)
}
export default TypeEmail