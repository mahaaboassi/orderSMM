import { useTranslation } from "react-i18next"
import img from "../../../assets/images/smm.png"
const About = ()=>{
    const { t, i18n } = useTranslation()
    return(<div className="px-2 lg:px-16 about flex flex-col gap-5">
        <h1>{t("about.basic-title")}</h1>
        <div className=" flex flex-col-reverse gap-5 md:grid md:grid-cols-2">
            <div className="flex flex-col gap-2 ">
                <h3>{t("about.sub-title")}</h3>
                <div className="">
                    <p>{t("about.paraghraph-1")}</p>
                    <p>{t("about.paraghraph-2")}</p>
                    <p>{t("about.paraghraph-3")}</p>
                    <p>{t("about.paraghraph-4")}</p>
                </div>
                <div>
                    <p><strong>{t("about.paraghraph-5")}</strong></p>  
                    <ul>
                        <li className={`${(i18n.language == "ar" || i18n.language == "ur" )?"pr-4 right-menu":"pl-4 left-menu"}`}>{t("about.paraghraph-6")}</li>
                        <li className={`${(i18n.language == "ar" || i18n.language == "ur" )?"pr-4 right-menu":"pl-4 left-menu"}`}>{t("about.paraghraph-7")}</li>
                    </ul>  
                </div> 
                <p>{t("about.paraghraph-8")}</p>                   

            </div>
            <div className="flex justify-center md:justify-start">
                <img className="h-[250px] md:h-full" src={img} alt="SMM" />
            </div>
        </div>

    </div>)
}
export default About