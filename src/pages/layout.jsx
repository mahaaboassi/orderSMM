import { Outlet } from "react-router-dom"
import Navbar from "../components/navbar"
import Icons from "../components/icons"
import Footer from "../components/footer"
import Popup from "../components/popup"
import Chat from "../components/chat"
import { useTranslation } from "react-i18next"

const Layout = ()=>{
     const { i18n } = useTranslation();

  console.log(i18n.language);
    return (<div style={(i18n.language == "ar" || i18n.language == "ur")?{direction:"rtl"}:{direction:"ltr"}}>
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