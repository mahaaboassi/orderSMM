import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import FileUpload from "../../../components/fileUpload";
import SwitchComponent from "../../../components/switchComponent";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import Loading from "../../../components/loading";



const DetailsReview = ()=>{
    const { id } = useParams()
    const { t, i18n } = useTranslation()   
    const [ isSubmit, setIsSubmit ] = useState(false)
    const [ data, setData ] = useState({})
    const [file, setFile] = useState("")
    const [ loading, setLoading] = useState(false)
    const [ messageForm, setMessage] = useState("")
    const [ status, setStatus ] = useState(0)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        return () => controller.abort()
    },[ ])

    const getData = async (signal)=>{
        setData([])
        setLoading(true)
        const { response, message, statusCode} = await Helper({
            url :  apiRoutes.review.getOne(id),
            method : "GET",
            signal : signal,
            hasToken: true,
        })
        if(response){
            console.log(response);
            
            window.scrollTo({top:0})
            setLoading(false)
            setData(response.data);
            setStatus(response.data.approved ? 0 : 1)
        }else{
            console.log(message);
            
        }
    }

    const updateStates = async(res)=>{
        const formData = new FormData()
        formData.append("approved", res==0 ? 1 : 0)
    
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.review.update(id),
            method:'POST',
            body:formData,
            hasToken: true,
        })
        if(response){
            console.log(response);
            setErrorStatus({msg: response.message, open : true,type:"success"})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false,type:""})
            },3000)
        }else{
            console.log(message);
            setIsSubmit(false)
            setErrorStatus({msg: message, open : true})
            
        }
    } 

    return(loading ?<Loading/> : <div className='flex dashboard flex-col gap-5'>
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={user?.role == "user" ?"/dashboard/reviews":"/dashboard/admin/reviews"}> Reviews</Link> / <div> Review Details </div>
            </div>
            <h2>Review Details</h2>
        </div>
         <div className="py-2">
            {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
            {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card p-4 flex flex-col gap-2">
                <div className="flex flex-col gap-2 md:flex-row md:justify-between">
                    <h3>Review Details</h3>
                    <div>
                        {user?.role == "admin" ? <SwitchComponent status={status} label={"Approved"} nonLabel={"Not approved"}
                            returnValue={(res)=>{
                                updateStates(res)
                                setStatus(res == 0 ? 0 : 1)}}
                        />:<>
                        {status == 0 ? <div className="success-card p-2">Approved</div>
                                            :<div className="error-card p-2">Not approved</div>
                                }
                        </>}
                        
                    </div>
                </div>
                <div><strong>#id: </strong>{data?.id ?? ""}</div>
                <div><strong>Panel Name:</strong> {data?.panel?.translations?.en?.name}</div>
                <div className="flex"><strong>Rating:</strong> 
                 <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 19 18" fill="none">
                        <g clipPath="url(#clip0_379_17)">
                        <path d="M9.96072 0.307373L12.3898 5.9487L18.5546 6.49593C18.652 6.50386 18.7448 6.54025 18.8214 6.60052C18.8979 6.6608 18.9549 6.74225 18.985 6.83463C19.0151 6.927 19.017 7.02617 18.9905 7.11963C18.964 7.21308 18.9102 7.29665 18.8361 7.35981L14.1695 11.4025L15.5457 17.3974C15.5601 17.4604 15.5618 17.5256 15.5507 17.5892C15.5397 17.6529 15.5161 17.7137 15.4813 17.7683C15.4466 17.8228 15.4013 17.87 15.3481 17.9072C15.295 17.9443 15.2349 17.9706 15.1715 17.9846C15.0403 18.0121 14.9035 17.9866 14.7911 17.9139L9.49531 14.7719L4.18558 17.9292C4.13011 17.9627 4.06853 17.9849 4.00439 17.9946C3.94025 18.0042 3.87482 18.0012 3.81187 17.9856C3.74892 17.97 3.68969 17.9422 3.63759 17.9038C3.5855 17.8654 3.54157 17.8171 3.50833 17.7617C3.47504 17.7075 3.45286 17.6472 3.44304 17.5844C3.43322 17.5217 3.43597 17.4576 3.45112 17.3958L4.82881 11.401L0.168488 7.35981C0.0705304 7.2734 0.0104998 7.1523 0.00125174 7.02244C-0.00799637 6.89258 0.0342733 6.76428 0.119008 6.66502C0.212397 6.56989 0.339433 6.51474 0.473094 6.5113L6.6147 5.96408L9.04381 0.307373C9.083 0.21896 9.1472 0.143786 9.2286 0.091009C9.31 0.0382322 9.40509 0.0101318 9.50227 0.0101318C9.59945 0.0101318 9.69454 0.0382322 9.77594 0.091009C9.85734 0.143786 9.92154 0.21896 9.96072 0.307373Z" fill="#FFD401"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_379_17">
                        <rect width="19" height="18" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                {data?.rating ?? ""}</div>
                <div><strong>Description:</strong> {data?.description ?? ""}</div>
                <div><strong>Created At:</strong> {data.created_at ? format(new Date(data.created_at) ,  "MMMM d, yyyy"):""}</div>
                <div className="flex justify-end">
                    <Link className="flex items-center gap-1" target="_blank" to={`/smm-panel/${data?.panel?.translations?.en?.name}/${data?.panel?.id}`}>
                        <span>view Panel</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="26" viewBox="0 0 12 11" fill="none">
                            <g clipPath="url(#clip0_262_27)">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12.0001 3.39561L8.58848 6.79121V5.09962C6.43115 4.6592 4.72695 5.14465 3.43262 6.76148C3.65732 3.43621 5.9626 1.83151 8.58838 1.72528L8.58848 0L12.0001 3.39561Z" fill="#19770D"/>
                            <path d="M0.674609 2.28491H4.15371C3.70576 2.66595 3.30313 3.10887 2.95605 3.61423H1.34912V9.67078H9.22051V8.25891L10.5695 6.9523V10.3354C10.5695 10.7024 10.2675 11 9.89502 11H0.674609C0.302051 11 0 10.7024 0 10.3354V2.94952C0 2.58243 0.302051 2.28491 0.674609 2.28491Z" fill="#19770D"/>
                            </g>
                            <defs>
                            <clipPath id="clip0_262_27">
                            <rect width="12" height="11" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </Link>
                </div>
            </div>
            <div className="card p-4 flex flex-col gap-2">
                <h3>User Details</h3>
                <div className="flex gap-2 items-center">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 17 17" fill="none">
                            <g clipPath="url(#clip0_230_2)">
                            <mask id="mask0_230_2"  maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="15">
                            <path d="M17 0H0V14.11H17V0Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask0_230_2)">
                            <path d="M8.49998 16.4333C12.8814 16.4333 16.4333 12.8814 16.4333 8.49998C16.4333 4.11852 12.8814 0.56665 8.49998 0.56665C4.11852 0.56665 0.56665 4.11852 0.56665 8.49998C0.56665 12.8814 4.11852 16.4333 8.49998 16.4333Z" fill="white"/>
                            </g>
                            <path d="M8.50003 9.77497C10.2996 9.77497 11.7584 8.31616 11.7584 6.51663C11.7584 4.71711 10.2996 3.2583 8.50003 3.2583C6.7005 3.2583 5.2417 4.71711 5.2417 6.51663C5.2417 8.31616 6.7005 9.77497 8.50003 9.77497Z" fill="#2d312dff"/>
                            <mask id="mask1_230_2"  maskUnits="userSpaceOnUse" x="0" y="0" width="17" height="17">
                            <path d="M8.49998 16.4333C12.8814 16.4333 16.4333 12.8814 16.4333 8.49998C16.4333 4.11852 12.8814 0.56665 8.49998 0.56665C4.11852 0.56665 0.56665 4.11852 0.56665 8.49998C0.56665 12.8814 4.11852 16.4333 8.49998 16.4333Z" fill="white"/>
                            </mask>
                            <g mask="url(#mask1_230_2)">
                            <path d="M8.49998 21.3917C11.7078 21.3917 14.3083 18.7912 14.3083 15.5834C14.3083 12.3755 11.7078 9.77502 8.49998 9.77502C5.29213 9.77502 2.69165 12.3755 2.69165 15.5834C2.69165 18.7912 5.29213 21.3917 8.49998 21.3917Z" fill="#2d312dff"/>
                            </g>
                            </g>
                            <defs>
                            <clipPath id="clip0_230_2">
                            <rect width="17" height="17" fill="white"/>
                            </clipPath>
                            </defs>
                        </svg>
                    </div>
                    <div>
                        <div><strong>{data?.user?.name ?? ""}</strong></div>
                        <p className={`${data?.user?.role == "user" ? "bg-violet-600" : "bg-blue-600"} p-1 rounded flex justify-center items-center text-white`}>{data?.user?.role ?? ""}</p>
                    </div>
                </div>
                <div><div><strong>Email:</strong>{data?.user?.email ?? ""}</div></div>
                <div><strong>Whatsapp:</strong> {data?.user?.whatsapp ?? ""}</div>
                <div><strong>Telegram:</strong> {data?.user?.telegram ?? ""}</div>
                <div><strong>Website:</strong> {data?.user?.website ?? ""}</div>
            </div>

        </div>
            
    </div>)
}
export default DetailsReview