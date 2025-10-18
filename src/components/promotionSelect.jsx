import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Dropdown from "./DropDownComponent";

const PromotionSelect =({prices,returnedSelected})=>{
    const { t,i18n } = useTranslation()
    const [selectedId, setSelectedId] = useState({});
    const values = prices.map(e=>e.max)
    const maxValue = prices.find(e=>e.max == Math.max(...values))
    useEffect(()=>{
        returnedSelected(maxValue)
    },[])
   
    return <div className="pricing-table-container period ">
      <Dropdown data={prices.map(e=>({
          ...e,
          label: e.name,
          value: e.id
        }))} count={true} defaultOption={{ ...maxValue,
          label: maxValue.name,
          value: maxValue.id
        }}  
        selected={Object.keys(selectedId).length>0 ? selectedId : null}
        returnedOption={(res)=>{
          setSelectedId(res)
          returnedSelected(res)
      }} />
</div>

}
export default PromotionSelect