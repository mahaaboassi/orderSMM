import { useState } from "react"

const InputPassword = ({placeholder,register}) => {
    const [ isView, setIsView ] = useState(false)
    return(<div className="relative">
            <input {...register} type={isView ? "text": "password"} placeholder={placeholder}  />
            <div onClick={()=>setIsView(!isView)} style={{top:"50%",transform:'translateY(-50%)'}} className="absolute right-3 top-50 cursor-pointer">
                { isView ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.02992 14C8.63992 13.43 8.41992 12.74 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C13.9799 8.42004 15.5799 10.02 15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.5601 5.57998C15.8701 4.37998 13.9701 3.72998 12.0001 3.72998C8.47009 3.72998 5.18009 5.80998 2.89009 9.40998C1.99009 10.82 1.99009 13.19 2.89009 14.6C5.18009 18.2 8.47009 20.28 12.0001 20.28C15.5301 20.28 18.8201 18.2 21.1101 14.6C22.0101 13.19 22.0101 10.82 21.1101 9.40998" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5299 9.47004L9.46992 14.53C8.81992 13.88 8.41992 12.99 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C12.9899 8.42004 13.8799 8.82004 14.5299 9.47004Z" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M5.60009 17.76C4.60009 16.9 3.69009 15.84 2.89009 14.59C1.99009 13.18 1.99009 10.81 2.89009 9.4C4.07009 7.55 5.51009 6.1 7.12009 5.13" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M17.82 5.76998C16.07 4.44998 14.07 3.72998 12 3.72998" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8.41992 19.5301C9.55992 20.0101 10.7699 20.2701 11.9999 20.2701C15.5299 20.2701 18.8199 18.1901 21.1099 14.5901C22.0099 13.1801 22.0099 10.8101 21.1099 9.40005C20.7799 8.88005 20.4199 8.39005 20.0499 7.93005" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15.5099 12.7C15.2499 14.11 14.0999 15.26 12.6899 15.52" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.47 14.53L2 22" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M22 2L14.53 9.47" stroke="#19770D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>}
            </div>
        </div>)
}
export default InputPassword