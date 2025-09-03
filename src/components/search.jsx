import { useEffect, useState } from "react"

const SearchInput = ({onChange,onEnter,value,type,placeholder})=>{
    const search_icon = <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 39 39" fill="none">
            <g clipPath="url(#clip0_84_268)">
            <path d="M16.7143 32.0357C25.1761 32.0357 32.0357 25.1761 32.0357 16.7143C32.0357 8.25245 25.1761 1.39282 16.7143 1.39282C8.25245 1.39282 1.39282 8.25245 1.39282 16.7143C1.39282 25.1761 8.25245 32.0357 16.7143 32.0357Z" stroke="#08392B" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M37.6071 37.6071L27.8571 27.8571" stroke="#08392B" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_84_268">
            <rect width="39" height="39" fill="white"/>
            </clipPath>
            </defs>
            </svg>
    const [ valueInput , setValueInput ] = useState("")
    useEffect(()=>{setValueInput(value)},[value])
    return(<div className="input-search w-full">
                <div className="search-icon">{search_icon}</div>
                <input placeholder={placeholder ?? "TikTok follower"} type={type ?? "text"} value={valueInput} onChange={(e)=>{
                    onChange(e.target.value)
                    setValueInput(e.target.value)
                }}
                onKeyDown={(e)=>{if (e.key === 'Enter') {onEnter()}}}
                className="w-full" />
                {/* <div className="btn-search">Search</div> */}
            </div>)
}
export default SearchInput