import { adsImages } from "../../../data/data"

const Ads = ()=>{

    return(<div className="px-2  lg:px-16 py-20 ">
        <h2 className="text-center pb-10">Featured SMM Panels</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10">
            {
                adsImages.map((e,idx)=>(<div  key={`Ads_${idx}`}>
                <div className="card-imge "><img src={e} alt={`Image_${idx}`} />
                    <div className="goddy p-4"> View details </div>
                </div>
            </div>))
            }

        </div>
        
    </div>)
}
export default Ads