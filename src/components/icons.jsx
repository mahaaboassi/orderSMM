import { useTranslation } from "react-i18next"
import { social } from "../data/data"

const Icons = ()=>{
    const { t } = useTranslation()
    return(<div className="icons-card shadow bg-white px-2 py-2">
            {social.map((e,idx)=>(<div className="specific-card" key={`Icons_Social_Media_${e.title}_${idx}`}>
                <p className="p-2 shadow">{t(e.hint)}</p>
                <img style={{
                    animationDelay: `${idx*0.3}s`
                }} src={e.image}  alt={e.title} />
            </div>))}
    </div>)
}
export default Icons