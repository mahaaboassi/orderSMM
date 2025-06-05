import { Link } from "react-router-dom"
const Verification = ()=>{
    return(<div className="auth-container px-5 lg:px-10">
        <form action={"/"} className="auth-card shadow p-4 sm:p-10 flex flex-col gap-5">
            {/* <div> */}
                <h2 className="text-center">Verification Code</h2>
                <p>We have just send you a verification code to your email, Please check </p>
                <div className="flex gap-2">
                    <div><input/></div>
                    <div><input/></div>
                    <div><input/></div>
                    <div><input/></div>
                    <div><input/></div>
                    <div><input/></div>
                </div>
                <p>Didn’t receive a code? ? <span>Resend Now</span></p>
                <div>
                    <button className="dark-btn w-full">Submit</button>
                </div>
        </form>
    </div>)
}
export default Verification