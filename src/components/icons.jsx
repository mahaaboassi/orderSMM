import { social } from "../data/data"

const Icons = ()=>{
    return(<div className="icons-card shadow bg-white px-2 py-2">
            {social.map((e,idx)=>(<div key={`Icons_Social_Media_${e.title}_${idx}`}>
                <img style={{
                    animationDelay: `${idx*0.3}s`
                }} src={e.image}  alt={e.title} />
            </div>))}
    </div>)
}
export default Icons