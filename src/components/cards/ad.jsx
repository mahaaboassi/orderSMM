const Ad = ({photo,name,id,rating,services_count}) => {
    return (<div className="card-imge "><img src={photo} alt={`Image_${name}`} />
                <div onClick={()=>navigate(`/smm-panel/${name}/${id}`)} className="goddy p-3 flex flex-col items-center gap-1"> 
                    <h3>{name}</h3>
                    <div className="flex justify-between gap-2 goddy-info">
                        <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="13" viewBox="0 0 14 13" fill="none">
                                <g clipPath="url(#clip0_271_2)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7 0L8.92671 4.59712L14 4.96555L10.1175 8.17517L11.3262 13L7 10.3866L2.67376 13L3.88258 8.17517L0 4.96555L5.07329 4.59712L7 0Z" fill="#19770D"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_271_2">
                                <rect width="14" height="13" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            &nbsp; {rating}
                        </div>
                        <div>-</div>
                        <div className="flex"> {services_count} &nbsp; Services</div>
                    </div>
                    {/* {t("viewDetails")} */}
                </div>
            </div>)
}
export default Ad