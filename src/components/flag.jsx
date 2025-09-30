import { useEffect, useRef, useState } from "react"
import arabic_flag  from "../assets/images/flags/arabic.webp"
import english_flag  from "../assets/images/flags/english.webp"
import hindi_flag  from "../assets/images/flags/hindi.webp"
import pakistan_flag  from "../assets/images/flags/pakistan.webp"
import russsia_flag  from "../assets/images/flags/russia.webp"
import turkia_flag  from "../assets/images/flags/turkia.webp"
import { useTranslation } from "react-i18next"


const Flag = ()=>{
    const data = [
    {
        name: "English",
        flag: english_flag,
        id: 1,
        lng: "en"
    },
    {
        name: "Türkçe",
        flag: turkia_flag,
        id: 2,
        lng: "tr"
    },
    {
        name: "Русский",
        flag: russsia_flag,
        id: 3,
        lng: "ru"
    },
    {
        name: "हिन्दी",
        flag: hindi_flag,
        id: 4,
        lng: "hi"
    },
    {
        name: "اُردُو", // More accurate than "Pakistan"
        flag: pakistan_flag,
        id: 5,
        lng: "ur"
    },
    {
        name: "العربية",
        flag: arabic_flag,
        id: 6,
        lng: "ar"
    }
    ];
    const { i18n } = useTranslation()
    const [ currectLanguage, setCurrectLanguage ] = useState(() => data.find(e => e.lng === i18n.language) || data[0])
    const [ isOpen, setIsOpen ] = useState(false)
    const handleLanguage = (lang)=>{
        i18n.changeLanguage(lang.lng)
        setCurrectLanguage(lang)
        setIsOpen(false)
    }
    const menuRef = useRef(null);
    useEffect(() => {
        const lang = data.find(e => e.lng === i18n.language)
        console.log(lang);
        
        if (lang) setCurrectLanguage(lang)
    }, [i18n.language])
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
    return( currectLanguage && "flag" in currectLanguage && <div ref={menuRef} className={`flag-container ${ (i18n.language == "ar" || i18n.language == "ur")? "border-left":"border-right"} flex items-center gap-2 cursor-pointer`}>
            <span onClick={()=>setIsOpen(!isOpen)}>{currectLanguage.lng}</span>
            <div onClick={()=>setIsOpen(!isOpen)} className="arrow-currency">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M0.590088 10.59L5.17009 6L0.590088 1.41L2.00009 0L8.00009 6L2.00009 12L0.590088 10.59Z" fill="white"/>
                </svg>
            </div>
            {/* <img onClick={()=>setIsOpen(!isOpen)} className="w-8 cursor-pointer" src={currectLanguage.flag} alt={currectLanguage.name} /> */}
            {isOpen && <div className={`menu-flag p-3 flex flex-col gap-2 ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"}`}>
                {data.map((ele,idx)=>(<div onClick={()=>handleLanguage(ele)} className="flex gap-2 select-flag" key={`Flag_Navbar_${ele.name}_${idx}`}>
                    <div><img className="" src={ele.flag} alt={ele.name} /></div>
                    <div>{ele.name}</div>
                </div>))}
            </div>}
        </div>)
}
export default Flag