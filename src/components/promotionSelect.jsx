import { useEffect, useState } from "react"
import { apiRoutes } from "../functionality/apiRoutes"
import { Helper } from "../functionality/helper"
import { useTranslation } from "react-i18next"

const PromotionSelect =({prices,returnedSelected})=>{
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const { t,i18n } = useTranslation()
    const [selectedId, setSelectedId] = useState();
    useEffect(()=>{
        
        console.log(prices);
        const values = prices.map(e=>e.max)
        const maxValue = prices.find(e=>e.max == Math.max(...values))
        setSelectedId(maxValue.id)
        returnedSelected(maxValue)
    },[])
   
    return isloading ? <div className="pricing-table-container ">
  <table className="pricing-table ">
    <thead>
      <tr>
        <th>Services</th>
        <th>Final Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
      </tr>
      <tr>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
      </tr>
      <tr>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
      </tr>
    </tbody>
  </table>
</div>:<div className="pricing-table-container period ">
  <table className="pricing-table">
    <thead>
      <tr>
        <th>Services</th>
        <th>Final Price</th>
      </tr>
    </thead>
    <tbody>
      {prices.map((e,idx)=>(<tr
            onClick={() => {
                setSelectedId(e.id)
                returnedSelected(e)
            }}
            className={selectedId ==e.id ? "selected-row " : "cursor-pointer"}
            key={`Table_For_Period_${idx}`}>
        <td>{e.name}</td>
        <td>
          {e.price}
        </td>
      </tr>))}
    </tbody>
  </table>
</div>

}
export default PromotionSelect