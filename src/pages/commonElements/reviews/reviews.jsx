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
import PopupCalled from "../../../components/popupCalled"




const columnHelper = createColumnHelper();

const Reviews = ()=>{
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))
    const navigation = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const [ services , setServices ] = useState([])
    const [ currentData , setCurrentData ] = useState({})
    const [openPopup, setOpenPopup] = useState(false)
    const [ loadingDelete, setLoadingDelete ] = useState(false)
    const [ lastPage , setLastPage ] = useState(1)
    const controllerRef = useRef()
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const columns = [
            columnHelper.accessor('id', {
                header: 'ID',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('panel', {
                header: 'Panel',
                cell: info => info.getValue(),
            }),
            // columnHelper.accessor('user', {
            //     header: 'User',
            //     cell: info => info.getValue(),
            // }),
            columnHelper.accessor('description', {
                header: 'Description',
                cell: info => info.getValue(),
            }),
            columnHelper.accessor('rate', {
                header: 'Rating',
                cell: info => (<div className="flex gap-1 ">
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
                    {info.getValue()}
                </div>),
            }),
            columnHelper.accessor('created_at', {
                header: 'Created At',
                cell: info => (info.getValue()),
            }),
            columnHelper.accessor('status', {
                header: 'Status',
                cell: info => (<div>
                    { !info.getValue() ? <div className="error-card p-2">Not Approved</div>
                                            : <div className="success-card p-2">Approved</div>}
                </div>),
            }),
            columnHelper.accessor('action', {
                header: '',
                cell: info => {
                    const row = info.row.original;
                    return <div className="flex h-full items-center gap-2 ">
                        <div className="cursor-pointer" onClick={()=>{
                            if(user?.role == "admin" ){
                                navigation(`/dashboard/admin/reviews/${row.id}`)
                            }else{
                                // navigation(`/dashboard/SMMServices/${row.id}`)
                            }
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M9.02992 14C8.63992 13.43 8.41992 12.74 8.41992 12C8.41992 10.02 10.0199 8.42004 11.9999 8.42004C13.9799 8.42004 15.5799 10.02 15.5799 12C15.5799 13.98 13.9799 15.58 11.9999 15.58" stroke="#19770D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M17.5601 5.57998C15.8701 4.37998 13.9701 3.72998 12.0001 3.72998C8.47009 3.72998 5.18009 5.80998 2.89009 9.40998C1.99009 10.82 1.99009 13.19 2.89009 14.6C5.18009 18.2 8.47009 20.28 12.0001 20.28C15.5301 20.28 18.8201 18.2 21.1101 14.6C22.0101 13.19 22.0101 10.82 21.1101 9.40998" stroke="#19770D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
    if(user?.role == "admin") columns.splice(2,0,columnHelper.accessor('user', {
                header: 'User',
                cell: info => info.getValue(),
            }),)
    useEffect(()=>{getData() },[searchParams])

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
                results : perPage
            }
        
        if(status == 0 || status) params.approved = status
        if(keywords) params.keywords = keywords
        const { response, message, statusCode} = await Helper({
            url : user?.role == "admin" ? apiRoutes.review.list : apiRoutes.services.historyByUser,
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
                id : ele.id,
                rate : ele?.rating ?? "1",
                panel : ele?.panel?.translations?.en?.name ?? "" ,
                user : ele?.user?.email ?? "",
                description : ele?.description ?? "",
                status : ele?.approved ?? "",
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
    const deleteData = async()=>{
        setLoadingDelete(true)
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.review.delete(currentData.id),
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
    return(<div className="flex dashboard flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin"}> Dashboard</Link> / <div>Reviews</div>
            </div>
            <h2>Reviews</h2>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        {/* Filter Section */}
        <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
            <div >
                <input className="w-full h-full rounded-xl px-2 border-[2px] border-[--green_2]" onChange={(e)=>{changeParams({keywords:e.target.value})}} placeholder="Search" /> 
            </div>
            <Dropdown
                data={dataFilter}
                defaultOption={{label: "Filter by status",value : "3"}}
                selected={parseInt(searchParams.get('status')) == 0 || parseInt(searchParams.get('status')) ? dataFilter.find(opt => opt.value == parseInt(searchParams.get("status"))): null}
                returnedOption={(res)=>{changeParams({page: String(1),limit: String(10), status: res.value})
                }}
            />
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
            <h3 className="text-center">Are you sure you want to delete this review: ({currentData?.description}) 
                <br/>for ({currentData?.panel ?? ""}) panel </h3>
            <div className="flex justify-center">
                <button disabled={loadingDelete} onClick={deleteData} className="dark-btn">
                    {loadingDelete ? <div className="loader m-auto" ></div>: "Continue"}
                </button>
            </div>

        </div>} />}
    </div>)
}

export default Reviews