import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


const Service = ({name, category, panel,panel_id, min , max , price, per_count, isPinned,
    isForSelected = false , isSelectedAll = false, returnedId = () => {} ,id,selectedObject =[]
})=>{
    const [selected, setSelected] = useState(false)
    const [selectedProccess, setSelectedProccess] = useState(false)
    const [selectedAll, setSelectedAll] = useState(false)
    useEffect(()=>{
        setSelected(isSelectedAll)
        setSelectedAll(isSelectedAll)
    },[isSelectedAll])
    useEffect(()=>{setSelectedProccess(isForSelected)},[isForSelected])
    useEffect(()=>{
        const isExist = selectedObject.find(e=>e==id)
        if(isExist) setSelected(true)
    },[selectedObject])
    const handleSelected = (e)=>{
            if(e.target.checked){
                returnedId(id,"select")
            }else{
                returnedId(id,"unselect")
            } 
    }
    return (<div className={`card card-services flex  ${selected?"!bg-zinc-200":""} flex-col gap-2 justify-between   p-4 ${isPinned ?"card-pin":""}`}>
            <div className="flex">
                {isPinned && <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 38 39" fill="none">
                        <g clipPath="url(#clip0_297_6)">
                        <path d="M8.33167 15.2127C8.34404 15.2238 8.3561 15.2354 8.36786 15.2474L14.9037 21.4324C15.1366 21.6528 15.217 21.9775 15.1406 22.2704H15.1412C14.5815 24.404 14.143 26.6969 14.3084 28.8207C14.4606 30.7773 15.1357 32.6079 16.7351 34.0509L22.4134 28.2683C22.71 27.9663 23.1745 27.9399 23.5004 28.1887L34.598 35.2013L27.6728 23.8365C27.4662 23.4967 27.5253 23.0659 27.7918 22.795L27.7897 22.7928L33.468 17.0106C32.0511 15.3819 30.2534 14.6947 28.3321 14.5398C26.2465 14.3713 23.9949 14.8182 21.8995 15.3875C21.5998 15.4691 21.2946 15.373 21.0914 15.1624L14.566 8.97704C14.5469 8.95877 14.5286 8.93988 14.5113 8.92004L8.33167 15.2127ZM0.368001 13.402L12.5034 1.04392L12.5065 1.04707C12.513 1.04045 12.5198 1.03384 12.5263 1.02754C12.7755 0.789779 13.0814 0.666016 13.3934 0.666016C13.7098 0.666016 14.019 0.789149 14.271 1.04392L17.8768 4.68721C18.1165 4.92939 18.2272 5.261 18.2272 5.57875C18.2272 5.88989 18.1159 6.22181 17.9124 6.45422L16.2938 8.30343L21.9159 13.6331C24.0354 13.0814 26.2991 12.6764 28.462 12.8509C30.8688 13.0452 33.1275 13.9461 34.9011 16.1188L34.9057 16.1244L34.9066 16.1235C34.9045 16.1194 34.902 16.1147 34.9088 16.1213C34.957 16.1682 34.9307 16.1389 34.97 16.1789C35.0501 16.2605 35.12 16.3392 35.1785 16.4138C35.3312 16.6097 35.4101 16.8157 35.4101 17.0292C35.4101 17.2301 35.3303 17.448 35.1741 17.648C35.1348 17.6981 35.0823 17.7589 35.017 17.8275C35.0022 17.8455 34.9864 17.8628 34.97 17.8798L29.4321 23.519L37.867 37.3622C38.0353 37.6277 38.0498 37.9785 37.876 38.2648C37.6354 38.6619 37.1239 38.7847 36.7346 38.5397L23.1259 29.9409L17.588 35.5808L17.5864 35.5792C17.498 35.6689 17.4216 35.7392 17.361 35.7883C17.164 35.9476 16.9494 36.0289 16.7527 36.0289C16.5427 36.0289 16.3408 35.9486 16.1485 35.793C16.0752 35.7338 15.9979 35.6623 15.9174 35.5808C15.8785 35.5411 15.9069 35.5675 15.8609 35.5184C15.8556 35.5127 15.8658 35.5203 15.8584 35.514L15.8599 35.5121L15.8584 35.5105C13.7249 33.7042 12.8402 31.404 12.6493 28.9533C12.479 26.7643 12.8708 24.4736 13.4076 22.3271L7.7707 16.9927L5.68423 18.9071C5.4557 19.1171 5.1279 19.2276 4.82329 19.2276C4.51003 19.2276 4.17944 19.1136 3.94596 18.874L0.368001 15.202C0.125244 14.9526 0 14.6279 0 14.3023C0 13.9779 0.120605 13.6542 0.368001 13.402ZM34.906 16.1238C34.9106 16.1288 34.9088 16.126 34.9069 16.1229L34.906 16.1238Z" fill="#e53909ff"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_297_6">
                        <rect width="38" height="38" fill="white" transform="translate(0 0.666016)"/>
                        </clipPath>
                        </defs>
                    </svg>
                </div>} 
            </div>
            {!isPinned && <div>
                <strong>{id}</strong>
            </div>}
            <div className="flex justify-between ">
                <h3><strong>{name}</strong></h3>
                <span>{category}</span>
            </div>
            <div className="flex card-small-details justify-between">
                <div className="flex gap-2">
                        <h4><Link to={`/smm-panel/${panel}/${panel_id}`}>{panel}</Link></h4> 
                        <p>{min} /{max}</p>
                </div>
                
                <span><strong>{price} </strong>/ {per_count}</span>
                
            </div>
            
            {selectedProccess && !selectedAll && <div className="flex justify-end">
                <input checked={selected} onChange={handleSelected} type="checkbox" />
            </div>}
        </div>)
}
export default Service