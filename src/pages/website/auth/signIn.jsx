import { useTranslation } from "react-i18next"
import { Link, useLocation, useNavigate } from "react-router-dom"
// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { useEffect, useState } from "react";
import { Helper } from "../../../functionality/helper";
import { useDispatch } from "react-redux";
import { userInfo } from "../../../features/userSlice";
import Loading from "../../../components/loading";



const SignIn = ()=>{
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    
    const validationSchema = Yup.object({
        email: Yup.string().email(t("auth.invalid-email")).required(t('auth.email-is-required')),
        password: Yup.string().min(8,t("auth.password-length-validation")).required(t("auth.password-validation")),
    });

    const { register, handleSubmit, formState: { errors },watch } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [loadingVerify, setLoadingVerify] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const onSubmit = async (data) => {
        setErrorStatus({msg: "", open : false})
        setLoading(true)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.signIn,
            method:'POST',
            body:{
                email: data.email,
                password: data.password
            },
            hasToken: false,
        })
        if(response){
            setLoading(false)
                window.location.reload()
                dispatch(userInfo({
                    email: response.data.email,
                    phone : response.data.phone,
                    photo: response.data.photo,
                    mobile : response.data.Mobile,
                    name : response.data.name,
                    id: response.data.id,
                    telegram : response.data.telegram,
                    website : response.data.website,
                    whatsapp : response.data.whatsapp,
                    role : response.data.role.id
                }))
                localStorage.setItem("user",JSON.stringify({
                    email: response.data.email,
                    phone : response.data.phone,
                    photo: response.data.photo,
                    mobile : response.data.Mobile,
                    name : response.data.name,
                    id: response.data.id,
                    telegram : response.data.telegram,
                    website : response.data.website,
                    whatsapp : response.data.whatsapp,
                    role : response.data.role.id
                }))
                localStorage.setItem("token",response.data.access_token)  
            
        }else{
            if(message == "WRONG_CREDENTIALS"){
                setErrorStatus({msg: t("error.wrong_credentials"), open : true})
            }else if(message == "The given data was invalid."){
                setErrorStatus({msg: <div className="flex gap-2 flex-wrap justify-center">
                    <div>{t("error.your_account_is_not_verified")}</div>
                    <span onClick={()=>sendCode(data.email)}>{t("auth.resend-now")}</span>
                </div>, open : true})
            }else{
                setErrorStatus({msg: message, open : true})
            }
            setLoading(false)
            
        }
        
        
    };
    useEffect(()=>{
        if(localStorage.getItem("user")){
            navigate("/")
        }
        const message = location.state?.message;
        if(message) 
            setErrorStatus({msg:message,open:true})
    },[])
    const sendCode = async(email) =>{
        setLoadingVerify(true)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.sendCode,
            method:'POST',
            body:{ email : email},
            hasToken: false,
        })
        if(response){
            setLoadingVerify(false)
            window.scrollTo({top : 0, behavior : "smooth"})
            setErrorStatus({msg: t("success.verified"), open : true,type : "success"})
        }else{
            console.log(message);
            // The selected email is invalid.
            setErrorStatus({msg: message, open : true})
            setLoadingVerify(false)
            
        }
    }
    return(<div className="auth-container px-2 lg:px-16">
        <form onSubmit={handleSubmit(onSubmit)} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3">
            {/* <div> */}
                <h2 className="text-center">{t("auth.Login")}</h2>
                {loadingVerify && <Loading/>}
                {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                <div className="flex flex-col gap-1">
                    <label>{t("auth.email")} :</label>
                    <input {...register("email")} type="text" placeholder={t("auth.email")}  />
                {errors.email && <p className="p-0.5 text-error">{errors.email.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.password")} :</label>
                    <input {...register("password")} type="password" placeholder={t("auth.password")}  />
                {errors.password && <p className="p-0.5 text-error">{errors.password.message}</p>}
                </div>
                <p>{t("auth.don’t-have-an-account-yet")}<Link to="/auth/signUp"><span>{t("auth.sign-up-here")}</span></Link></p>
                <div>
                    <button disabled={loading} className="dark-btn w-full">{loading ? <div className="loader m-auto"></div> : t("auth.sign-in") }</button>
                </div>
        </form>
    </div>)
}
export default SignIn