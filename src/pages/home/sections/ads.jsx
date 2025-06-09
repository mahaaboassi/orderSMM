import { useTranslation } from "react-i18next"
import { adsImages } from "../../../data/data"

const Ads = ()=>{
    const { t } = useTranslation()
    return(<div className="px-2  lg:px-16 py-20 ">
        <h2 className="text-center pb-10">{t("featuredSMMPanels")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10">
            {
                adsImages.map((e,idx)=>(<div  key={`Ads_${idx}`}>
                <div className="card-imge "><img src={e} alt={`Image_${idx}`} />
                    <div className="goddy p-4"> {t("viewDetails")}</div>
                </div>
            </div>))
            }

        </div>
        
    </div>)
}
export default Ads