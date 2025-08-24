import { useTranslation } from "react-i18next"

const Finances  = ()=>{
    const {t} = useTranslation()
    return(<div className="account flex flex-col gap-5">
        <div>
            <h2>Finance History</h2>
            <p>View a detailed record of all your financial transactions.</p>
        </div>

    </div>)
}
export default Finances