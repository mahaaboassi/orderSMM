import { useEffect, useRef, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import PopupCalled from "../../../components/popupCalled"
import { format } from 'date-fns';
import MyTanstackTable from "../../../components/dataTable"
import {
  createColumnHelper,
} from '@tanstack/react-table';
import Dropdown from "../../../components/DropDownComponent"


const columnHelper = createColumnHelper();

const PanelRequests = ()=>{
    const navigate = useNavigate()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [ currentData , setCurrentData ] = useState({})
    const [ total , setTotal ] = useState(0)
    const controllerRef = useRef(null);
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const [searchParams, setSearchParams] = useSearchParams();
    const [ lastPage , setLastPage ] = useState(1)

    const columns = [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('name', {
                header: 'Name',
                cell: info => (<div className="min-w-40">{info.getValue()}</div>),
            }),
            columnHelper.accessor('email', {
                header: 'User',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('whatsapp', {
                header: 'whatsapp',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('telegram', {
                header: 'Telegram',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('website', {
                header: 'Website',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: info => (<div className="success-card p-2">New</div>),
            }),
            columnHelper.accessor('created_at', {
                header: 'Created At',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('action', {
                header: '',
                cell: info => {
                    const row = info.row.original;
                    return <div className="flex h-full items-center justify-end gap-2">
                            {/* Edit Icon */}
                            <div  className="cursor-pointer" onClick={()=>{
                                navigate(`/dashboard/admin/panel/requests/edit/${row.id}/request`)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <g clipPath="url(#clip0_284_27)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M15.9436 0.361328L19.6347 4.01042C20.122 4.49219 20.122 5.27995 19.6347 5.76172L17.5932 7.77995L12.1306 2.37956L14.1721 0.361328C14.6594 -0.120443 15.4562 -0.120443 15.9436 0.361328ZM11.5544 8.49447V8.49609C11.7058 8.64583 11.7816 8.8444 11.7816 9.03971C11.7816 9.23503 11.7058 9.43197 11.5544 9.58333V9.58496L11.5527 9.58659L6.60046 14.4841H6.59881C6.556 14.5264 6.50826 14.5622 6.46051 14.5931H6.45887C6.40948 14.624 6.35844 14.6484 6.30576 14.6663C6.03246 14.7607 5.71471 14.6989 5.49739 14.4841H5.49575V14.4824C5.45294 14.4401 5.41672 14.3929 5.38544 14.3457V14.3441C5.35416 14.2952 5.32946 14.2448 5.31135 14.1927C5.21586 13.9225 5.27843 13.6084 5.4941 13.3936V13.3919L10.448 8.49447H10.4496C10.6011 8.34473 10.802 8.26986 10.9995 8.26986C11.1971 8.26986 11.3963 8.34473 11.5494 8.49447H11.5544ZM7.48784 17.7588C6.00941 18.2113 4.53262 18.6621 3.05419 19.1146C-0.419631 20.1774 -0.404814 20.8854 0.54349 17.5781L2.03674 12.3698L2.0318 12.3649L11.0967 3.40169L16.5593 8.80208L7.49278 17.7653L7.48784 17.7588ZM2.96858 13.291L6.556 16.8376C5.58465 17.1338 4.6133 17.43 3.64359 17.7246C1.36173 18.4196 1.37161 18.8851 1.99229 16.7122L2.96858 13.291Z" fill="#19770D"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_284_27">
                                    <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            {/* Delete Icon */}
                            <div onClick={()=>{
                                setOpenPopup(true)
                                setCurrentData(row)
                            }} className="cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 21" fill="none">
                                    <g clipPath="url(#clip0_283_20)">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.407301 1.64626H7.05341V0.642578C7.05341 0.28916 7.34653 0 7.70593 0H11.3753C11.7345 0 12.0278 0.288989 12.0278 0.642578V1.64644H18.5929C18.8173 1.64644 19.0002 1.82708 19.0002 2.04788V4.0156H0V2.04771C0 1.8269 0.183086 1.64626 0.407301 1.64626ZM1.50807 5.05945H17.6337C17.9699 5.05945 18.2751 5.33272 18.2447 5.66169L16.88 20.3981C16.8498 20.7272 16.6041 20.9998 16.2686 20.9998H2.85389C2.51826 20.9998 2.27218 20.7278 2.24233 20.3981L0.896515 5.66169C0.866665 5.33152 1.17158 5.05945 1.50807 5.05945ZM11.9877 7.34829H13.6999V18.5104H11.9877V7.34829ZM5.21874 7.34829H6.93107V18.5104H5.21874V7.34829ZM8.60279 7.34829H10.3155V18.5104H8.60279V7.34829Z" fill="#E30E0E"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_283_20">
                                    <rect width="19" height="21" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>
                        </div>
                },
            }),
            ]
    
    useEffect(()=>{getData() },[ searchParams ])

    const getData = async ()=>{
        setData([])
        setLoading(true)
        
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const abortController = new AbortController();
        controllerRef.current = abortController;

        const signal = abortController.signal;
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('limit') || '10')
        const status = parseInt(searchParams.get('status') || '')
        const keywords = searchParams.get('keywords') || ''
        let params = {
                page : page,
                results : perPage,
                approved : ""
            }
        
        if(status == 0 || status) params.approved = status
        if(keywords) params.keywords = keywords
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.panel.list,
            method : "GET",
            signal : signal,
            hasToken: true,
            params : params
        })
        if(response){
            console.log(response);
            window.scrollTo({top:0})
            setLoading(false)
            setTotal(response.meta.total)
            setLastPage(response.meta.last_page)
            const formattedData = response.data.map(ele => ({
                name : ele?.translations?.en?.name ?? "-",
                id : ele.id,
                email : ele?.email ?? "-",
                whatsapp : ele?.whatsapp ?? "-",
                telegram : ele?.telegram ?? "-",
                website : ele?.website ?? "-",
                services_count : ele?.services_count ?? "0",
                rating : ele?.rating ?? "0",
                status :  ele?.approved ?? "0",
                created_at : format(new Date(ele.created_at), "MMMM d, yyyy")
                }));

            setData(formattedData);
            
        }else{
            console.log(message);
            
        }
    }
    const deleteData = async()=>{
        setLoadingDelete(true)
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.panel.delete(currentData.id),
            method : "DELETE",
            hasToken : true
        })
        if(response){
            console.log(response);
            setOpenPopup(false)
            setLoadingDelete(false)
            setErrorStatus({msg: response.message, open : true,type: "success"})
            getData()
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),1000)
        }else{
            console.log(message)
            setOpenPopup(false)
            setErrorStatus({msg: message, open : true,type: ""})
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),1000)
            setLoadingDelete(false)
        }
    }
    const dataFilter = [{
        label: "Approved",
        value: "1"
    },{
        label: "Not Approved",
        value: "0"
    }]
    const changeParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams)
        newParams.set(key, value);
        setSearchParams(newParams)
    }
    return(<div className="flex dashboard flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin"}> Dashboard</Link> / <div>Panels</div>
            </div>
            <h2>Panel Requests: total({total})</h2>

        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        {/* Filter Section */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            <div >
                <input className="w-full h-full rounded-xl px-2 border-[2px] border-[--green_2]" onChange={(e)=>{changeParams("keywords",e.target.value)}} placeholder="Search" /> 
            </div>
            {/* <Dropdown
                data={dataFilter}
                defaultOption={{label: "Filter by status",value : "3"}}
                selected={parseInt(searchParams.get('status')) ? dataFilter.find(e=>e.value == parseInt(searchParams.get('status')) ): null}
                returnedOption={(res)=>{ changeParams("status", String(res.value)) }}
            /> */}
            <div onClick={()=>{
                setSearchParams({page: String(1),
                        limit: String(10),})
            }}>
                <button className="dark-btn">Reset</button>
            </div>
        </div>
        {loading ? <Loading/> :<MyTanstackTable last_Page={lastPage} columns={columns} data={data} />}


        {/* Confirm Delete  */}
        {openPopup && <PopupCalled  open={openPopup} close={()=>{setOpenPopup(false)}} children={<div className="flex flex-col gap-5">
            <h3 className="text-center">Are you sure you want to delete ({currentData?.name ?? ""}) </h3>
            <div className="flex justify-center">
                <button disabled={loadingDelete} onClick={deleteData} className="dark-btn">
                    {loadingDelete ? <div className="loader m-auto" ></div>: "Continue"}
                </button>
            </div>

        </div>} />}
    </div>)
}

export default PanelRequests