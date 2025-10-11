import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

const CardBumps = ({id,logo,rating,name})=>{
    const { t, i18n } = useTranslation()
    return(<div className="flex card-panals border-[var(--green_2)] p-4 justify-between items-center"
                style={(i18n.language == "ar" || i18n.language == "ur")?{borderRight:"4px solid"}:{ borderLeft:"4px solid"}}    
                onClick={()=>{
                    localStorage.setItem("click",JSON.stringify({
                            service_id: 36,
                            panel_id: id 
                        }))
                }}
                >
                <div className="flex gap-1 sm:gap-2 items-center">
                <div> <img style={{borderRadius:"50%",width:"35px", height:"35px",objectFit:"cover"}}  src={logo} /> </div>
                <Link target="_blank" to={`/smm-panel/${name}/${id}`}>
                    <h4>{name}</h4>
                </Link>
                </div>
                <div className="flex gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 19 18" fill="none">
                        <path d="M9.96 0.307L12.39 5.949L18.55 6.496C18.82 6.52 19.02 6.758 18.99 7.029C18.964 7.213 18.91 7.297 18.836 7.36L14.17 11.403L15.55 17.398C15.61 17.663 15.44 17.927 15.18 17.988C15.04 18.019 14.9 17.991 14.79 17.92L9.5 14.775L4.19 17.93C3.95 18.069 3.65 17.993 3.51 17.76C3.44 17.647 3.43 17.518 3.45 17.399L4.83 11.405L0.17 7.361C-0.03 7.183 -0.05 6.873 0.12 6.668C0.21 6.565 0.34 6.508 0.47 6.502L6.61 5.954L9.04 0.3C9.15 0.05 9.44 -0.067 9.69 0.04C9.82 0.092 9.91 0.188 9.96 0.303Z" fill="#FFD401"/>
                    </svg>
                    <span className="text-md">{rating}</span>
                </div>
        </div>)
}
export default CardBumps