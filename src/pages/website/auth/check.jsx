import { useTranslation } from "react-i18next"
import { Link, useNavigate, useParams } from "react-router-dom"
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



const Check = ()=>{
    const { t } = useTranslation()
    const { code } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    useEffect(()=>{
        if(!code || localStorage.getItem("user")){
            navigate("/",{
                state: { message: "Denid access." },
            })
        }
        sendCode()
    },[])
    const sendCode = async (data) => {
        setErrorStatus({msg: "", open : false})
        setLoading(true)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.verifyCode,
            method:'POST',
            body:{verification_code :code},
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
            if(message == "The selected verification code is invalid."){
                setErrorStatus({msg: <div className="flex gap-2 flex-wrap justify-center">
                    <div>{t("error.invalid_code")}</div>
                    {/* <span onClick={()=>sendCode(data.email)}>{t("auth.resend-now")}</span> */}
                </div>, open : true})
            }else{
                setErrorStatus({msg: message, open : true})
            }
            
            setLoading(false)
            
        }
        
        
    };
    return(<div className="auth-container px-2 lg:px-16 h-screen">
        <div className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3">
            {/* <div> */}
                <h2 className="text-center">Final Step: Activating Your Account</h2>
                <p className="text-center">  We're verifying your account. Hang tight — this will only take a moment.</p>
                { loading ?<Loading/>:<div className="h-30 flex flex-col items-center gap-3 justify-center ">
                    {errorStatus.open &&  errorStatus.type != "success" && <div className="text-error border-error w-full text-center p-2 " >{errorStatus.msg}</div>}
                    {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                    
                    <div className="w-full"><button onClick={()=>navigate("/")} className="dark-btn w-full">{t("go-to-home-page")}</button></div>
                    
                </div>}
                
        </div>
    </div>)
}
export default Check