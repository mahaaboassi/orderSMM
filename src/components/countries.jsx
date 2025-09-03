import { useEffect, useRef, useState } from "react"
import { Helper } from "../functionality/helper"
import { apiRoutes } from "../functionality/apiRoutes"
import { useTranslation } from "react-i18next"

const Countries = ({returnedCountry,isAddPanel})=>{
    const { t, i18n } = useTranslation()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ value, setValue ] = useState("")
    const [ country, setCountry ] = useState(t("selectCountry"))
    const [ open, setOpen ] = useState(false)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const containerRef = useRef(null)
    const abortControllerRef = useRef(null)
    useEffect(()=>{
        getCountries(page,value)
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    },[page,value])
    const getCountries = async (pageNum,name)=>{
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }
        const controller = new AbortController()
        abortControllerRef.current = controller
        setLoading(true)
        const temp = {
            page : pageNum,
        }
        if(name) temp.name = name
        const { response, message } = await Helper({
            url : apiRoutes.countries.list,
            signal: controller.signal,
            params : temp
        })
        if(response){
            // setData(response.data)
            setLoading(false)
            if (response.data.length === 0) {
                setHasMore(false) // no more data
            } else {
                setData((prev) => [...prev, ...response.data]) // append
            }
        }else{
            console.log(message)
        }
    }
    useEffect(() => {
        if (!open) return 
        const el = containerRef.current
        if (!el) return
        const handleScroll = () => {
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
                if (hasMore && !loading) {
                setPage((prev) => prev + 1)
                }
            }
        }
        el.addEventListener("scroll", handleScroll)
        return () => el.removeEventListener("scroll", handleScroll)
    }, [hasMore, loading, open])

    const handleChange = (val)=>{
        setValue(val)
        setPage(1)
        setData([])
    }
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setOpen(false);
        }
        };
        if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        } else {
        document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    const select = (e)=>{
        setCountry(e?.translations?.[i18n.language].name)
        setOpen(false)
        returnedCountry(e.id)
    }
    return(<div className={`relative ${isAddPanel ? "add-panel-country" : ""}`}>
        <div onClick={()=>setOpen(!open)} style={{whiteSpace: "nowrap"}} className={`flex ${isAddPanel?"py-1 px-2":"p-2"} items-center country-select`}>
            {country.substring(0,7)} &nbsp; <svg style={{transform:"rotate(90deg)"}} xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                <path d="M0.589966 10.59L5.16997 6L0.589966 1.41L1.99997 0L7.99997 6L1.99997 12L0.589966 10.59Z" fill="#08392B"/>
            </svg>
        </div>
        {open && <div ref={containerRef} className={`container-menu shadow`}>
            { <div>
                    <div className="p-1">
                        <input value={value} onChange={(e)=>{handleChange(e.target.value)}} placeholder="Search" />
                    </div>
                    {
                        data.length > 0 && data.map((e,idx)=>(<div onClick={()=>select(e)} className="p-1 shadow cursor-pointer li-country" key={`countries_${e.name}_${idx}`}>
                            {e?.translations?.[i18n.language]?.name || ""}
                        </div>))
                    }
            </div> }
            {loading && <div className="w-full p-2  bg-gray-100 animate-pulse" >
                    ...Loading
                </div> }
            {!hasMore && (
                <div className="text-center text-sm text-gray-500 p-2">
                No more countries
                </div>
            )}

        </div>}
    </div>)
}
export default Countries