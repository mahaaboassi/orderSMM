import { useTranslation } from "react-i18next"

const Account  = ()=>{
    const {t} = useTranslation()
    return(<div className="account flex flex-col gap-5">
        <div>
            <h2>Setting Account</h2>
            <p>Manage your account details and settings.</p>
        </div>
        <form className="flex flex-col gap-3 p-5">
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label>{t("auth.email")} :</label>
                    <input  type="text" placeholder={t("auth.email")}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.password")} :</label>
                    <input  type="text" placeholder={t("auth.email")}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label>{t("auth.password")} :</label>
                    <input  type="text" placeholder={t("auth.email")}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
                <div className="flex flex-col gap-1">
                    <label>{t("auth.confirmation-password")} :</label>
                    <input type="text" placeholder={t("auth.confirmation-password")}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                    <label>Current Password :</label>
                    <input type="text" placeholder={t("auth.email")}  />
                    {/* {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>} */}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
                <button className="dark-btn w-full">Update Your Account</button>
            </div>
            
            
        </form>
    </div>)
}
export default Account