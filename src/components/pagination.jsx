import { useState } from "react"

const Pagination = ()=>{
    const final = 2000
    const [currentNumber, setCurrentNumber] = useState(1)

    const changeNumber = (value)=>{
        setCurrentNumber(value)
    }
    return(<div>
        <div style={{width:"fit-content"}} className="flex gap-2 card p-2 container-pagination">

            <div onClick={()=>changeNumber(1)} className={`num ${currentNumber == 1 ? "active": ""}`}>
                1
            </div>
            {currentNumber < 5 && <div  className="flex gap-2">
                {[2,3,4,5].map((e)=>(<div key={`First_Ordinary_${e}`} onClick={()=>changeNumber(e)} className={`num ${currentNumber == e?"active":""}`}>{e}</div>))}
                <div>..</div> 
            </div>}
            {currentNumber >= 5 && currentNumber < final-4 && <div className="flex gap-2">
                <div>..</div>
                {[currentNumber-2,currentNumber-1,currentNumber,currentNumber+1,currentNumber+2]
                .map((e)=>(<div key={`Middle_Ordinary_${e}`} onClick={()=>changeNumber(e)} className={`num ${currentNumber == e ? "active" : ""}`}>{e}</div>))}
                <div>..</div> 
            </div>}
            { currentNumber >= final-4 && <div className="flex gap-2">
                <div>..</div>
                {[final-4,final-3,final-2,final-1,]
                .map((e)=>(<div key={`Final_Ordinary_${e}`} onClick={()=>changeNumber(e)} className={`num ${currentNumber == e ? "active" : ""}`}>{e}</div>))}
            </div>}
            <div onClick={()=>changeNumber(final)} className={`num ${currentNumber == final ? "active": ""}`}>{final}</div>
            

        </div>

    </div>)
}
export default Pagination