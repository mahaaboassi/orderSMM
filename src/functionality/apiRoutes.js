const host = "https://scc-global.net/orderSMM/api/"
// const host = "http://localhost:5173/api/"

export const apiRoutes = {
    auth : {
        signIn : `${host}auth`,
        signUp : `${host}auth`,
        sendCode : `${host}auth/send-code`,
        verifyCode : `${host}auth/verify`,
        forgetPassword : `${host}auth/forget-password`
    },
    panel : {
        list : `${host}panels`,
        add : `${host}panels`,
        featured : `${host}panels/featured`,
        getOne : (id)=>(`${host}panels/${id}`),
        update : (id)=>(`${host}panels/${id}`),
        delete : (id)=>(`${host}panels/${id}`), 
        byUser : `${host}panels/list/byUser`,
        historyServiceGetOne : (id)=>(`${host}services-requests/by-panel/${id}`),
    },
    panel_services : { 
        list : `${host}panel-services`,
        add : `${host}panel-services`,
        getOne : (id)=>(`${host}panel-services/${id}`),
        update : (id)=>(`${host}panel-services/${id}`),
        delete : (id)=>(`${host}panel-services/${id}`),
        
    },
    panel_services_categories : { 
        list : `${host}panel-services-categories`,
        add : `${host}panel-services-categories`,
        getOne : (id)=>(`${host}panel-services-categories/${id}`),
        update : (id)=>(`${host}panel-services-categories/${id}`),
        delete : (id)=>(`${host}panel-services-categories/${id}`),
        
    },
    services : { 
        list : `${host}services`,
        add : `${host}services`,
        getOne : (id)=>(`${host}services/${id}`),
        update : (id)=>(`${host}services/${id}`),
        delete : (id)=>(`${host}services/${id}`),
        request : `${host}services-requests`,
        getOneRequest : (id)=>(`${host}services-requests/${id}`),
        updateRequest : (id)=>(`${host}services-requests/${id}`),
        confirm : `${host}services-requests/confirm`,
        history : `${host}services-requests`,
        historyByUser : `${host}services-requests/by-user`
        
    },
    payment_periods : { 
        list : `${host}payment-periods`,
        add : `${host}payment-periods`,
        getOne : (id)=>(`${host}payment-periods/${id}`),
        update : (id)=>(`${host}payment-periods/${id}`),
        delete : (id)=>(`${host}payment-periods/${id}`),
        
    },
    currencies : { 
        list : `${host}currencies`,
        add : `${host}currencies`,
        getOne : (id)=>(`${host}currencies/${id}`),
        update : (id)=>(`${host}currencies/${id}`),
        delete : (id)=>(`${host}currencies/${id}`),
        
    },
    countries : { 
        list : `${host}countries`,
        add : `${host}countries`,
        getOne : (id)=>(`${host}countries/${id}`),
        update : (id)=>(`${host}countries/${id}`),
        delete : (id)=>(`${host}countries/${id}`),
        
    },
    users : { 
        list : `${host}users`,
        add : `${host}users`,
        getOne : (id)=>(`${host}users/${id}`),
        update : (id)=>(`${host}users/${id}`),
    },
    notifications : {
        list : `${host}notifications`,
        byUser : `${host}notifications/byUser`,
    },
    settings : {
        list : `${host}settings`,
    },
    clicks : {
        add : `${host}clicks`,
    },
    wallet : {
        list: `${host}wallets`,
        getOne : (id)=>(`${host}wallets/${id}`),
        charge: `${host}wallets/charge`,
    },
    transactions: {
        list: `${host}transactions`,
        byUser: `${host}transactions/byUser`,
        getOne : (id)=>(`${host}transactions/${id}`),
        transfer: `${host}transactions/chargeUser`
    },
    payment_methods : {
       list: `${host}payment-methods`, 
    },
    platforms: {
        list: `${host}platforms`,
        getOne : (id)=>(`${host}platforms/${id}`), 
    },
    review: { 
        list: `${host}panel-reviews`,
        listByApproved : `${host}panel-reviews/approved`,
        addByPanel : `${host}panel-reviews/by-panel`,
        getOne : (id)=>(`${host}panel-reviews/${id}`),
        update : (id)=>(`${host}panel-reviews/${id}`),
        delete : (id)=>(`${host}panel-reviews/${id}`),
    },
}