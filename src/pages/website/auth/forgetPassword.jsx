import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { useEffect, useState } from "react";
import { Helper } from "../../../functionality/helper";
import InputPassword from "../../../components/inputPassword";



const ForgetPassword = ()=>{
    const { t } = useTranslation()
    const { code } = useParams()
    const navigate = useNavigate()
    useEffect(()=>{
        if(!code || localStorage.getItem("user")){
            navigate("/",{
                    state: { message: "Denid access." },
                })
        }
    },[])
    const validationSchema = Yup.object({
        password: Yup.string().min(8,t("auth.password-length-validation")).required(t("auth.password-validation")),
        confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], t("auth.confirm-password-not-matching")),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const onSubmit = async (data) => {
        setErrorStatus({msg: "", open : false})
        setLoading(true)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.forgetPassword,
            method:'POST',
            body:{
                password: data.password,
                password_confirmation: data.confirmPassword,
                verification_code: code
            },
            hasToken: false,
        })
        if(response){
            setLoading(false)
            window.scrollTo({top : 0, behavior : "smooth"})
            setErrorStatus({msg: t("success"), open : true,type : "success"})
            // TO DO => add if the user is user or admin
            navigate("/auth/signIn",{
                    state: { message: response.message,type: "success"},
                })
            
        }else{
            console.log(message);
            setLoading(false)
            setErrorStatus({msg: message, open : true})
        } 
    };

    return(<div className="auth-container px-2 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3">
            {/* <div> */}
            <h2 className="text-center">{"Enter Your Email"}</h2>
            {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
            {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
            <div className="flex flex-col gap-1">
                <label>{t("auth.password")} :</label>
                <InputPassword register={register("password")} placeholder={t("auth.password")} />
                {errors.password && <p className="pt-0.5 text-error">{errors.password.message}</p>}
            </div>
            <div className="flex flex-col gap-1">
                <label>{t("auth.confirmation-password")} :</label>
                <InputPassword register={register("confirmPassword")} placeholder={t("auth.reType-password")} />
                {errors.confirmPassword && <p className="pt-0.5 text-error">{errors.confirmPassword.message}</p>}
            </div>
            <div>
                <button disabled={loading} className="dark-btn w-full">{loading ? <div className="loader m-auto"></div> : t("auth.reset-password") }</button>
            </div>
        </form>
    </div>)
}
export default ForgetPassword