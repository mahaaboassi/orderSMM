import { Link, NavLink, Outlet } from "react-router-dom";



const Settings = ()=>{
    
    return (<div className="settings flex flex-col gap-3">
        <div>
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin"}> Dashboard</Link> / <div>Settings</div>
            </div>        
            <h2>Settings</h2>
        </div>
        <div className="flex gap-5">
            <NavLink end className={({isActive})=>isActive?"settings-active-link":""} to="/dashboard/admin/settings"><div>Basic</div></NavLink>
            <NavLink end className={({isActive})=>isActive?"settings-active-link":""} to="/dashboard/admin/settings/periods"><div>Periods</div></NavLink>
            {/* <NavLink end className={({isActive})=>isActive?"settings-active-link":""} to="/dashboard/admin/settings/currency"><div>Currency</div></NavLink> */}
        </div>
        <Outlet/>
    </div>)
}
export default Settings