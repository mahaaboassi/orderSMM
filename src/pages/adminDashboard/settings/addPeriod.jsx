// for validation
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";

// Validation schema
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    name_en: Yup.string().required("Name in English is required"),
    name_ar: Yup.string().required("Name in Arabic is required"),
    name_hi: Yup.string().required("Name in Hindi is required"),
    name_tr: Yup.string().required("Name in Turkish is required"),
    name_ru: Yup.string().required("Name in Russian is required"),
    name_ur: Yup.string().required("Name in Urdu is required"),
    factor: Yup.number()
        .typeError("Factor must be a number.")
        .required("Factor is required.")
        .moreThan(0, "Factor must be greater than 0."),
    discount: Yup.number()
        .typeError("Discount must be a number.")
        .required("Discount is required.")
        .min(0, "Discount must be greater than or equal to 0."),
});

const AddPeriod = ()=>{
    const { id } = useParams()
    const [ data, setData ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [errorStatus, setErrorStatus] = useState({ msg: "", open: false, type: "" });
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: yupResolver(validationSchema),
        mode: "onChange",
    });

    // Fetch existing periods
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (!localStorage.getItem("user")) {
        navigate("/auth/signIn", { state: { message: "Please sign in to continue." } });
        return;
        }

        const getOne = async (signal) => {
            const { response, message } = await Helper({
                url: apiRoutes.payment_periods.getOne(id),
                method: "GET",
                params: { detailed: 1},
                signal
            });
            if(response){
                setData(response?.data?.detailed_translations)
                const temp = {
                    name: response?.data?.name ?? "",
                    discount: response?.data?.discount ?? 0,
                    factor: response?.data?.factor ?? 0,
                    name_en: response?.data?.translations?.en?.name ?? "",
                    name_tr: response?.data?.translations?.tr?.name ?? "",
                    name_ru: response?.data?.translations?.ru?.name ?? "",
                    name_hi: response?.data?.translations?.hi?.name ?? "",
                    name_ar: response?.data?.translations?.ar?.name ?? "",
                    name_ur: response?.data?.translations?.ur?.name ?? ""
                }
                reset(temp)
            }
            
        };

        if(id) getOne(signal);
        return () => controller.abort();
    }, [id]);
    const onSubmitSingle = async (period) => {
        setLoading(true)
        
        const values = new FormData();
        values.append("name", period.name);
        values.append("factor", period.factor);
        values.append("discount", period.discount);
        if(id){
            data.forEach(e=>{
                e.forEach(ele=>{
                    if(ele.text_type == "name"){
                        if(ele.language_id == 1) values.append(`languages[${ele.id}][name]`,period.name_en)
                        if(ele.language_id == 2) values.append(`languages[${ele.id}][name]`,period.name_ar)
                        if(ele.language_id == 3) values.append(`languages[${ele.id}][name]`,period.name_hi)
                        if(ele.language_id == 4) values.append(`languages[${ele.id}][name]`,period.name_tr)
                        if(ele.language_id == 5) values.append(`languages[${ele.id}][name]`,period.name_ru)
                        if(ele.language_id == 6) values.append(`languages[${ele.id}][name]`,period.name_ur)
                    }
                })
            })
        }else{
            values.append("languages[1][name]",period.name_en)
            values.append("languages[2][name]",period.name_ar)
            values.append("languages[3][name]",period.name_hi)
            values.append("languages[4][name]",period.name_tr)
            values.append("languages[5][name]",period.name_ru)
            values.append("languages[6][name]",period.name_ur)
        }
        if(!id) values.append("_method", "PUT");
        const { response, message } = await Helper({
            url: id ? apiRoutes.payment_periods.update(id) : apiRoutes.payment_periods.add,
            method: "POST",
            body: values,
            hasToken: true
        });

        if (response) {
            setLoading(false)
             setLoading(false)
            setErrorStatus({msg: response.message, open : true,type: "success"})
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),3000)
            window.scrollTo({top: 0})
        } else {
            window.scrollTo({top: 0})
            setTimeout(()=>setErrorStatus({msg: message, open : true,type: ""}),1000)
            setLoading(false)
        }
    };
    return <form onSubmit={handleSubmit(onSubmitSingle)} className='py-5 w-full h-full flex flex-col gap-4'>
                
                <h3><strong>{id ? "Edit" : "Add"} Period :</strong></h3>
                {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
                {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
                <div className="card p-4 flex flex-col gap-3">
                    <p>
                        <strong className="text-xl">Note:</strong>&nbsp; Enter the discount value as a percentage (%).
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ">
                        <div>
                            <label>Name:</label>
                            <input
                            {...register(`name`)}
                            type="text"
                            placeholder="Name"
                            />
                            {errors.name && (
                            <p className="pt-0.5 text-error">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label>Factor:</label>
                            <input
                            {...register(`factor`)}
                            type="number"
                            step="any"
                            placeholder="Factor"
                            onWheel={(e) => e.target.blur()}
                            />
                            {errors.factor && (
                            <p className="pt-0.5 text-error">{errors.factor.message}</p>
                            )}
                        </div>

                        <div>
                            <label>Discount (%):</label>
                            <input
                            {...register(`discount`)}
                            type="number"
                            step="any"
                            placeholder="Discount"
                            onWheel={(e) => e.target.blur()}
                            />
                            {errors.discount && (
                            <p className="pt-0.5 text-error">{errors.discount.message}</p>
                            )}
                        </div>
                        
                        
                        </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 card p-4">
                    <div>
                      <label>Name in English:</label>
                      <input {...register(`name_en`)} type="text" placeholder="Name"/>
                      {errors.name_en && (
                        <p className="pt-0.5 text-error">{errors.name_en.message}</p>
                      )}
                    </div>
                    <div>
                      <label>Name in Arabic:</label>
                      <input {...register(`name_ar`)} type="text" placeholder="Name"/>
                      {errors.name_ar && (
                        <p className="pt-0.5 text-error">{errors.name_ar.message}</p>
                      )}
                    </div>
                    <div>
                      <label>Name in Turkish:</label>
                      <input {...register(`name_tr`)} type="text" placeholder="Name"/>
                      {errors.name_tr && (
                        <p className="pt-0.5 text-error">{errors.name_tr.message}</p>
                      )}
                    </div>
                    <div>
                      <label>Name in Russian:</label>
                      <input {...register(`name_ru`)} type="text" placeholder="Name"/>
                      {errors.name_ru && (
                        <p className="pt-0.5 text-error">{errors.name_ru.message}</p>
                      )}
                    </div>
                    <div>
                      <label>Name in Hindi:</label>
                      <input {...register(`name_hi`)} type="text" placeholder="Name"/>
                      {errors.name_hi && (
                        <p className="pt-0.5 text-error">{errors.name_hi.message}</p>
                      )}
                    </div>
                    <div>
                      <label>Name in Urdu:</label>
                      <input {...register(`name_ur`)} type="text" placeholder="Name"/>
                      {errors.name_ur && (
                        <p className="pt-0.5 text-error">{errors.name_ur.message}</p>
                      )}
                    </div>
                    
                </div>
                <div>
                    <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Submit"}</button>
                </div>
            </form>
}
export default AddPeriod