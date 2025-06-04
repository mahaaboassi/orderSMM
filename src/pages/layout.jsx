import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import Icons from "../components/icons"
import Footer from "../components/footer"

const Layout = ()=>{
    return (<div>
        <Navbar/>
        <div className="pt-32">
            <Outlet/>
        </div>
        <Icons/>
        <Footer/>

    </div>)
}

export default Layout