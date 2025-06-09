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
    const [ currectLanguage, setCurrectLanguage ] = useState(data[0])
    const [ isOpen, setIsOpen ] = useState(false)
    const handleLanguage = (lang)=>{
        i18n.changeLanguage(lang.lng)
        setCurrectLanguage(lang)
        setIsOpen(false)
    }
    const menuRef = useRef(null);
    useEffect(()=>{setCurrectLanguage(data.find(e=> e.lng == i18n.language))},[])
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
    return( <div ref={menuRef} className="flag-container">
            <img onClick={()=>setIsOpen(!isOpen)} className="w-8 cursor-pointer" src={( currectLanguage && "flag" in currectLanguage)? currectLanguage.flag:""} alt={currectLanguage.name} />
            {isOpen && <div className={`menu-flag p-3 flex flex-col gap-2 ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"}`}>
                {data.map((ele,idx)=>(<div onClick={()=>handleLanguage(ele)} className="flex gap-2 select-flag" key={`Flag_Navbar_${ele.name}_${idx}`}>
                    <div><img className="" src={ele.flag} alt={ele.name} /></div>
                    <div>{ele.name}</div>
                </div>))}
            </div>}
        </div>)
}
export default Flag