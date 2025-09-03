import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import Pagination from "../../../components/pagination"
import PopupCalled from "../../../components/popupCalled"
import { format } from 'date-fns';
import MyTanstackTable from "../../../components/dataTable"
import {
  createColumnHelper,
} from '@tanstack/react-table';


const columnHelper = createColumnHelper();

const Panels = ()=>{
    const navigate = useNavigate()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [ currentData , setCurrentData ] = useState({})
    const [ total , setTotal ] = useState(0)
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
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('email', {
                header: 'Email',
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

            columnHelper.accessor('is_ad', {
                header: 'Is Ad',
                cell: info => (<div>
                    {info.getValue() == 0 ? <div className="warning-card p-2">No</div>
                                            :<div className="success-card p-2">Yes</div>}
                </div>),
            }),
            columnHelper.accessor('is_provider', {
                header: 'Is Provider',
                cell: info => (<div>
                    {info.getValue() == 0 ? <div className="warning-card p-2">No</div>
                                            :<div className="success-card p-2">Yes</div>}
                </div>),
            }),
            columnHelper.accessor('created_at', {
                header: 'Created At',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('action', {
                header: '',
                cell: info => {
                    const row = info.row.original;
                    return <div className="flex h-full items-center gap-2">
                            {/* Edit Icon */}
                            <div  className="cursor-pointer" onClick={()=>{
                                navigate(`/dashboard/admin/panel/edit/${row.id}`)
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
    
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        
        return () => controller.abort()
        
    },[searchParams])

    const getData = async (signal)=>{
        setData([])
        setLoading(true)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('limit') || '10')
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.panel.list,
            method : "GET",
            signal : signal,
            params : {
                page : page,
                result : perPage
            }
        })
        if(response){
            console.log(response);
            window.scrollTo({top:0})
            setLoading(false)
            setTotal(response.meta.total)
            setLastPage(response.meta.last_page)
            setSearchParams({
                page: String(response.meta.current_page),
                limit: String(perPage),
            });
            // response.data.forEach((ele)=>{
            //         setData(prev=>[...prev, {
            //             name : ele?.translations?.en?.name ?? "-",
            //             id : ele.id,
            //             email : ele?.email ?? "-",
            //             whatsapp : ele?.whatsapp ?? "-",
            //             telegram : ele?.telegram ?? "-",
            //             website : ele?.website ?? "-",
            //             is_ad : ele?.is_ad,
            //             is_provider : ele?.is_provider,
            //             services_count : ele?.services_count ?? "0",
            //             rating : ele?.rating ?? "0",
            //             created_at : format(new Date(ele.created_at), "MMMM d, yyyy")

            //         }])
            // })
            const formattedData = response.data.map(ele => ({
                name : ele?.translations?.en?.name ?? "-",
                id : ele.id,
                email : ele?.email ?? "-",
                whatsapp : ele?.whatsapp ?? "-",
                telegram : ele?.telegram ?? "-",
                website : ele?.website ?? "-",
                is_ad : ele?.is_ad,
                is_provider : ele?.is_provider,
                services_count : ele?.services_count ?? "0",
                rating : ele?.rating ?? "0",
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
    return(<div className="flex dashboard flex-col gap-5">
        <div className="">
            <h2>Panels</h2>
            <h4>Total Panels : ({total})</h4>
            <div className="flex gap-2 items-center">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <g clipPath="url(#clip0_286_31)">
                    <path d="M3.66112 3.66109C6.10194 1.2205 9.30102 0 12.4999 0C15.6988 0 18.8981 1.2205 21.3389 3.66109C23.7795 6.10189 24.9998 9.30094 24.9998 12.4998C24.9998 15.6991 23.7795 18.8979 21.3389 21.3387C18.8981 23.7793 15.6988 24.9998 12.4999 24.9998C9.30102 24.9998 6.10173 23.7793 3.66112 21.3387C1.22031 18.8981 0 15.6991 0 12.4998C0 9.30094 1.22031 6.10189 3.66112 3.66109ZM11.7302 6.34399C11.7302 5.96964 12.0338 5.6661 12.4083 5.6661C12.7829 5.6661 13.0865 5.96964 13.0865 6.34399V11.9151H18.6576C19.0319 11.9151 19.3355 12.2186 19.3355 12.593C19.3355 12.9675 19.0319 13.2711 18.6576 13.2711H13.0862V18.8422C13.0862 19.2165 12.7827 19.5201 12.4081 19.5201C12.0336 19.5201 11.73 19.2165 11.73 18.8422V13.2709H6.15911C5.78476 13.2709 5.481 12.9673 5.481 12.5928C5.481 12.2184 5.78455 11.9149 6.15911 11.9149H11.7302V6.34399ZM12.4999 1.356C9.64791 1.356 6.79612 2.44405 4.61999 4.62016C2.44407 6.79606 1.35601 9.64803 1.35601 12.4998C1.35601 15.3518 2.44407 18.2037 4.61999 20.3796C6.79612 22.5557 9.64791 23.6438 12.4999 23.6438C15.3519 23.6438 18.2037 22.5557 20.3798 20.3796C22.5557 18.2037 23.644 15.3516 23.644 12.4998C23.644 9.64803 22.5557 6.79606 20.3798 4.62016C18.2039 2.44405 15.3519 1.356 12.4999 1.356Z" fill="#19770D"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_286_31">
                    <rect width="25" height="25" fill="white"/>
                    </clipPath>
                    </defs>
                    </svg>
                </div>
                <Link to={"/dashboard/admin/panel/add"}>Add new panel</Link>
            </div>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        
        {loading ? <Loading/> : <MyTanstackTable last_Page={lastPage} columns={columns} data={data} />}


        {/* Confirm Delete  */}
        {openPopup && <PopupCalled  open={openPopup} close={()=>{setOpenPopup(false)}} children={<div className="flex flex-col gap-5">
            <h3 className="text-center">Are you sure you want to delete ({currentData.translations?.en?.name}) </h3>
            <div className="flex justify-center">
                <button disabled={loadingDelete} onClick={deleteData} className="dark-btn">
                    {loadingDelete ? <div className="loader m-auto" ></div>: "Continue"}
                </button>
            </div>

        </div>} />}
    </div>)
}

export default Panels