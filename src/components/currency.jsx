import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helper } from "../functionality/helper";
import { apiRoutes } from "../functionality/apiRoutes";
import { useDispatch } from "react-redux";
import { currencyStatus } from "../features/currencySlice";

const Currency = ()=>{
    const [ currentCurrency, setCurrentCurrency ] = useState({})
    const [ isOpen, setIsOpen ] = useState(false)
    const dispatch = useDispatch()
    const select = (currency)=>{
        setCurrentCurrency(currency)
        setIsOpen(false)
        dispatch(currencyStatus(currency))
    }
    const { i18n } = useTranslation()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(true)
    useEffect(()=>{
        const abortController = new AbortController();
        const signal = abortController.signal;
        getData(signal)
        return () => abortController.abort() 
    },[])
    const getData = async (signal) => {
        setLoading(true)
        const temp = {page: 1,
            results: 30
        }
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.currencies.list,
            signal : signal,
            method : "GET",
            params :temp,
            hasToken : true
        })
        if(response){
            setData(response.data)
            setLoading(false)
            const def = response.data.find(e=>e.code.toLowerCase() == "usd")
            setCurrentCurrency(def)
            dispatch(currencyStatus(def))
            // setLastPage(response.meta.last_page)
        }else{
            console.log(message);
  
        }
    }
    const menuRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsOpen(false);
        }
        };
        if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);
    return(<div ref={menuRef} className={` ${ (i18n.language == "ar" || i18n.language == "ur")? "border-left":"border-right"} currency`}>
            <div onClick={()=>setIsOpen(!isOpen)}  className="flex items-center gap-2 cursor-pointer">
                <span >{currentCurrency.code}</span>
                <div className="arrow-currency arrow-nav">
                    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M0.590088 10.59L5.17009 6L0.590088 1.41L2.00009 0L8.00009 6L2.00009 12L0.590088 10.59Z" fill="white"/>
                    </svg>
                </div>
            </div>
           { isOpen && <div className={`currency_menu p-1 ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"} `}>
                {loading ? [0,1,2,3,4,5].map((_,idx)=>(<div className="select_currency p-1" key={`Currency_loading_${idx}`}>
                    <span className="skeleton-box"></span>
                </div>)):
                data.map((e,idx)=>(<div onClick={()=>select(e)} className="select_currency p-1" key={`Currency_Navbar_${e.name}_${idx}`}>{e.code}</div>))
                }
                
            </div>}
        </div>)
}

export default Currency