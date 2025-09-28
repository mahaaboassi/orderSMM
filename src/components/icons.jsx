import { useTranslation } from "react-i18next"
// Social Icons
import social_1 from "../assets/images/social_1.png"
import social_2 from "../assets/images/social_2.png"
import social_3 from "../assets/images/social_3.png"
import social_4 from "../assets/images/social_4.png"
import social_5 from "../assets/images/social_5.png"
import social_6 from "../assets/images/social_6.png"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { socialStatus } from "../features/social"
const Icons = ()=>{
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [ social, setSocial ] = useState([{
            image : social_1,
            title : "social_1",
            link : "",
            key : "facebook",
            hint : "joinOurChannel"
        },{
            image : social_2,
            title : "social_2",
            link : "",
            key : "whatsapp",
            hint : "joinOurGroup"
        },{
            image : social_3,
            title : "social_3",
            link : "",
            key : "tiktok",
            hint : "joinOurChannel"
        },{
            image : social_4,
            title : "social_4",
            link : "",
            key : "instagram",
            hint : "joinOurChannel"
        },{
            image : social_5,
            title : "social_5",
            link : "",
            key : "telegram",
            hint : "joinOurGroup"
        },{
            image : social_6,
            title : "social_6",
            link : "",
            key : "skybe",
            hint : "joinOurGroup"
        }])
    const settings = useSelector(state => state.settings)
    useEffect(()=>{
        const temp = [...social]
        const socialObj = {}
        temp.forEach((e,i)=>{
            e.link = settings[e.key]
            if(e.key == "telegram") socialObj.telegram = e.link
            if(e.key == "whatsapp") socialObj.whatsapp = e.link
        })
        setSocial(temp)
        dispatch(socialStatus(socialObj))
        
    },[settings])
    return(<div className="icons-card shadow bg-white px-2 py-2">
            {social.map((e,idx)=>{
                if(e.link) return <div className="specific-card" key={`Icons_Social_Media_${e.title}_${idx}`}>
                <Link target="_blank" to={e.link}>
                    <p className="p-2 shadow">{t(e.hint)}</p>
                    <img style={{
                        animationDelay: `${idx*0.3}s`
                    }} src={e.image}  alt={e.title} />
                </Link>
            </div>
            })}
    </div>)
}
export default Icons