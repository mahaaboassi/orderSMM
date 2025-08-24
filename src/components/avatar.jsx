import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"


const Avatar = ()=>{
    const { t, i18n } = useTranslation()
    const [ isOpen, setIsOpen ] = useState(false)
    const navigate = useNavigate()
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    const logout = ()=>{
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        window.location.reload()
    }
    const handleNavigate = ()=>{
        setIsOpen(false)
        if(localStorage.getItem("user")){
            const user = JSON.parse(localStorage.getItem("user"))
            if(user.role == 1){
                navigate("/dashboard/admin")
            }else if( user.role == 2){
                navigate("/dashboard")
            }
        }
        
    }
    return(  <div ref={menuRef} className="avatar">
            <div onClick={()=>setIsOpen(!isOpen)} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 17 17" fill="none">
                    <g clipPath="url(#clip0_230_2)">
                    <mask id="mask0_230_2"  maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="15">
                    <path d="M17 0H0V14.11H17V0Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask0_230_2)">
                    <path d="M8.49998 16.4333C12.8814 16.4333 16.4333 12.8814 16.4333 8.49998C16.4333 4.11852 12.8814 0.56665 8.49998 0.56665C4.11852 0.56665 0.56665 4.11852 0.56665 8.49998C0.56665 12.8814 4.11852 16.4333 8.49998 16.4333Z" fill="white"/>
                    </g>
                    <path d="M8.50003 9.77497C10.2996 9.77497 11.7584 8.31616 11.7584 6.51663C11.7584 4.71711 10.2996 3.2583 8.50003 3.2583C6.7005 3.2583 5.2417 4.71711 5.2417 6.51663C5.2417 8.31616 6.7005 9.77497 8.50003 9.77497Z" fill="#19770D"/>
                    <mask id="mask1_230_2"  maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="17">
                    <path d="M8.49998 16.4333C12.8814 16.4333 16.4333 12.8814 16.4333 8.49998C16.4333 4.11852 12.8814 0.56665 8.49998 0.56665C4.11852 0.56665 0.56665 4.11852 0.56665 8.49998C0.56665 12.8814 4.11852 16.4333 8.49998 16.4333Z" fill="white"/>
                    </mask>
                    <g mask="url(#mask1_230_2)">
                    <path d="M8.49998 21.3917C11.7078 21.3917 14.3083 18.7912 14.3083 15.5834C14.3083 12.3755 11.7078 9.77502 8.49998 9.77502C5.29213 9.77502 2.69165 12.3755 2.69165 15.5834C2.69165 18.7912 5.29213 21.3917 8.49998 21.3917Z" fill="#19770D"/>
                    </g>
                    </g>
                    <defs>
                    <clipPath id="clip0_230_2">
                    <rect width="17" height="17" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
            </div>
            {isOpen && <div className={`menu-avatar p-2  flex flex-col gap-2 ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"}`}>
                <div className="flex name-avatar p-0.5 gap-2">
                    <div>
                        {JSON.parse(localStorage.getItem("user")).name}
                    </div>
                </div>
                <div onClick={handleNavigate} className="flex p-0.5 option-avatar gap-2">
                        {t("dashboard")}
                </div>
                 <div onClick={logout} className="flex p-0.5 option-avatar gap-2">
                        {t("logout")}
                </div>
            </div>}
        </div>)
}
export default Avatar