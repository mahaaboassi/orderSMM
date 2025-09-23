import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import PopupCalled from "../../../components/popupCalled"
import { format, parse  } from 'date-fns';
import MyTanstackTable from "../../../components/dataTable"
import {
  createColumnHelper,
} from '@tanstack/react-table';
import Dropdown from "../../../components/DropDownComponent"
import UsersSelect from "../../../components/users"


const ServicesFilter = ({returnedValue})=>{
    const [ services , setServices ] = useState([])
    const [ defaultValue , setDefaultValue ] = useState({label: "Filter by service",value : "1"})
     const [searchParams, setSearchParams] = useSearchParams();
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getServices(signal)
        
        return () => controller.abort()
    },[searchParams])
    const getServices = async (signal)=>{
        setServices([])
        const service = parseInt(searchParams.get('service_id') || '')
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.services.list,
            method : "GET",
            signal : signal,
            params: { results: 20 },
            hasToken: true,
        })
        if(response){
            console.log(response.data)
            setServices(response.data)
            const currentValue = response.data.find(e=> e.id == service)
            if(currentValue) {setDefaultValue({
                label: currentValue?.translations?.en?.name || "",
                value: currentValue.id
            })}else{
                setDefaultValue({label: "Filter by service",value : "1"})
            }
        }else{
            console.log(message);
        }
    }
    return( <div >
            {<Dropdown returnedOption={(res)=>{
                 returnedValue(res)
            }} defaultOption={defaultValue}
                data={services.length > 0  ?services.map(e => ({
                    label: e?.translations?.en?.name || "",
                    value: e.id
                })):[]} 
                />}
        </div>)
}

const columnHelper = createColumnHelper();

const HistoryRequestServices = ()=>{
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [ currentData , setCurrentData ] = useState({})
    const user = JSON.parse(localStorage.getItem("user"))
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
            columnHelper.accessor('service', {
                header: 'Service Name',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('created_at', {
                header: 'Start Date',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('ends_at', {
                header: 'End Date',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('price', {
                header: 'Price',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('panels', {
                header: 'Panels',
                cell: info => (<div style={{minWidth : "150px"}}>
                    {info.getValue().map((e,i)=>{
                        return <Link to={e.website} target="_blank">
                        <div>{i+1}.{e?.translations?.en?.name ?? ""}</div>
                        </Link>
                    })}
                </div>),
            }),
            columnHelper.accessor('clicks', {
                header: 'Clicks',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: info => (<div>
                    {info.getValue() == 0 ? <div className="error-card p-2">Pending</div>
                                            :( info.getValue() == 1 ? <div className="success-card p-2">Paid</div>:
                                            <div className="info-card p-2">Closed</div>)}
                </div>),
            }),
            ]
    if(user?.role == "admin") columns.splice(5,0,columnHelper.accessor('user', {
                header: 'User',
                cell: info => info.getValue(),
            }),)
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        return () => controller.abort()
        
    },[ searchParams ])

    const getData = async (signal)=>{
        setData([])
        setLoading(true)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('limit') || '10')
        const service = parseInt(searchParams.get('service_id') || '')
        let params = { page, perPage}
        if(service) params.service_id = service
        const { response, message, statusCode} = await Helper({
            url : user?.role == "admin" ? apiRoutes.services.history : apiRoutes.services.historyByUser,
            method : "GET",
            // signal : signal,
            hasToken: true,
            params : params
        })
        if(response){
            window.scrollTo({top:0})
            setLoading(false)
            setLastPage(response.meta.last_page)
            
            const formattedData = response.data.map(ele => ({
                service : ele?.service?.translations?.en?.name ?? "-",
                id : ele.id,
                price : ele?.price ?? "-",
                clicks : ele?.clicks ?? "0",
                status :  ele?.status ?? "0",
                panels : ele?.panels ?? [] ,
                user : ele?.user?.email ?? "",
                ends_at : ele.ends_at 
                    ? format(new Date(ele.ends_at), "MMMM d, yyyy") 
                    : "-",
                created_at : ele.created_at 
                    ? format(
                        parse(ele.created_at, "yyyy-MM-dd HH:mm:ss", new Date()),
                        "MMMM d, yyyy"
                    )
                    : "-"
                }));
            
            setData(formattedData);
            
        }else{
            console.log(message);
            
        }
    }
    
    return(<div className="flex dashboard flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin/panels"}> Panels</Link> / <div>Services Requests</div>
            </div>
            <h2>History Services Requests</h2>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        
        {/* Filter Section */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
             <ServicesFilter returnedValue={(res)=>{
                setSearchParams({
                        page: String(1),
                        limit: String(10),
                        service_id : String(res.value)
                    });
            }}/>
            <div onClick={()=>{
                setSearchParams({page: String(1),
                        limit: String(10),})
            }}>
                <button>Reset</button>
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

export default HistoryRequestServices