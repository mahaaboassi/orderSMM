
const getToken = ()=>{

    return localStorage.getItem("token") ? localStorage.getItem("token") : ""
}

export const  Helper =  async ({url, body , method ,signal, hasToken=false , params})=>{
    // checkUserLogedIn()
    const isFormData = body instanceof FormData;
    try {
        const headers = isFormData ? {
            // "Content-Type": "application/json",
            
        }: {
            "Content-Type": "application/json",
            
        };
        if(hasToken)
            headers["Authorization"] = `Bearer ${getToken()}`

        const data = {
            method ,
            // withCredentials: true,
            // credentials: 'include',
            // mode: "cors",
            // credentials: 'include', // Include credentials
            // mode: "cors", 
            headers,
            // cache: "force-cache",
            ...signal && { signal },
            ...(method === "POST" || method === "PUT") && { body: isFormData ? body : JSON.stringify(body) }
            
        }

        // console.log(data);
    
        
        const urlWithParams = new URL(url, window.location.origin);
        urlWithParams.search = new URLSearchParams(params).toString();
        // console.log("serach url",urlWithParams);
        
        // console.log('Fetching URL:', urlWithParams);
        // console.log('Request Options:', data);


        const result = await fetch(urlWithParams,data)
        // console.log('Fetch result:', result);

   
            const res = await result.json()
            // console.log("JSON response received:", res); 
            if(!res.status){
                return { message: "Something went wrong, please try again." ,statusCode : 500};
            }
            switch (res.status) {
                case 200:
                    return {response : res, 
                            message : res.message , 
                            statusCode : 200};
                case 400:
                    return { message: res.message,statusCode : 400};
                case 401:
                    return { message: res.message ,statusCode : 401};
                case 404:
                    // if(res.message == "you have to login before"){
                    //     if(localStorage.getItem("user")){
                    //         window.location.reload()
                    //     }
                    // }
                    return { message: res.message ,statusCode : 404 };
                case 405:
                    return { message: res.message ,statusCode : 405};
                case 422:
                    return { message:  res.message ,statusCode : 422};
                case 455:
                    return { message:  res.message ,statusCode : 455};
                case 500:
                    return { message: "Something went wrong, please try again." ,statusCode : 500};
                
                default:
                    return { response:res, message:  res.message };
            }

            
        
        
    }catch (error){
        console.error('Error fetching data:', error);

        switch (error.message) {
            case '404 Not Found':
                return { message: "Resource not found" };
            case '500 Internal Server Error':
                return { message: "Something went wrong, please try again." };
            case 'signal is aborted without reason':
                return { message: "Signal is aborted without reason" };
            default:
                return { message: "Something 11 went wrong, please try again." };
        }
    }

}




