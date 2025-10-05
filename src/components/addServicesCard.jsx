import { Link } from "react-router-dom"

const AddServiceCard = ({link}) =>{
    return(<Link to={link}>
                <div className="cover-add">
                    <div className="content gap-5">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 14 14" fill="none">
                                <g clipPath="url(#clip0_235_21)">
                                <path fillRule="evenodd" clipRule="evenodd" d="M11.9501 2.05044C14.6837 4.78416 14.6837 9.21639 11.9501 11.9501C9.21639 14.6837 4.78416 14.6837 2.05044 11.9501C-0.683156 9.21639 -0.683156 4.78416 2.05044 2.05044C4.78416 -0.683156 9.21639 -0.683156 11.9501 2.05044ZM10.6652 6.60253C10.8848 6.60253 11.0628 6.78061 11.0628 7.00016C11.0628 7.21982 10.8847 7.39779 10.6652 7.39779H7.3979V10.6652C7.3979 10.8848 7.21982 11.0628 7.00027 11.0628C6.78072 11.0628 6.60276 10.8847 6.60276 10.6652V7.3979H3.33527C3.11561 7.3979 2.93753 7.21982 2.93753 7.00027C2.93753 6.78072 3.11561 6.60265 3.33527 6.60265H6.60265V3.33515C6.60265 3.11561 6.78072 2.93753 7.00016 2.93753C7.21982 2.93753 7.39779 3.11561 7.39779 3.33515V6.60253H10.6652Z" fill="#08392B"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_235_21">
                                <rect width="14" height="14" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <h3>Add </h3>
                    </div>
                </div>
            </Link>)
}
export default AddServiceCard