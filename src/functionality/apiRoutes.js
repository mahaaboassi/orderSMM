const host = "https://scc-global.net/orderSMM/api/"

export const apiRoutes = {
    auth : {
        signIn : `${host}auth`,
        signUp : `${host}auth`,
        sendCode : `${host}auth/send-code`,
        verifyCode : `${host}auth/verify`
    }
}