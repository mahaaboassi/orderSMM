import { useEffect, useState } from "react"
import { Helper } from "../../../functionality/helper"
import { apiRoutes } from "../../../functionality/apiRoutes"
import Loading from "../../../components/loading"
// for validation
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { da } from "date-fns/locale";



const validationSchema = Yup.object({
       periods: Yup.array()
            .of(
            Yup.object({
                name: Yup.string(),
                factor : Yup.number()
                            .typeError("Factor must be a number.")
                            .required("Factor field is required.")
                            .moreThan(0,"Factor must be greater than 0."),
                discount: Yup.number()
                .typeError("Discount must be a number.")
                .required("Discount is required.")
                .min(0, "Discount must be greater than or equal to 0."),
            })
            )
});


const PeriodsWithControl = ()=>{
    const [ loading, setLoading ] = useState(false)
    const [ submit, setSubmit ] = useState(false)
    const [ data, setData ] = useState([])
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false
    })
    const { register, handleSubmit, control, formState: { errors },reset  } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange',
            defaultValues: {
                periods: [{ name: "", factor: "", discount: "" }]
            }
        });
    const { fields, append } = useFieldArray({
        control,
        name: "periods"
    });
    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        if(!localStorage.getItem("user")){
            navigate("/auth/signIn",{
                state: { message: "Please sign in to continue." },
            })
        }
        getData(signal)
        return () => controller.abort() 
    },[])
    const getData = async(signal) => {
        setData([])
        setLoading(true)
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.payment_periods.list,
            method : "GET",
            signal : signal,
        })
        if(response){
            console.log("------",response);
            setData(response.data)
            setLoading(false)
            const temp = {
                periods: response.data?.length
                        ? response.data.map(p => ({
                            name: p.name || "",
                            factor: p.factor || "",
                            discount: p.discount || "",
                        }))
                        : [{ name: "", factor: "", discount: "" }],
                    }
            
            reset(temp); 
        }else{
            console.log(message);
        }
    }

    const onSubmit = async (data) => {
  
        setErrorStatus({msg: "", open : false})
        setSubmit(true) 
        const values = new FormData()
        data.periodsr.forEach((element,idx) => {
            values.append(`prices[${idx}][name]`,element.name)
            values.append(`prices[${idx}][factor]`,element.factor)
            values.append(`prices[${idx}][discount]`,element.discount)
        });

        const {response , message,  statusCode} = await Helper({
            url:apiRoutes.payment_periods.add,
            method:'POST',
            body:values,
            hasToken: true,
        })
        if(response){
            setErrorStatus({msg: "Successfully updated", open : true, type:"success"})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false, type:""})
            },2000)
            
            window.scrollTo({top : 0})
            setSubmit(false)
        }else{
            console.log(message);
            window.scrollTo({top : 0})
            setErrorStatus({ msg:message, open : true})
            setTimeout(()=>{
                setErrorStatus({msg: "", open : false, type:""})
            },2000)
            setSubmit(false)
            
        }
    };
    const add = async () => {

    }
    return (<div className="settings flex flex-col gap-1">       
        {loading ? <Loading/> : <div className="flex flex-col gap-4">

                <form onSubmit={handleSubmit(onSubmit)} className="panel-card shadow p-4 sm:p-10 flex flex-col gap-3 rounded">
                    <div>
                        <h2>Periods</h2>
                        <p>
                            <strong className="text-xl">Note:</strong>
                            &nbsp; Enter the discount value as a percentage (%).
                        </p>
                    </div>
                     <div onClick={add} style={{width:"fit-content"}} className='cursor-pointer flex gap-1 items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path d="M3.66112 3.66109C6.10194 1.2205 9.30102 0 12.4999 0C15.6988 0 18.8981 1.2205 21.3389 3.66109C23.7795 6.10189 24.9998 9.30094 24.9998 12.4998C24.9998 15.6991 23.7795 18.8979 21.3389 21.3387C18.8981 23.7793 15.6988 24.9998 12.4999 24.9998C9.30102 24.9998 6.10173 23.7793 3.66112 21.3387C1.22031 18.8981 0 15.6991 0 12.4998C0 9.30094 1.22031 6.10189 3.66112 3.66109ZM11.7302 6.34399C11.7302 5.96965 12.0338 5.6661 12.4083 5.6661C12.7829 5.6661 13.0865 5.96965 13.0865 6.34399V11.9151H18.6576C19.0319 11.9151 19.3355 12.2186 19.3355 12.593C19.3355 12.9675 19.0319 13.2711 18.6576 13.2711H13.0862V18.8422C13.0862 19.2165 12.7827 19.5201 12.4081 19.5201C12.0336 19.5201 11.73 19.2165 11.73 18.8422V13.2709H6.15911C5.78476 13.2709 5.481 12.9673 5.481 12.5928C5.481 12.2184 5.78455 11.9149 6.15911 11.9149H11.7302V6.34399ZM12.4999 1.356C9.64791 1.356 6.79612 2.44405 4.61999 4.62016C2.44407 6.79606 1.35601 9.64803 1.35601 12.4998C1.35601 15.3518 2.44407 18.2037 4.61999 20.3796C6.79612 22.5557 9.64791 23.6438 12.4999 23.6438C15.3519 23.6438 18.2037 22.5557 20.3798 20.3796C22.5557 18.2037 23.644 15.3516 23.644 12.4998C23.644 9.64803 22.5557 6.79606 20.3798 4.62016C18.2039 2.44405 15.3519 1.356 12.4999 1.356Z" fill="#19770D"/>
                        </svg>
                        <span>Add new</span>
                    </div>
                    
                    {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                    {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                    <div className=" flex flex-col gap-5">
                        {/* Panel Information  */}
                        <div className="flex flex-col gap-2">
                            <div className='flex flex-col gap-2'>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex flex-col gap-2">
                                    <label><strong>Period {index + 1}:</strong></label>
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <div>
                                        <label>Name:</label>
                                        <input
                                            {...register(`periods.${index}.name`)}
                                            type="text"
                                            placeholder="Name"
                                        />
                                        {errors.prices?.[index]?.name && (
                                            <p className="pt-0.5 text-error">
                                            {errors.periods[index].name.message}
                                            </p>
                                        )}
                                        </div>
                                        <div>
                                        <label>Factor:</label>
                                        <input
                                            {...register(`periods.${index}.factor`)}
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            placeholder="Factor"
                                        />
                                        {errors.periods?.[index]?.factor && (
                                            <p className="pt-0.5 text-error">
                                            {errors.periods[index].factor.message}
                                            </p>
                                        )}
                                        </div>
                                        <div>
                                        <label>Discount: (%)</label>
                                        <input
                                            {...register(`periods.${index}.discount`)}
                                            type="number"
                                            onWheel={(e) => e.target.blur()}
                                            placeholder="Discount"
                                        />
                                        
                                        {errors.periods?.[index]?.discount && (
                                            <p className="pt-0.5 text-error">
                                            {errors.periods[index].discount.message}
                                            </p>
                                        )}
                                        </div>
                                        <div className="flex gap-2 items-end">
                                            <button className="dark-btn !text-sm cursor-pointer" onClick={() => edit(index)}>save</button>
                                            <button className="error-btn !text-sm cursor-pointer" onClick={() => remove(index)} >Delete</button>
                                        </div>
                                    </div>
                                    
                                    </div>
                                ))}
                               
                            </div>
                        </div>

                    </div> 

                </form>
            </div>}
        

    </div>)
}
export default PeriodsWithControl