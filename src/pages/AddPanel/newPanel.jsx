import { useTranslation } from "react-i18next"

const NewPanel = ()=>{
    const {t} = useTranslation()
    return(<div className="px-2 lg:px-16 image-container">
        <form  className="auth-card shadow p-4 sm:p-10 flex flex-col gap-3">
            {/* <div> */}
                <h2 className="text-center">Add new SMM Panel</h2>
                <div className="flex flex-col gap-1">
                    <label>SMM Panel Title (Max 22 characters) :</label>
                    <input  type="text" placeholder={"Panel Title"}  />
                </div>
                <div className="flex flex-col gap-1">
                    <label>SMM Panel URL :</label>
                    <input  type="text" placeholder={"https://example.com"}  />
                </div>
                <div className="flex flex-col gap-1">
                    <label>API URL :</label>
                    <input  type="text" placeholder={"https://panel.com/api/v2"}  />
                </div>
                <div className="flex flex-col gap-1">
                    <label>API KEY:</label>
                    <input  type="text" placeholder={"123456789123456789"}  />
                </div>
                <div>
                    <button className="dark-btn w-full">Create Panel</button>
                </div> 
                {/* {errorStatus.open && <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                
                <div className="flex flex-col gap-1">
                    <label>{t("auth.password")} :</label>
                    <input {...register("password")} type="password" placeholder={t("auth.password")}  />
                {errors.password && <p className="p-0.5 text-error">{errors.password.message}</p>}
                </div>
                <p>{t("auth.don’t-have-an-account-yet")}<Link to="/auth/signUp"><span>{t("auth.sign-up-here")}</span></Link></p>
                */}
        </form>
    </div>)
}
export default NewPanel