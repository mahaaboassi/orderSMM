import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"

const Settings = ()=>{
    const [ loading, setLoading ] = useState(false)
    const [ data, setData ] = useState([])
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        getData(signal)
        return () => controller.abort() 
    },[])
    const getData = async(signal) => {
        setData([])
        setLoading(true)
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.settings.list,
            method : "GET",
            signal : signal,
        })
        if(response){
            console.log(response);
            setData(response.data)
            setLoading(false)
        }else{
            console.log(message);
        }
    }
    return (<div>
        <h2>Settings</h2>
        {loading ? <Loading/> : <div>
                <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
                    <div className="card-info p-1 xs:p-3 gap-3">
                        <h4>Panels</h4>
                        <div className="number"> {data.find(item => item.key === "panels")?.value} </div>
                    </div>
                    <div className="card-info p-1 xs:p-3 gap-3">
                        <h4>Services</h4>
                        <div className="number"> {data.find(item => item.key === "services")?.value} </div>
                    </div>
                    <div className="card-info p-1 xs:p-3 gap-3">
                        <h4>Platforms</h4>
                        <div className="number"> {data.find(item => item.key === "platforms")?.value} </div>
                    </div>

                </div>
            </div>}
        

    </div>)
}
export default Settings