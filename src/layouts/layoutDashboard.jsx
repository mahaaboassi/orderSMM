import { Outlet, useNavigate } from "react-router-dom"
import Footer from "../components/footer"
import Navbar from "../components/navbar"
import Navigation from "../components/navigation"
import Chat from "../components/chat"
import { useEffect, useState } from "react"


const LayoutDashboard = ()=>{
    const navigate = useNavigate()
    const [ authorized, setAuthorized ] = useState(false)
    useEffect(()=>{
        
        if(localStorage.getItem("user")){
            const user = JSON.parse(localStorage.getItem("user"))
            if( user.role != "user" ){
                 navigate("/auth/signIn",{
                    state: { message: "Please sign in to continue." },
                })
            }else{
                setAuthorized(true)
            }
        }else{
        
            navigate("/auth/signIn",{
                state: { message: "Please sign in to continue." },
            })
        }
    },[])
    if(!authorized) return null
    return <div>
        <Navbar/>
        <div className="pt-26 md:pt-32 grid grid-cols-5 px-2 lg:px-16 gap-3 lg:gap-5 xl:gap-10">
            <div className="col-span-1 relative">
                <div className="sticky top-25">
                    <Navigation/>
                </div>
            </div>
            <div className="col-span-4 ">
                    <Outlet/>
                </div>
            
        </div>
        
        <Footer/>
        {/* fixed Component */}
        <Chat/>
    </div>
}
export default LayoutDashboard