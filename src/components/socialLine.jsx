import { useNavigate } from "react-router-dom"

const SocialLine = ()=>{
    const icons = [{
        name : "Facebook",
    },{
        name : "Instagram",
    },{
        name : "Twitter",
    },{
        name : "Tiktok",
    },{
        name : "Pintreset",
    },{
        name : "Linkedin",
    },{
        name : "Telegram",
    },{
        name : "Bottem",
    },{
        name : "Snapchat",
    },{
        name : "Spotify",
    },{
        name : "Youtube",
    },{
        name : "Google Play",
    },{
        name : "Anghami",
    },{
        name : "iOS App store",
    },{
        name : "Twitch",
    }]
    const navigate = useNavigate()
    return(<div style={{overflow:"hidden"}} className="flex gap-2 md:gap-5">
                    {icons.map((e,idx)=>(<div  className="flex gap-1 items-center icons-hero" key={`Icons_Before_Search_${e.title}_${idx}`}>
                        <div onClick={()=>navigate(`/services?keywords=${e.name}`)} className="cursor-pointer" style={{whiteSpace: "nowrap",fontWeight:"600"}}>{e.name}</div>
                    </div>))}
                </div>)
}

export default SocialLine