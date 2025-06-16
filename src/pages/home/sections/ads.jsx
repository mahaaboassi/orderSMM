import { useTranslation } from "react-i18next"
import { adsImages } from "../../../data/data"
import { useNavigate } from "react-router-dom"

const Ads = ()=>{
    const { t } = useTranslation()
    const navigate = useNavigate()
    return(<div className="px-2  lg:px-16 py-20 ">
        <h2 className="text-center pb-10">{t("featuredSMMPanels")}</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10">
            {
                adsImages.map((e,idx)=>(<div  key={`Ads_${idx}`}>
                <div className="card-imge "><img src={e} alt={`Image_${idx}`} />
                    <div onClick={()=>navigate("/smm-panel/panel")} className="goddy p-3 flex flex-col items-center gap-1"> 
                        <div className="flex justify-between gap-2 goddy-info">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 8 7" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M0.280232 2.94048H1.63768C1.71178 2.94081 1.78273 2.96894 1.83501 3.01873C1.88728 3.06852 1.91663 3.13591 1.91663 3.20616V6.73432C1.9163 6.80448 1.88684 6.87168 1.83464 6.92141C1.78243 6.97113 1.71168 6.99936 1.63768 7H0.280232C0.206014 6.99968 0.134932 6.97159 0.0824517 6.92183C0.0299712 6.87208 0.000338128 6.80469 0 6.73432V3.20616C0.000338128 3.1358 0.0299712 3.06841 0.0824517 3.01865C0.134932 2.9689 0.206014 2.9408 0.280232 2.94048ZM3.84097 0.294667C3.98752 -0.414621 5.21128 0.238607 5.29226 1.38054C5.31034 1.78646 5.27537 2.19294 5.18814 2.59071H6.93766C7.66395 2.61874 8.29897 3.11232 7.85034 3.92276C7.95318 4.27619 7.9686 4.69055 7.69094 4.85507C7.72565 5.41202 7.5624 5.75814 7.25774 6.03113C7.25194 6.28533 7.17281 6.53316 7.02893 6.74773C6.79369 7.06215 6.60344 6.99147 6.23322 6.99147H3.27665C2.80874 6.99147 2.55422 6.8696 2.24828 6.50399V3.38044C3.13654 3.15741 3.60445 2.01548 3.84097 1.26598V0.291011V0.294667Z" fill="white"/>
                                </svg>
                                &nbsp; 10
                            </div>
                            <div>|</div>
                            <div className="flex"> 7512 &nbsp; Services</div>
                        </div>
                        {t("viewDetails")}
                    </div>
                </div>
            </div>))
            }

        </div>
        
    </div>)
}
export default Ads