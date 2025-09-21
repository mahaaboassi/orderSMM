import { apiRoutes } from "./apiRoutes"
import { Helper } from "./helper"

export const storeClick  = async(service_id,panel_id) => {
    const data = new FormData()
    if(service_id) data.append("service_id",service_id)
    data.append("panel_id",panel_id)
    data.append("_method","PUT")

    const {response , message,  statusCode} = await Helper({
        url: apiRoutes.clicks.add,
        method:'POST',
        body: data,
        hasToken: true,
    })
    if(response){
        localStorage.removeItem("click")
        return {
            status : true,
            message : "Successfully added"
        }
    }else{
        console.log(message);
        return {
            status : false,
            message : "Something is wrong"
        }
        
    }
}