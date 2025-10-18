/*
. 1 => Check email to verify
. 2 => Card thankful when user confirm his email
. 3 => Card thankful when user add new request service 
. 4 => Card Error when user doesn't have any balance and he have to add balance to continue 
. 5 => something error
. Card thankful when user add new panel => type : new-panel 
. Card Change ownership when user add exist panel => type : exist-panel

*/

import { useSelector, useDispatch } from 'react-redux';
import { changePopup } from '../../features/popupSlice';
import { useNavigate } from 'react-router-dom';
import { changePopupBalance } from '../../features/popupBalanceSlice';
// images
import checkout from "../../assets/images/robot/Checkout.png"
import error from "../../assets/images/robot/error.png"
import no_balance from "../../assets/images/robot/no_balance.png"
import welcome from "../../assets/images/robot/love.png"
import check_email from "../../assets/images/robot/email.png"
import { useTranslation } from 'react-i18next';

const Template = ({img,title,description,onClick,label,type}) => {
    return <div className='py-5 w-full h-full flex flex-col justify-center items-center gap-2'>
                <div className='flex justify-center '>
                    <img className='h-[180px] xs:h-[200px] lg:h-[250px]' src={img} alt='Image' />
                </div>
                <h2 className={`text-2xl font-bold ${type == "error"? "text-[var(--error-color)]" : "text-[var(--green_2)]"}`}>{title}</h2>
                
                <p className="text-center text-gray-700">{description}</p>
                <button onClick={onClick} className='dark-btn'>{label}</button>

            </div>
}

const Popup = ()=>{
    const status = useSelector((state) => state.popup);
    const user = JSON.parse(localStorage.getItem("user"))
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { t } = useTranslation()
    const closeIcon =  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_17_1174)">
        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="#19770D"/>
        </g>
        <defs>
        <clipPath id="clip0_17_1174">
        <rect width="24" height="24" fill="#19770D"/>
        </clipPath>
        </defs>
        </svg>
    const closePopup =()=> dispatch(changePopup({
            isOpen : false,
            type: ""
        }))
        // 
        // <div className={`popup ${ 'opacity-100 scale-100'} transition-all duration-300 ${status.type == "error"? "err-msg" : ""}`}>
    return( status.isOpen && <div className={`popup ${status.isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} transition-all duration-300 ${status.type == "error"? "err-msg" : ""}`}>
        <div style={{maxHeight: `${window.innerHeight -150}px`}} className='content-popup p-2 flex flex-col gap-2'>
            <div className='flex justify-end cursor-pointer ' onClick={closePopup}>{closeIcon}</div>
            {
                status.type == 3 &&<Template title="Thank You!"
                                            description="Your subscription was successful. We appreciate you choosing our services!"
                                            label="View your history"
                                            img={checkout}
                                            onClick={()=>{
                                                if(user?.role == "user"){navigate(`/dashboard/SMMServices`)}
                                                else{navigate(`/dashboard/SMMServices`)}
                                                closePopup()
                                            }}
                                    />
            }
            {
                status.type == 4 && <Template title="Opps! No enough balance"
                                            description={<>
                                            It looks like your wallet doesn’t have enough funds to complete this request.  
                                            <br/>Please add balance to continue using our services.
                                            </>}
                                            label="Add funds"
                                            img={no_balance}
                                            type="error"
                                            onClick={()=>{
                                                dispatch(changePopupBalance({
                                                                        type: "add",
                                                                        isOpen: true
                                                                    }))
                                                closePopup()
                                            }}
                                    />
            }
            {
                status.type == 5 && <Template title="Oops! Something Went Wrong"
                                            description="It looks like something went wrong. Please try again in a moment."
                                            label="Close"
                                            img={error}
                                            type = "error"
                                            onClick={closePopup}
                                    />
            }
            {
                status.type == 2 && <Template title="Welcome to Our Website!"
                                            description="We're excited to have you here! Get ready to enjoy a fun and rewarding journey with our services."
                                            label="Let’s Get Started"
                                            img={welcome}
                                            onClick={()=>{
                                                navigate("/our-services")
                                                closePopup()
                                            }}
                                    />
            }

            {
                status.type == 1 && <Template title="Check your email to verify!"
                                            description={t("success.verified")}
                                            label="Close"
                                            img={check_email}
                                            onClick={closePopup}
                                    />
            }

        </div>
       

    </div>)
}

export default Popup