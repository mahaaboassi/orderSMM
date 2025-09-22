// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useEffect, useState } from 'react';
import UploadFile from '../../../components/uploadFile';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MobileInput from '../../../components/mobileInput';
import Countries from '../../../components/countries';
import UsersSelect from '../../../components/users';
import Dropdown from '../../../components/DropDownComponent';




const AddUser = ()=>{
    const { id } = useParams()
    const validationSchema = Yup.object({
        name : Yup.string().required("Name Field is required."),
        email: Yup.string().email("Invalid email").required("Email Field is required."),
        telegram: Yup.string().required("Telegram Field is required."),
        whatsapp: Yup.string(), 
        website: Yup.string(),
        password : id ? Yup.string() : Yup.string().required("Password Field is required."), 

    });
    const { register, handleSubmit, formState: { errors },reset  } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange',
            defaultValues : id ? {} : { approved : 0}
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const [ values, setValues ] = useState({
        active: {label : "Active",value : 1},
        role: {label : "User",value : 2},
    })

    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        if(id)
          getData(signal)
        return () => controller.abort()
    },[])
    const getData = async (signal)=>{
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.users.getOne(id),
            method : "GET",
            hasToken : true,
            signal : signal
        })
        if(response){
            const data = {
                name: response.data.name || "",
                telegram: response.data.telegram || "",
                whatsapp: response.data.whatsapp || "",
                email: response.data.email || "",
                website: response.data.website || "",
            };

            // functionality for role and active
            setValues(prev=>( {
                role : response.data?.role == "admin" ? {label : "Admin",value : 1}: {label : "User",value : 2},
                active : response.data?.active == "0" ? {label : "Inactive",value : 0}: {label : "Active",value : 1}
            }))  
            reset(data); 
        }else{
            console.log(message);
            
        }
    }
    const onSubmit = async (data) => {
        
        setErrorStatus({msg: "", open : false})
        setLoading(true)
        
        const value = new FormData()
        value.append("name",data.name)
        value.append("email",data.email)
        value.append("website",data.website)
        value.append("telegram",data.telegram)
        value.append("whatsapp",data.whatsapp)
        if(data.password) value.append("password",data.password)
        value.append("role_id",values.role.value)
        value.append("active",values.active.value)

        if(!id)
            value.append("_method","PUT")


        const obj = Object.fromEntries(value.entries());
        // console.log("Data user",obj);
        // return
        const {response , message,  statusCode} = await Helper({
            url: id ? apiRoutes.users.update(id) : apiRoutes.users.add,
            method:'POST',
            body:value,
            hasToken : true,
        })
        if(response){
            console.log(response);
            setLoading(false)
            setErrorStatus({msg: response.message, open : true,type: "success"})
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),1000)
            window.scrollTo({top: 0})
        }else{
            console.log(message);
            window.scrollTo({top: 0})
            setTimeout(()=>setErrorStatus({msg: message, open : true,type: ""}),1000)
            setLoading(false)
        }
    };

    return(<div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin/users"}> Users</Link> / <div>{id ? "Edit User" : "Add User"}</div>
            </div>
            <h2>{id ? "Edit User" : "Add User"}</h2>
            <p>
                Add a new user to your website 
             </p>
        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <div className="flex flex-col gap-1">
                            <label>Name:</label>
                            <input  {...register("name")} type="text" placeholder={"Name"}  />
                            {errors.name && <p className="pt-0.5 text-error">{errors.name.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Email :</label>
                            <input  {...register("email")} type="text" placeholder={"Email"}  />
                            {errors.email && <p className="pt-0.5 text-error">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Whatsapp :</label>
                            <input  {...register("whatsapp")} type="number" placeholder={"+XX XXX XXXX"}  />
                            {errors.whatsapp && <p className="pt-0.5 text-error">{errors.whatsapp.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Telegram :</label>
                            <input  {...register("telegram")} type="text" placeholder={"https://t.me/@username"}  />
                            {errors.telegram && <p className="pt-0.5 text-error">{errors.telegram.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Website :</label>
                            <input {...register("website")} type="text" placeholder={"Website"}  />
                            {errors.website && <p className="pt-0.5 text-error">{errors.website.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Password :</label>
                            <input  {...register("password")} type="text" placeholder={"Password"}  />
                            {errors.password && <p className="pt-0.5 text-error">{errors.password.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label>Role:</label>
                            <Dropdown data={[{label : "Admin",value : 1},
                                {label : "User",value : 2}
                            ]} defaultOption={values.role} returnedOption={(res)=>{setValues(prev=>({...prev, role : res}))}} /> 
                        </div>
                        <div>
                            <label>Active:</label>
                            <Dropdown data={[{label : "Active",value : 1},
                                {label : "Inactive",value : 0}
                            ]} defaultOption={values.active} returnedOption={(res)=>{setValues(prev=>({...prev, active : res}))}} /> 
                        </div>
                    </div>
                    
                    


                </div>
                <div>
                    <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Submit"}</button>
                </div>
        </form>
    </div>)
}

export default AddUser