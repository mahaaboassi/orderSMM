import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"


const Dropdown = ({data,defaultOption,returnedOption=()=>{}})=>{
    const { t, i18n } = useTranslation()
    const [ isOpen, setIsOpen ] = useState(false)
    const [ option, setOption] = useState(data[0])
    const menuRef = useRef(null);
    useEffect(()=>{setOption(defaultOption)},[defaultOption])
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

    const handleSelected = (e)=>{
        setIsOpen(false)
        console.log(e,e.label);
        
        setOption(e)
        returnedOption(e)
    }
    return(  <div ref={menuRef} className="dropdown">
            <div onClick={()=>setIsOpen(!isOpen)} className="cursor-pointer items-center flex justify-between px-2 py-1">
               <div>{option.label} </div>
               <div>
                    <svg style={{transform:"rotate(90deg)"}} xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                        <path d="M0.590088 10.59L5.17009 6L0.590088 1.41L2.00009 0L8.00009 6L2.00009 12L0.590088 10.59Z" fill="#08392B"/>
                    </svg>
               </div>
            </div>
            {isOpen && <div  className={`menu-dropdown top-9  ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"}`}>
                {data.map((e,idx)=>(<div onClick={()=>handleSelected(e)} className={`option-dropdown p-1 ${e.value == option.value?"active":""}`} key={`Dropdown_${e.label}_${idx}`}>
                    {e.label}
                </div>))}
            </div>}
        </div>)
}
export default Dropdown 