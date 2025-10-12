import { useEffect, useState } from "react"
import { apiRoutes } from "../functionality/apiRoutes"
import { Helper } from "../functionality/helper"
import { useTranslation } from "react-i18next"

const Periods =({price,returnedSelected})=>{
    const [ data, setData ] = useState([])
    const [isloading, setIsLoading ] = useState(false)
    const { t,i18n } = useTranslation()
    const [selectedId, setSelectedId] = useState();
    useEffect(()=>{
        const abortController = new AbortController()
        const signal  = abortController.signal
        getData(signal)
        setIsLoading(true)
        return () => abortController.abort() 
    },[])
    const getData = async (signal)=>{
        const { response , message, statusCode } = await Helper({
            url : apiRoutes.payment_periods.list,
            signal : signal,
            method : "GET",
            hasToken : true
        })
        if(response){
            setData(response.data)
            setIsLoading(false)
            const week = response.data.find(e=> e.id == 3)
            returnedSelected(week)
            setSelectedId(week.id)
        }else{
            console.log(message);  
        }
    }
    return isloading ? <div className="pricing-table-container ">
  <table className="pricing-table period">
    <thead>
      <tr>
        <th>Period</th>
        <th>Total Price</th>
        <th>Discount</th>
        <th>Final Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
      </tr>
      <tr>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
      </tr>
      <tr>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
        <td><span className="skeleton-box"></span></td>
      </tr>
    </tbody>
  </table>
</div>:<div className="pricing-table-container ">
  <table className="pricing-table">
    <thead>
      <tr>
        <th>Period</th>
        <th>Total Price</th>
        <th>Discount</th>
        <th>Final Price</th>
      </tr>
    </thead>
    <tbody>
      {data.map((e,idx)=>(<tr
            onClick={() => {
                setSelectedId(e.id)
                returnedSelected(e)
            }}
            className={selectedId==e.id ? "selected-row" : "cursor-pointer"}
            key={`Table_For_Period_${idx}`}>
        <td>{e.name}</td>
        <td>{price*e.factor}</td>
        <td><span className="offer">({Math.floor((1-e.discount)*100)}%)</span></td>
        <td>{(price*e.factor*e.discount).toFixed(2)}</td>
      </tr>))}
    </tbody>
  </table>
</div>

}
export default Periods