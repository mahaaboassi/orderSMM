// import { useEffect, useState } from "react"



// const Pagination = ({currentPage, lastPage,returnedPageNumber})=>{
//     const [currentNumber, setCurrentNumber] = useState(1)
//     const [final,setFinal ] = useState(1)
//     const changeNumber = (value)=>{
//         setCurrentNumber(value)
//         returnedPageNumber(value)
//     }
//     useEffect(()=>{setCurrentNumber(currentPage)},[currentPage])
//     useEffect(()=>{setFinal(lastPage)},[lastPage])
//     console.log(lastPage,currentPage);
    
//     return(<div>
//         <div style={{width:"fit-content"}} className="flex gap-2 card p-2 container-pagination">

//             <div onClick={()=>changeNumber(1)} className={`num ${currentNumber == 1 ? "active": ""}`}>
//                 1
//             </div>
//             {currentNumber < 5 && final > 5 && <div  className="flex gap-2">
//                 {[2,3,4,5].map((e)=>(<div key={`First_Ordinary_${e}`} onClick={()=>changeNumber(e)} className={`num ${currentNumber == e?"active":""}`}>{e}</div>))}
//                 <div>..</div> 
//             </div>}
//             {currentNumber >= 5 && currentNumber < final-4 && <div className="flex gap-2">
//                 <div>..</div>
//                 {[currentNumber-2,currentNumber-1,currentNumber,currentNumber+1,currentNumber+2]
//                 .map((e)=>(<div key={`Middle_Ordinary_${e}`} onClick={()=>changeNumber(e)} className={`num ${currentNumber == e ? "active" : ""}`}>{e}</div>))}
//                 <div>..</div> 
//             </div>}
//             { currentNumber >= final-4 && <div className="flex gap-2">
//                 <div>..</div>
//                 {[final-4,final-3,final-2,final-1,]
//                 .map((e)=>(<div key={`Final_Ordinary_${e}`} onClick={()=>changeNumber(e)} className={`num ${currentNumber == e ? "active" : ""}`}>{e}</div>))}
//             </div>}
//             <div onClick={()=>changeNumber(final)} className={`num ${currentNumber == final ? "active": ""}`}>{final}</div>
            

//         </div>

//     </div>)
// }
// export default Pagination


import { useEffect, useState } from "react";

const Pagination = ({ currentPage, lastPage, returnedPageNumber }) => {
  const [currentNumber, setCurrentNumber] = useState(1);

  useEffect(() => {
    setCurrentNumber(currentPage);
  }, [currentPage]);

  const changeNumber = (value) => {
    setCurrentNumber(value);
    returnedPageNumber(value);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible + 2) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentNumber > 3) pages.push("...");

      const start = Math.max(2, currentNumber - 1);
      const end = Math.min(lastPage - 1, currentNumber + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentNumber < lastPage - 2) pages.push("...");
      pages.push(lastPage);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div>
      <div style={{ width: "fit-content" }} className="flex gap-2 card p-2 container-pagination">
        {pages.map((page, index) => (
          <div
            key={`page-${index}`}
            onClick={() => typeof page === "number" && changeNumber(page)}
            className={`num ${currentNumber === page ? "active" : ""} ${page === "..." ? "pointer-events-none opacity-50" : ""}`}
          >
            {page}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
