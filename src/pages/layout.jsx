import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import Icons from "../components/icons"
import Footer from "../components/footer"
import Popup from "../components/popup"
import Chat from "../components/chat"

const Layout = ()=>{
    return (<div>
        <Navbar/>
        <div className="pt-26 md:pt-32">
            <Outlet/>
        </div>
        <Icons/>

        <Footer/>
        {/* Fixed Component */}
        <Popup/>
        <Chat/>

    </div>)
}

export default Layout