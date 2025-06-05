import { Link } from "react-router-dom"
const SignUp= ()=>{
    return(<div className="auth-container px-5 lg:px-10">
        <form action={"/auth/verification"} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-5">
            {/* <div> */}
                <h2 className="text-center">Record New Account</h2>
                <div><input type="text" placeholder="Email"  /></div>
                <div><input type="password" placeholder="Password"  /></div>
                <div><input type="password" placeholder="Retype Password"  /></div>
                <p>Have an account ? <Link to="/auth/signIn"><span>Sign In here</span></Link></p>
                <div>
                    <button className="dark-btn w-full">Sign Up</button>
                </div>
        </form>
    </div>)
}
export default SignUp