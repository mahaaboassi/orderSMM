import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import FileUpload from "../../../components/fileUpload";
import SwitchComponent from "../../../components/switchComponent";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import Loading from "../../../components/loading";



const DetailsServiceRequest = ()=>{
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
    },[id])

    const getData = async (signal)=>{
        setData([])
        setLoading(true)
        const { response, message, statusCode} = await Helper({
            url :  apiRoutes.services.getOneRequest(id),
            method : "GET",
            signal : signal,
            hasToken: true,
        })
        if(response){
            console.log(response);
            
            window.scrollTo({top:0})
            setLoading(false)
            setData(response.data);
            setMessage(user?.role == "user" ? response.data.description: response.data.notes)
            setStatus(response.data.status == 2 ? 0 : 1)
        }else{
            console.log(message);
            
        }
    }

    const submit = async()=>{
        if(!messageForm){
            setErrorStatus({msg: "Message is required!", open : true})
            return
        }
        setIsSubmit(true)
        const formData = new FormData()
        if(user?.role == "user"){
            formData.append("description",messageForm)
            if( file &&  "name" in file ) formData.append("file",file)
        }else{
            formData.append("notes",messageForm) 
            formData.append("status", status)
        }
    
        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.services.updateRequest(id),
            method:'POST',
            body:formData,
            hasToken: true,
        })
        if(response){
            console.log(response);
            setIsSubmit(false)
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
                <Link className="cursor-pointer text-blue-500" to={user?.role == "user" ?"/dashboard/SMMServices":"/dashboard/admin/history/servicesRequests"}> Services Requests</Link> / <div> {data?.service?.name ?? ""}</div>
            </div>
            <h2>Service Request</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card p-4 flex flex-col gap-2">
                <div className="flex justify-between">
                    <h3>Service Details</h3>
                    <div>
                        {data.status == 0 ? <div className="error-card p-2">Pending</div>
                                            :( data.status == 1 ? <div className="success-card p-2">Paid</div>
                                            :( data.status == 5 ?  <div className="border border-[var(--green_2)] border-[1.2px] rounded-xl p-2 ">Renewed</div>:
                                                <div className="info-card p-2 text-white">Closed</div>)
                                            )}
                    </div>
                </div>
                <div><strong>#id: </strong>{data?.id ?? ""}</div>
                <div><strong>Service Name:</strong> {data?.service?.translations?.[i18n.language]?.name}</div>
                <div><strong>Price:</strong> {data?.price ?? ""}</div>
                <div><strong>Ended At:</strong> {data.ends_at? format(new Date(data.ends_at) , "MMMM d, yyyy") :""}</div>
                <div><strong>Created At:</strong> {data.created_at ? format(new Date(data.created_at) ,  "MMMM d, yyyy"):""}</div>
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
    
        {(data?.service?.slug == "promotion" || data?.service?.slug == "api_emails" ) && <div className="flex flex-col gap-5">

            <div className="flex flex-col gap-5">
                <div className="card p-4 flex flex-col gap-1">
                    <div><strong>{user?.role == "user" ? "Note from Admin":"User Message"}</strong></div>
                    <p> { user?.role == "user" ? data?.notes || "No notes here." : data?.description || "No message here." } </p>
                    { user?.role == "admin" && <p> 
                        { data.photo ? <a href={data.photo} 
                                download 
                                target="_blank" 
                                rel="noopener noreferrer" >
                            Download File
                        </a> : "No File here." }
                    </p>}
                </div>
                {data.status != 5 && data.status != 2  && <form className="card p-4 flex flex-col gap-1" >
                    <label>{user?.role == "user" ? "Message" : "Note"}</label>
                    <textarea disabled={ data.status == "2"} value={messageForm}  onChange={(e)=>{
                        setErrorStatus({msg: "", open : false})
                        setMessage(e.target.value)}} placeholder="Message" />
                    {user?.role == "admin" && <SwitchComponent status={status} label={"Completed"} nonLabel={"Not completed"}
                        returnValue={(res)=>{setStatus(res == 0 ? 2 : 1)}}
                    />}
                </form>}
                { data.status != 5 && data.status != 2 && user?.role == "user" && <div className="card p-4 flex flex-col gap-1">
                        {data.status == 2 ? <div>
                            {data.photo ? <img src={data.photo} alt={data.id} />: <p>No Photo have uploaded</p>}
                        </div>:<>
                        <label>Upload File</label>
                        <FileUpload fromApi={data?.photo ?? ""} returnedFile={(res)=>setFile(res)} />
                        </>}
                    </div>}
                </div>
            {data.status != 5 && <div> 
                <div className="py-2">
                    {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                    {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                </div>
                <button disabled={isSubmit} onClick={submit} className="dark-btn w-full">
                    {isSubmit? <div className="loader m-auto"></div>:"Submit"}
                </button> 
            </div>}
        </div>}
            
    </div>)
}
export default DetailsServiceRequest