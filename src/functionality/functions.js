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
export const getBalance  = async() => {
    if(!localStorage.getItem("user")) return
    const id = JSON.parse(localStorage.getItem("user")).wallet 
    const {response , message,  statusCode} = await Helper({
        url: apiRoutes.wallet.getOne(id),
        method:'POST',
        hasToken: true,
    })
    if(response){
        return {
            status : true,
            message : response.data?.balance ?? 0
        }
    }else{
        console.log(message);
        return {
            status : false,
            message : "Something is wrong"
        }
        
    }
}