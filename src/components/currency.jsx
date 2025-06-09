import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const Currency = ()=>{
    const data = [
        { name: "US Dollar", symbol: "$", code: "USD" },
        { name: "Euro", symbol: "€", code: "EUR" },
        { name: "British Pound Sterling", symbol: "£", code: "GBP" },
        { name: "Japanese Yen", symbol: "¥", code: "JPY" },
        { name: "Chinese Yuan Renminbi", symbol: "¥", code: "CNY" },
        { name: "Canadian Dollar", symbol: "C$", code: "CAD" },
        { name: "Australian Dollar", symbol: "A$", code: "AUD" },
        { name: "Swiss Franc", symbol: "CHF", code: "CHF" },
        { name: "Indian Rupee", symbol: "₹", code: "INR" },
        { name: "Turkish Lira", symbol: "₺", code: "TRY" },
        { name: "Russian Ruble", symbol: "₽", code: "RUB" },
        { name: "UAE Dirham", symbol: "د.إ", code: "AED" },
        { name: "Saudi Riyal", symbol: "ر.س", code: "SAR" },
        { name: "Pakistani Rupee", symbol: "₨", code: "PKR" },
        { name: "Egyptian Pound", symbol: "E£", code: "EGP" },
        { name: "South Korean Won", symbol: "₩", code: "KRW" },
        { name: "Brazilian Real", symbol: "R$", code: "BRL" },
        { name: "South African Rand", symbol: "R", code: "ZAR" },
        { name: "Singapore Dollar", symbol: "S$", code: "SGD" },
        { name: "Malaysian Ringgit", symbol: "RM", code: "MYR" }
        ];
    const [ currentCurrency, setCurrentCurrency ] = useState(data[0])
    const [ isOpen, setIsOpen ] = useState(false)
    const select = (currency)=>{
        setCurrentCurrency(currency)
        setIsOpen(false)
    }
    const { i18n } = useTranslation()
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
    return(<div ref={menuRef} className="flex items-center gap-2 cursor-pointer currency">
            <span onClick={()=>setIsOpen(!isOpen)}>{currentCurrency.code}</span>
            <div onClick={()=>setIsOpen(!isOpen)} className="arrow-currency">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M0.590088 10.59L5.17009 6L0.590088 1.41L2.00009 0L8.00009 6L2.00009 12L0.590088 10.59Z" fill="white"/>
                </svg>
            </div>
           { isOpen && <div className={`currency_menu ${(i18n.language == "ar" || i18n.language == "ur")?"left-0":"right-0"} p-3`}>
                {data.map((e,idx)=>(<div onClick={()=>select(e)} className="select_currency" key={`Currency_Navbar_${e.name}_${idx}`}>{e.code} &nbsp; ({e.symbol})</div>))}
            </div>}
        </div>)
}

export default Currency