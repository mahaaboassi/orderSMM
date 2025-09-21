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


const columnHelper = createColumnHelper();

const HistoryPanel = ()=>{
    const { id , name} = useParams()
    const navigate = useNavigate()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    const [ currentData , setCurrentData ] = useState({})
    const [ services , setServices ] = useState([])
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
            columnHelper.accessor('clicks', {
                header: 'Clicks',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: info => (<div>
                    {info.getValue() == 0 ? <div className="error-card p-2">Pending</div>
                                            :<div className="success-card p-2">Paid</div>}
                </div>),
            }),
            ]
    
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        getServices(signal)
        
        return () => controller.abort()
        
    },[ searchParams ])

    const getData = async (signal)=>{
        setData([])
        setLoading(true)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('limit') || '10')
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.panel.historyServiceGetOne(id),
            method : "GET",
            // signal : signal,
            hasToken: true,
            params : {
                page : page,
                results : perPage
            }
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
    const getServices = async (signal)=>{
        setServices([])
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.services.list,
            method : "GET",
            signal : signal,
            hasToken: true,
            params : {
                page : page,
                results : perPage
            }
        })
        if(response){
            console.log(response.data)
           setData(response.data)
        }else{
            console.log(message);
            
        }
    }
    return(<div className="flex dashboard flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin/panels"}> Panels</Link> / <div>{name}</div>
            </div>
            <h2>History Services for {name}</h2>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        
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

export default HistoryPanel