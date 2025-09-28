import { useEffect, useState } from "react"

const SwitchComponent = ({status, nonLabel, label, returnValue}) => {
    const [ active, setActive ] = useState(0)
    useEffect(()=>setActive(status),[])
    return(<div className='flex gap-2'>
            <div
                onClick={() => {
                    returnValue(active == 1 ? 0 : 1 )
                    setActive(active == 1 ? 0 : 1 )
                    }}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                active == 0 ? "bg-green-500" : "bg-gray-300"
                }`}
            >
                <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    active == 0 ? "translate-x-6" : "translate-x-0"
                }`}
                />
            </div>
            <span>{active == 0 ? label : nonLabel}</span>
        </div>)
}
export default SwitchComponent