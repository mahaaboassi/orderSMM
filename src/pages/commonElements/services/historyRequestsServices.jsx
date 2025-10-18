import { useEffect, useRef, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import { Link, useNavigate, useNavigation, useSearchParams } from "react-router-dom"
import { format, parse  } from 'date-fns';
import MyTanstackTable from "../../../components/dataTable"
import {
  createColumnHelper,
} from '@tanstack/react-table';
import Dropdown from "../../../components/DropDownComponent"




const columnHelper = createColumnHelper();

const HistoryRequestServices = ()=>{
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const navigation = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [ services , setServices ] = useState([])
    const [ lastPage , setLastPage ] = useState(1)
    const controllerRef = useRef(null);
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
                                            :( info.getValue() == 1 ? <div className="success-card p-2">Paid</div>
                                            :( info.getValue() == 5 ? <div className="border border-[var(--green_2)] border-[1.2px] rounded-xl p-2 ">Renewed</div>: <div className="info-card p-2 text-white">Closed</div>)
                                            )}
                </div>),
            }),
            columnHelper.accessor('action', {
                header: '',
                cell: info => {
                    const row = info.row.original;
                    return <div className="flex h-full items-center gap-2 ">
                        <div className="cursor-pointer" onClick={()=>{
                            if(user?.role == "admin" ){
                                navigation(`/dashboard/admin/history/servicesRequests/${row.id}`)
                            }else{
                                navigation(`/dashboard/SMMServices/${row.id}`)
                            }
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.02992 14C8.63992 13.43 8.41992 12.74 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C13.9799 8.42004 15.5799 10.02 15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58" stroke="#19770D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17.5601 5.57998C15.8701 4.37998 13.9701 3.72998 12.0001 3.72998C8.47009 3.72998 5.18009 5.80998 2.89009 9.40998C1.99009 10.82 1.99009 13.19 2.89009 14.6C5.18009 18.2 8.47009 20.28 12.0001 20.28C15.5301 20.28 18.8201 18.2 21.1101 14.6C22.0101 13.19 22.0101 10.82 21.1101 9.40998" stroke="#19770D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg> 
                        </div>
                    </div>
                },
            }),
            ]
    if(user?.role == "admin") columns.splice(5,0,columnHelper.accessor('user', {
                header: 'User',
                cell: info => info.getValue(),
            }),)
    useEffect(()=>{getData()},[ searchParams ])
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getServices(signal)
        
        return () => controller.abort()
    },[])
    const getServices = async (signal)=>{
        setServices([])
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
        }else{
            console.log(message);
        }
    }
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
        const service = parseInt(searchParams.get('service_id') || '')
        const keywords = searchParams.get('keywords') || ''
        let params = {
                page : page,
                results : perPage
            }
        if(keywords) params.keywords = keywords
        if(service) params.service_id = service
        const { response, message, statusCode} = await Helper({
            url : user?.role == "admin" ? apiRoutes.services.history : apiRoutes.services.historyByUser,
            method : "GET",
            signal : signal,
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
    const changeParams = (updates) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
        newParams.set(key, String(value));
        });
        setSearchParams(newParams);
    }
    return(<div className="flex dashboard flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin/panels"}> Panels</Link> / <div>Services Requests</div>
            </div>
            <h2>History Services Requests</h2>
        </div>
        {/* Filter Section */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            <div>
                <input className="w-full h-full rounded-xl px-2 border-[2px] border-[--green_2]" onChange={(e)=>{changeParams({keywords:e.target.value})}} placeholder="Search" /> 
            </div>
            <Dropdown
                data={services.map(e => ({
                    label: e?.translations?.en?.name || "",
                    value: e.id
                }))}
                defaultOption={{label: "Filter by service",value : "1"}}
                selected={parseInt(searchParams.get('service_id')) ? services
                        .map(e => ({ label: e?.translations?.en?.name || "", value: e.id }))
                        .find(opt => opt.value === parseInt(searchParams.get("service_id"))): null}
                returnedOption={(res)=>{ changeParams({page: String(1), limit: String(10),service_id: String(res.value)})}}
            />
            <div onClick={()=>{
                setSearchParams({page: String(1),
                        limit: String(10),})
            }}>
                <button className="dark-btn">Reset</button>
            </div>
        </div>
        {loading ? <Loading/> :<MyTanstackTable last_Page={lastPage} columns={columns} data={data} />}

    </div>)
}

export default HistoryRequestServices