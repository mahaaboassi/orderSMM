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
    return (<div  className={`card card-services flex  ${selected?"!bg-zinc-200":""} flex-col gap-2 justify-between   p-4 ${isPinned ?"card-pin":""}`}>
            <div className="flex justify-between">
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