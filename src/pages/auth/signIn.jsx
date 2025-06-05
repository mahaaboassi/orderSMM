import { Link } from "react-router-dom"
const SignIn = ()=>{
    return(<div className="auth-container px-5 lg:px-10">
        <form className="auth-card shadow p-4 sm:p-10 flex flex-col gap-5">
            {/* <div> */}
                <h2 className="text-center">Log In to Your Account</h2>
                <div><input type="text" placeholder="Email"  /></div>
                <div><input type="password" placeholder="Password"  /></div>
                <p>Don’t have an account yet ? <Link to="/auth/signUp"><span>Sign Up here</span></Link></p>
                <div>
                    <button className="dark-btn w-full">Sign In</button>
                </div>
        </form>
    </div>)
}
export default SignIn