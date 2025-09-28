import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
import { Link, useNavigate, useNavigation, useParams, useSearchParams } from "react-router-dom"
import { format, parse  } from 'date-fns';
import MyTanstackTable from "../../../components/dataTable"
import {
  createColumnHelper,
} from '@tanstack/react-table';
import Dropdown from "../../../components/DropDownComponent"
import AddBalance from "../../dashboard/transactions/addBalance"
import { useSelector } from "react-redux"



const columnHelper = createColumnHelper();

const Transactions = ()=>{
    const { type } = useParams()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ openCharge, setOpenCharge ] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const navigation = useNavigate()
    const userRedux = useSelector(state=> state.user)
    const [searchParams, setSearchParams] = useSearchParams();
    const [ lastPage , setLastPage ] = useState(1)
    const [ isCharge , setIsCharge ] = useState(false)
    const columns = [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('amount', {
                header: 'Amount',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('reference_type', {
                header: 'Reference Type',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('reference_id', {
                header: 'Reference Id',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('balance', {
                header: 'Final Balance',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('type', {
                header: 'Type',
                cell: info => (<div>
                    {info.getValue() == "credit" ? 
                        <div className="warning-card p-2 ">{info.getValue()}</div> : 
                        <div className="success-card p-2">{info.getValue()}</div> 
                    }
                     
                </div>),
            }),
            columnHelper.accessor('created_at', {
                header: 'Created At',
                cell: info => info.getValue(),
            }),
            ]
    if(user?.role == "admin") columns.splice(5,0,columnHelper.accessor('user', {
                header: 'Email',
                cell: info => info.getValue(),
            }),)
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        if(type == "afterCharge"){
            setIsCharge(true)
            setTimeout(()=>{setIsCharge(false)},7000)
        }
        return () => controller.abort()
    },[ searchParams ])

    const getData = async (signal)=>{
        setData([])
        setLoading(true)
        const page = parseInt(searchParams.get('page') || '1')
        const perPage = parseInt(searchParams.get('limit') || '10')
        const type = searchParams.get('type') || ''
        console.log(type);
        
        let params = { page, perPage}
        if(type) params.type = type
        const { response, message, statusCode} = await Helper({
            url : user?.role == "admin" ? apiRoutes.transactions.list : apiRoutes.transactions.byUser,
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
                id : ele.id,
                type : ele?.type ?? "-",
                amount : ele?.amount ?? "0",
                balance :  ele?.balance_after ?? "0",
                reference_id : ele?.reference_id ?? [] ,
                reference_type : ele?.reference_type ?? "",
                user: ele?.wallet?.user?.email ?? "" ,
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
    const dataType = [{label: "credit",value: "credit"},
                        {label: "debit",value: "debit"}]
    const close = ()=>{setOpenCharge(false)}
    return(<div className="flex dashboard flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={user?.role == "admin" ? "/dashboard/admin" :"/dashboard"}> Dashboard</Link> / <div> History transctions</div>
            </div>
            <h2>History transctions</h2>
        </div>
        { isCharge && <div className="charge p-5 flex justify-center flex-col gap-1 items-center ">
            <p>The charging process is still pending. Once it is completed, We will inform you.</p>
            <p>Thank you!</p>
        </div>}
        { user?.role == "user" &&  <div className="card p-4 flex justify-between items-center">
            <div><strong>Your balance is :  </strong>{userRedux.balance}</div>
            <button className="dark-btn" onClick={()=>setOpenCharge(true)}>Add Balance</button>

        </div>}
        {/* Filter Section */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            <Dropdown
                data={dataType}
                defaultOption={{label: "Filter by Type",value : "1"}}
                selected={searchParams.get('type')? dataType.find(e=>e.value == searchParams.get('type') ) :null}
                returnedOption={(res)=>{
                    setSearchParams({
                        page: String(1),
                        limit: String(10),
                        type : res.value
                    });
                }}
            />
            <div onClick={()=>{
                setSearchParams({page: String(1),
                        limit: String(10),})
            }}>
                <button>Reset</button>
            </div>
        </div>
        {loading ? <Loading/> :<MyTanstackTable last_Page={lastPage} columns={columns} data={data} />}
        { openCharge &&  <AddBalance close={close} />}

    </div>)
}

export default Transactions