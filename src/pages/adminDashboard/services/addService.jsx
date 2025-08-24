// for validation
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useEffect, useState } from 'react';
import UploadFile from '../../../components/uploadFile';
import { useNavigate, useParams } from 'react-router-dom';


const validationSchema = Yup.object({
    name: Yup.string().required("Name Field is required."),
    price: Yup.number()
        .typeError("Price must be a number.")
        .required("Price field is required.")
        .moreThan(0, "Price must be greater than 0."),
    name_en: Yup.string().required("Name Field in English language is required."),
    name_ar: Yup.string().required("Name Field in Arabic language is required."),
    name_tr: Yup.string().required("Name Field in Turkish language is required."),
    name_ru: Yup.string().required("Name Field in Russian language is required."),
    name_hi: Yup.string().required("Name Field in Hindi language is required."),
    name_ur: Yup.string().required("Name Field in Urdu language is required."),
    description_en: Yup.string().required("Description Field in English language is required."),
    description_ar: Yup.string().required("Description Field in Arabic language is required."),
    description_tr: Yup.string().required("Description Field in Turkish language is required."),
    description_ru: Yup.string().required("Description Field in Russian language is required."),
    description_hi: Yup.string().required("Description Field in Hindi language is required."),
    description_ur: Yup.string().required("Description Field in Urdu language is required."),

});
const AddService = ()=>{
    const { id } = useParams()
    const { register, handleSubmit, formState: { errors },reset  } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange'
        });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const [file, setFile ] = useState({})
    const [photoFromApi, setPhotoFromApi ] = useState("")
    const navigate = useNavigate()

    useEffect(()=>{
        const controller = new AbortController()
        const signal = controller.signal
        if(id)
          getData(signal)
        return () => controller.abort()
    },[])
    const getData = async (signal)=>{
        const { response, message, statusCode} = await Helper({
            url : apiRoutes.services.getOne(id),
            method : "GET",
            signal : signal
        })
        if(response){
            const data = {
                name: response.data.name || "",
                price: response.data.price || "",
                name_en: response.data.translations?.en?.name || "",
                name_ar: response.data.translations?.ar?.name || "",
                name_tr: response.data.translations?.tr?.name || "",
                name_ru: response.data.translations?.ru?.name || "",
                name_hi: response.data.translations?.hi?.name || "",
                name_ur: response.data.translations?.ur?.name || "",
                description_en: response.data.translations?.en?.description || "",
                description_ar: response.data.translations?.ar?.description || "",
                description_tr: response.data.translations?.tr?.description || "",
                description_ru: response.data.translations?.ru?.description || "",
                description_hi: response.data.translations?.hi?.description || "",
                description_ur: response.data.translations?.ur?.description || "",
            };
            setPhotoFromApi(response.data.photo)
            
            reset(data); 
        }else{
            console.log(message);
            
        }
    }
    const onSubmit = async (data) => {
  
        setErrorStatus({msg: "", open : false})
        setLoading(true)

        const values = new FormData()
        values.append("name",data.name)
        values.append("price",data.price)
        values.append("languages[1][name]",data.name_en)
        values.append("languages[2][name]",data.name_ar)
        values.append("languages[3][name]",data.name_hi)
        values.append("languages[4][name]",data.name_tr)
        values.append("languages[5][name]",data.name_ru)
        values.append("languages[6][name]",data.name_ur)
        values.append("languages[1][description]",data.description_en)
        values.append("languages[2][description]",data.description_ar)
        values.append("languages[3][description]",data.description_hi)
        values.append("languages[4][description]",data.description_tr)
        values.append("languages[5][description]",data.description_ru)
        values.append("languages[6][description]",data.description_ur)
        if("name" in file)
            values.append("file",file)
        
        if(!id)
            values.append("_method","PUT")

        const {response , message,  statusCode} = await Helper({
            url: id ? apiRoutes.services.update(id) : apiRoutes.services.add,
            method:'POST',
            body:values,
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
            setTimeout(()=>setErrorStatus({msg: "", open : false,type: ""}),1000)
            setLoading(false)
            
        }
        
        
    };
    return(<div className="flex flex-col gap-5">
        <div>
            <h2 >{id ? "Edit Service": "Add Service"}</h2>
            <p>
                Add a new service to your website along with accurate descriptions in multiple languages:<br />
                <strong>(en)</strong> English, <strong>(ar)</strong> Arabic, <strong>(tr)</strong> Turkish, 
                <strong>(ru)</strong> Russian, <strong>(hi)</strong> Hindi, <strong>(ur)</strong> Urdu.
             </p>

        </div>
        {errorStatus.open && errorStatus.type == "success" && <h4 className="text-center box-success p-2">{errorStatus.msg}</h4>}
        {errorStatus.open && errorStatus.type != "success"&& <h4 className="text-center box-error p-2">{errorStatus.msg}</h4>}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label>Name :</label>
                        <input {...register("name")} type="text" placeholder={"Name"}  />
                        {errors.name && <p className="pt-0.5 text-error">{errors.name.message}</p>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <label>Price :</label>
                        <input {...register("price")} type="number" placeholder={"Price"}  />
                        {errors.price && <p className="pt-0.5 text-error">{errors.price.message}</p>}
                    </div>
                </div>
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <h4><strong>Name in Languages</strong></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(en)</strong> :</label>
                            <input  {...register("name_en")} type="text" placeholder={"Name (en)"}  />
                            {errors.name_en && <p className="pt-0.5 text-error">{errors.name_en.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(ar)</strong> :</label>
                            <input {...register("name_ar")}  type="text" placeholder={"Name (ar)"}  />
                            {errors.name_ar && <p className="pt-0.5 text-error">{errors.name_ar.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(tr)</strong> :</label>
                            <input {...register("name_tr")} type="text" placeholder={"Name (tr)"}  />
                            {errors.name_tr && <p className="pt-0.5 text-error">{errors.name_tr.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(ru)</strong> :</label>
                            <input {...register("name_ru")} type="text" placeholder={"Name (ru)"}  />
                            {errors.name_ru && <p className="pt-0.5 text-error">{errors.name_ru.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(hi)</strong> :</label>
                            <input {...register("name_hi")}  type="text" placeholder={"Name (hi)"}  />
                            {errors.name_hi && <p className="pt-0.5 text-error">{errors.name_hi.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Name <strong>(ur)</strong> :</label>
                            <input {...register("name_ur")} type="text" placeholder={"Name (ur)"}  />
                            {errors.name_ur && <p className="pt-0.5 text-error">{errors.name_ur.message}</p>}
                        </div>

                    </div>
                </div>
                <div className="card p-2 sm:p-4 flex flex-col gap-4">
                    <h4><strong>Description in Languages</strong></h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <label>Description <strong>(en)</strong> :</label>
                            <textarea {...register("description_en")} type="text" placeholder={"Description (en)"}  />
                            {errors.description_en && <p className="pt-0.5 text-error">{errors.description_en.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Description <strong>(ar)</strong> :</label>
                            <textarea {...register("description_ar")} type="text" placeholder={"Description (ar)"}  />
                            {errors.description_ar && <p className="pt-0.5 text-error">{errors.description_ar.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Description <strong>(tr)</strong> :</label>
                            <textarea {...register("description_tr")} type="text" placeholder={"Price"}  />
                            {errors.description_tr && <p className="pt-0.5 text-error">{errors.description_tr.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Description <strong>(ru)</strong> :</label>
                            <textarea {...register("description_ru")} type="text" placeholder={"Description (ru)"}  />
                            {errors.description_ru && <p className="pt-0.5 text-error">{errors.description_ru.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Description <strong>(hi)</strong> :</label>
                            <textarea {...register("description_hi")} type="text" placeholder={"Description (hi) "}  />
                            {errors.description_hi && <p className="pt-0.5 text-error">{errors.description_hi.message}</p>}
                        </div>
                        <div className="flex flex-col gap-1">
                            <label>Description <strong>(ur)</strong> :</label>
                            <textarea {...register("description_ur")} type="text" placeholder={"Description (ur)"}  />
                            {errors.description_ur && <p className="pt-0.5 text-error">{errors.description_ur.message}</p>}
                        </div>

                    </div>

                </div>
                <div className='card p-2 sm:p-4 flex flex-col gap-4'>
                    {/* Upload File */}
                    <h4><strong>Upload File is not required</strong></h4>
                    <UploadFile fromApi={photoFromApi} returnedValue={(res)=>setFile(res)}/>
                </div>
                <div>
                    <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Submit"}</button>
                </div>
        </form>
    </div>)
}

export default AddService