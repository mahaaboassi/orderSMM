import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { apiRoutes } from "../functionality/apiRoutes"
import { Helper } from "../functionality/helper"
import { useDispatch, useSelector } from "react-redux"
import { changePopupBalance } from "../features/popupBalanceSlice"
import { useNavigate } from "react-router-dom"


const InfoBalance = ()=>{
    const { i18n } = useTranslation()
    const [ data, setData ] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ loading, setLoading ] = useState(false)
    const [ isOpen, setIsOpen ] = useState(false)
    const menuRef = useRef(null);

    const userRedux = useSelector(state=> state.user)
    const userStorage = JSON.parse(localStorage.getItem("user"))

    useEffect(() => {
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        return ()=> controller.abort()
    }, [])
    const getData = async (signal) => {
        setLoading(true)
        if(!userStorage.wallet){
            setData("0")
            setLoading(false)
            return
        }
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.wallet.getOne(userStorage.wallet),
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            setData(response.data.balance)
            setLoading(false)
        }else{
            console.log(message);
    
        }
    }
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
    return(  <div ref={menuRef} className={`flag-container balance-container ${ (i18n.language == "ar" || i18n.language == "ur")? "border-left":"border-right"} `}>
             <div onClick={()=>setIsOpen(!isOpen)}  className="flex items-center gap-2 cursor-pointer">
                <div className="wallet">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="20" viewBox="0 0 37 30" fill="none">
                        <g clipPath="url(#clip0_387_17)">
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.2863 9.8648H32.8267V9.03878C31.9595 5.86203 29.7554 5.88276 27.0304 5.9094C26.5817 5.91533 26.1752 5.91829 26.1511 5.91829H5.441C4.96525 5.91829 4.57983 5.53933 4.57983 5.07155C4.57983 4.60377 4.96525 4.22481 5.441 4.22481H26.1511C26.7624 4.22481 26.8918 4.22481 27.0153 4.22185C29.3459 4.19816 31.3813 4.17744 32.8267 5.5186V5.13076C32.8267 4.18336 32.4322 3.32478 31.7969 2.70009C31.1615 2.0754 30.2853 1.68756 29.3248 1.68756H5.22119C4.25765 1.68756 3.38444 2.0754 2.7491 2.70009C2.11377 3.32478 1.71932 4.18632 1.71932 5.13076V24.8604C1.71932 25.8078 2.11377 26.6663 2.7491 27.291C3.38444 27.9157 4.26066 28.3036 5.22119 28.3036H29.3218C30.2853 28.3036 31.1585 27.9157 31.7939 27.291C32.4292 26.6663 32.8237 25.8048 32.8237 24.8604V22.0596H27.2833C25.6121 22.0596 24.0916 21.3875 22.9925 20.3069C21.8935 19.2263 21.21 17.7312 21.21 16.088V15.8305C21.21 14.1873 21.8935 12.6922 22.9925 11.6116C24.0946 10.5369 25.6121 9.8648 27.2863 9.8648ZM34.546 9.89736C35.1693 9.98914 35.7263 10.2793 36.1509 10.6997C36.6748 11.2148 36.997 11.9254 36.997 12.707V19.1019C36.997 19.9191 36.6598 20.6592 36.1147 21.1951C35.6962 21.6066 35.1512 21.8997 34.546 22.0122V24.8633C34.546 26.2755 33.9588 27.5604 33.0133 28.4901C32.0679 29.4197 30.7611 29.997 29.3248 29.997H5.22119C3.78491 29.997 2.47811 29.4197 1.53263 28.4901C0.587158 27.5634 0 26.2785 0 24.8663V5.13372C0 3.7215 0.587158 2.43659 1.53263 1.50696C2.47811 0.577322 3.78491 0 5.22119 0H29.3218C30.7581 0 32.0649 0.577322 33.0103 1.50696C33.9558 2.43659 34.543 3.7215 34.543 5.13372V9.89736H34.546ZM26.5396 13.6514C27.759 13.6514 28.7467 14.6225 28.7467 15.8216C28.7467 17.0206 27.759 17.9917 26.5396 17.9917C25.3201 17.9917 24.3324 17.0206 24.3324 15.8216C24.3324 14.6225 25.3201 13.6514 26.5396 13.6514Z" fill="white"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_387_17">
                        <rect width="37" height="30" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>
                <span>{data}</span>
                <div className="arrow-currency arrow-nav">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M0.590088 10.59L5.17009 6L0.590088 1.41L2.00009 0L8.00009 6L2.00009 12L0.590088 10.59Z" fill="white"/>
                    </svg>
                </div>
             </div>

            {isOpen && <div className={`menu-balance p-3 flex flex-col gap-2 ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"}`}>
                <div className="flex justify-between">
                    <div>
                        <div><strong>Your Balance : </strong></div>
                        <div>{data}</div>
                    </div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="20" viewBox="0 0 37 30" fill="none">
                            <g clipPath="url(#clip0_387_17)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M27.2863 9.8648H32.8267V9.03878C31.9595 5.86203 29.7554 5.88276 27.0304 5.9094C26.5817 5.91533 26.1752 5.91829 26.1511 5.91829H5.441C4.96525 5.91829 4.57983 5.53933 4.57983 5.07155C4.57983 4.60377 4.96525 4.22481 5.441 4.22481H26.1511C26.7624 4.22481 26.8918 4.22481 27.0153 4.22185C29.3459 4.19816 31.3813 4.17744 32.8267 5.5186V5.13076C32.8267 4.18336 32.4322 3.32478 31.7969 2.70009C31.1615 2.0754 30.2853 1.68756 29.3248 1.68756H5.22119C4.25765 1.68756 3.38444 2.0754 2.7491 2.70009C2.11377 3.32478 1.71932 4.18632 1.71932 5.13076V24.8604C1.71932 25.8078 2.11377 26.6663 2.7491 27.291C3.38444 27.9157 4.26066 28.3036 5.22119 28.3036H29.3218C30.2853 28.3036 31.1585 27.9157 31.7939 27.291C32.4292 26.6663 32.8237 25.8048 32.8237 24.8604V22.0596H27.2833C25.6121 22.0596 24.0916 21.3875 22.9925 20.3069C21.8935 19.2263 21.21 17.7312 21.21 16.088V15.8305C21.21 14.1873 21.8935 12.6922 22.9925 11.6116C24.0946 10.5369 25.6121 9.8648 27.2863 9.8648ZM34.546 9.89736C35.1693 9.98914 35.7263 10.2793 36.1509 10.6997C36.6748 11.2148 36.997 11.9254 36.997 12.707V19.1019C36.997 19.9191 36.6598 20.6592 36.1147 21.1951C35.6962 21.6066 35.1512 21.8997 34.546 22.0122V24.8633C34.546 26.2755 33.9588 27.5604 33.0133 28.4901C32.0679 29.4197 30.7611 29.997 29.3248 29.997H5.22119C3.78491 29.997 2.47811 29.4197 1.53263 28.4901C0.587158 27.5634 0 26.2785 0 24.8663V5.13372C0 3.7215 0.587158 2.43659 1.53263 1.50696C2.47811 0.577322 3.78491 0 5.22119 0H29.3218C30.7581 0 32.0649 0.577322 33.0103 1.50696C33.9558 2.43659 34.543 3.7215 34.543 5.13372V9.89736H34.546ZM26.5396 13.6514C27.759 13.6514 28.7467 14.6225 28.7467 15.8216C28.7467 17.0206 27.759 17.9917 26.5396 17.9917C25.3201 17.9917 24.3324 17.0206 24.3324 15.8216C24.3324 14.6225 25.3201 13.6514 26.5396 13.6514Z" fill="#19770D"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_387_17">
                            <rect width="37" height="30" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                </div>
                <div>
                    <button onClick={()=>{
                        if(userStorage?.role == "user"){
                            navigate("/dashboard/funds")
                        }else{
                            navigate("/dashboard/admin/funds")
                        }
                        setIsOpen(false)
                    }} className="dark-btn w-full">History</button>
                </div>
                <div>
                    <button onClick={()=>{
                        dispatch(changePopupBalance({
                            type: "add",
                            isOpen: true
                        }))
                        setIsOpen(false)
                    }}  className="dark-btn w-full">Add Funds</button>
                </div>
            </div>}
        </div>)
}
export default InfoBalance