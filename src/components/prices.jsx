import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const Prices =({prices,basicPrice,isBump})=>{
    const { t,i18n } = useTranslation()
    return <div className="pricing-table-container ">
    <table className="pricing-table">
    <thead>
        {isBump?<tr>
        <th>Count</th>
        <th>Price per Bump</th>
        <th>Final Price</th>
      </tr>:<tr>
        <th>Min</th>
        <th>Max</th>
        <th>Final Price</th>
      </tr>}
      
    </thead>
    <tbody>
      {prices.map((e,idx)=>{
        if(isBump){
            return<tr key={`Table_For_Prices_${idx}`}>
        <td>{e.max}</td>
        <td>{e.price}
            &nbsp;- <span className="offer">({Math.floor(((basicPrice-e.price)/basicPrice)*100)}%)</span></td>
        <td>{e.price*e.max}</td>
      </tr>
        }else{
            return<tr key={`Table_For_Prices_${idx}`}>
            <td>{e.min}</td>
            <td>{e.max}</td>
            <td>{e.price}
                &nbsp;- <span className="offer">({Math.floor(((basicPrice-e.price)/basicPrice)*100)}%)</span>
            </td>
        </tr>
            }
      })}
    </tbody>
  </table>
</div>

}
export default Prices