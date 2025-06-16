
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Helper } from "../../functionality/helper";
import { apiRoutes } from "../../functionality/apiRoutes";
import { useDispatch } from "react-redux";
import { userInfo } from "../../features/userSlice";

const Verification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
  const [ msgValidation, setMsgValidation ] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingResendCode, setLoadingResendCode] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if ( localStorage.getItem("user") || !localStorage.getItem("email")) {
      navigate("/");
    }
  }, []);

  // Handle input change
  const handleChange = (e, index) => {
    setMsgValidation("")
    const value = e.target.value.replace(/\D/, ""); // accept only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  };

    // Handle backspace
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
        if (otp[index]) {
            // just clear current box
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        } else if (index > 0) {
            // jump to previous if empty
            inputRefs.current[index - 1]?.focus();
        }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const code = otp.join("");

        if (code.length !== 6) {
        setMsgValidation("auth.enter-6-digit-code")
        return;
        }
        setErrorStatus({msg: "", open : false})
        console.log("Submitted OTP:", code);
        validationCode(code)
        // here: send to backend or verify
    };
    const validationCode = async(code)=>{
            setLoading(true)
            const {response , message,  statusCode} = await Helper({
                url : apiRoutes.auth.verifyCode,
                method : 'POST',
                body : { 
                    email : localStorage.getItem("email"),
                    verification_code : code
                },
                hasToken : false,
            })
            if(response){
                console.log(response);
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
                    whatsapp : response.data.whatsapp
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
                    whatsapp : response.data.whatsapp
                }))
                localStorage.removeItem("email")
                localStorage.setItem("token",response.data.access_token) 

            }else{
                console.log(message);
                // VERIFICATION_CODE_ERROR
                // The selected email is invalid.
                if(message == "VERIFICATION_CODE_ERROR"){
                     setErrorStatus({msg: t("error.verification-code"), open : true})
                }else{
                   setErrorStatus({msg: message, open : true})
                }
               
                setLoading(false)
                
            }
    }
    const sendCode = async() =>{
        setLoadingResendCode(true)
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.auth.sendCode,
            method:'POST',
            body:{ email :  localStorage.getItem("email")},
            hasToken: false,
        })
        if(response){
            console.log(response);
            
            setLoadingResendCode(false)
                
            
        }else{
            console.log(message);
            // The selected email is invalid.
            setErrorStatus({msg: message, open : true})
            setLoadingResendCode(false)
            
        }
    }
  return (
    <div className="auth-container px-2 lg:px-16">
      <form onSubmit={handleSubmit} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-5">
        <h2 className="text-center">{t("auth.verification-code")}</h2>
        <p>{t("auth.verfication-msg")}</p>
        {errorStatus.open && <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-10 h-10 text-center border rounded"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
            />
          ))}
          
        </div>
        { msgValidation && <p className="pt-0.5 text-error">{t(msgValidation)}</p>}
        <p>
          {t("auth.Didn’t-receive-a-code")} <span onClick={()=>{
            if(!loadingResendCode){sendCode()}
          }} className={`text-blue-600 ${loadingResendCode?"!text-zinc-500":"cursor-pointer"}`}>{t("auth.resend-now")}</span>
        </p>
        <div>
          <button disabled={loading} className="dark-btn w-full" type="submit">
            {loading? <div className="loader m-auto"></div> : t("submit")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Verification;