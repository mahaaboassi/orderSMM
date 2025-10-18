import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

const Prices =({prices, type })=>{
  console.log(type );
  
    const { t,i18n } = useTranslation()
    return <div className="pricing-table-container ">
    <table className="pricing-table">
    <thead>
      {type == "bumps" && <tr>
        <th>Count</th>
        <th>Price per Bump</th>
        <th>Total Price</th>
        <th>Discount</th>
        <th>Final Price</th>
      </tr>}
      {type == "promotion" && <tr>
        <th>Service</th>
        <th>Total Price</th>
        <th>Discount</th>
        <th>Final Price</th>
      </tr>}
      {type == "ads" && <tr>
        <th>Count</th>
        <th>Total Price</th>
        <th>Discount</th>
        <th>Final Price</th>
      </tr>}
      
    </thead>
    <tbody>
      {prices.map((e,idx)=>{
        if(type == "bumps"){
            return(<tr key={`Table_For_Prices_${idx}`}>
                  <td>{e.max}</td>
                  <td>{parseFloat(e.price).toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}
                    {/* &nbsp;- <span className="offer">({Math.ceil(((basicPrice-e.price)/basicPrice)*100)}%)</span> */}
                  </td>
                  <td>{parseFloat(e.price* e.max).toFixed(2).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}</td>
                  <td> {e.discount ?? 0}%</td>
                  <td>{parseFloat(e.price*e.max*(1-(e.discount?? 0 )*0.01)).toFixed(2).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}</td>
                </tr>)
        }
        if(type == "promotion" || type == "ads" ){
          return (<tr key={`Table_For_Prices_${idx}`}>
            <td>{type == "ads" ? e.max : e.name}</td>
            <td>{parseFloat(e.price).toFixed(3).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}</td>
            <td> {e.discount ?? 0}%</td>
            <td>{parseFloat(e.price*(1-(e.discount?? 0 )*0.01)).toFixed(2).replace(/(\.\d*?[1-9])0+$|\.0+$/, '$1')}</td>
        </tr>)
        }
      })}
    </tbody>
  </table>
</div>

}
export default Prices