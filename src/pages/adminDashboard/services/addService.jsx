// for validation
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { apiRoutes } from "../../../functionality/apiRoutes";
import { Helper } from "../../../functionality/helper";
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FileUpload from '../../../components/fileUpload';


const validationSchema = Yup.object({
    name: Yup.string().required("Name Field is required."),
    slug: Yup.string().required("Slug Field is required."),
    prices: Yup.array()
            .of(
            Yup.object({
                name: Yup.string(),
                price : Yup.number()
                            .typeError("Price must be a number.")
                            .required("Price field is required.")
                            .moreThan(0,"Price must be greater than 0."),
                min: Yup.number()
                .typeError("Min must be a number.")
                .required("Min is required.")
                .min(0, "Min must be greater than or equal to 0."),
                max: Yup.number()
                .typeError("Max must be a number.")
                .required("Max is required.")
                .moreThan(
                    Yup.ref("min"),
                    "Max must be greater than Min."
                ),
            })
            )
            .min(1, "At least one price field is required."),
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
    const { register, handleSubmit, control, formState: { errors },reset  } = useForm({
        resolver: yupResolver(validationSchema),
            mode: 'onChange',
            defaultValues: {
                prices: [{ name: "", min: "", max: "", price: "" }]
            }
        });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "prices"
    });
    const [loading, setLoading] = useState(false)
    const [ errorStatus , setErrorStatus] = useState({
        msg: "",
        open : false,
        type : ""
    })
    const [file, setFile ] = useState({})
    const [photoFromApi, setPhotoFromApi ] = useState("")
    const [translationsDetails, setTranslationsDetails ] = useState([])
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
            params :{ detailed :  1 } ,
            signal : signal
        })
        if(response){
            const data = {
                name: response.data.name || "",
                slug: response.data.slug || "",
                price: response.data.price || "",
                prices: response.data.prices?.length
                        ? response.data.prices.map(p => ({
                            name: p.name || "",
                            min: p.min || "",
                            max: p.max || "",
                            price: p.price || ""
                        }))
                        : [{ name: "", min: "", max: "", price: "" }],
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
           
            setTranslationsDetails(response.data.detailed_translations)
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
        values.append("slug",data.slug)
        values.append("price",data.prices[0].max)
        data.prices.forEach((element,idx) => {
            values.append(`prices[${idx}][name]`,element.name)
            values.append(`prices[${idx}][min]`,element.min)
            values.append(`prices[${idx}][price]`,element.price)
            values.append(`prices[${idx}][max]`,element.max)
        });
        if(id){
            translationsDetails.forEach((ele)=>{
                values.append(`languages[${ele[0]?.id}][name]`,ele[0]?.language_id == 1? data.name_en :(
                    ele[0]?.language_id == 2 ? data.name_ar :(
                        ele[0]?.language_id == 3 ? data.name_hi: (
                           ele[0]?.language_id == 4 ? data.name_tr : (
                                ele[0]?.language_id == 5 ? data.name_ru : data.name_ur
                           )
                        )
                    )))
                values.append(`languages[${ele[1]?.id}][description]`,ele[1]?.language_id == 1? data.description_en :(
                    ele[1]?.language_id == 2 ? data.description_ar :(
                        ele[1]?.language_id == 3 ? data.description_hi: (
                           ele[1]?.language_id == 4 ? data.description_tr : (
                                ele[1]?.language_id == 5 ? data.description_ru : data.description_ur
                           )
                        )
                    )))
            })
        }else{
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
        }
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
            setTimeout(()=>setErrorStatus({msg: message, open : true,type: ""}),1000)
            setLoading(false)
        }
    };
    return(<div className="flex flex-col gap-5">
        <div className='flex flex-col gap-1'>
            <h2 >{id ? "Edit Service": "Add Service"}</h2>
            <div className="flex gap-2 items-center">
                <Link className="cursor-pointer text-blue-500" to={"/dashboard/admin/services"}> Services</Link> / <div>{id ? "Edit Service": "Add Service"}</div>
            </div>
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
                        <label>Slug:</label>
                         <div className='px-2'>
                            {["promotion","ads","search_results","pin_up","api_emails","bumps"].map((slug) => (
                            <label style={{height:"23px"}} key={slug} className="flex items-center gap-2">
                                <input
                                style={{width:"fit-content"}}
                                type="radio"
                                value={slug}
                                {...register("slug")}
                                />
                                {slug}
                            </label>
                            ))}
                         </div>
                        {errors.slug && <p className="pt-0.5 text-error">{errors.slug.message}</p>}
                    </div>
                    <div className='flex flex-col gap-2'>
                         {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col gap-2">
                            <label><strong>Price {index + 1}:</strong></label>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                <label>Name:</label>
                                <input
                                    {...register(`prices.${index}.name`)}
                                    type="text"
                                    placeholder="Name Group"
                                />
                                {errors.prices?.[index]?.name && (
                                    <p className="pt-0.5 text-error">
                                    {errors.prices[index].name.message}
                                    </p>
                                )}
                                </div>
                                <div>
                                <label>Price:</label>
                                <input
                                    {...register(`prices.${index}.price`)}
                                    type="text"
                                    placeholder="Price"
                                />
                                {errors.prices?.[index]?.price && (
                                    <p className="pt-0.5 text-error">
                                    {errors.prices[index].price.message}
                                    </p>
                                )}
                                </div>
                                <div>
                                <label>Min:</label>
                                <input
                                    {...register(`prices.${index}.min`)}
                                    type="number"
                                    placeholder="Min"
                                />
                                {errors.prices?.[index]?.min && (
                                    <p className="pt-0.5 text-error">
                                    {errors.prices[index].min.message}
                                    </p>
                                )}
                                </div>
                                <div className='flex items-center'>
                                    <div className='w-full'>
                                        <label>Max:</label>
                                        <input
                                            {...register(`prices.${index}.max`)}
                                            type="number"
                                            placeholder="Max"
                                        />
                                        {errors.prices?.[index]?.max && (
                                            <p className="pt-0.5 text-error">
                                            {errors.prices[index].max.message}
                                            </p>
                                        )}
                                    </div>
                                    <div onClick={() => remove(index)} className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_17_1174)">
                                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="red"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_17_1174">
                                            <rect width="24" height="24" fill="red"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>

                            </div>
                            
                            </div>
                        ))}
                        <div onClick={() => append({ name: "", min: "", max: "" })} style={{width:"fit-content"}} className='cursor-pointer flex gap-1 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                <path d="M3.66112 3.66109C6.10194 1.2205 9.30102 0 12.4999 0C15.6988 0 18.8981 1.2205 21.3389 3.66109C23.7795 6.10189 24.9998 9.30094 24.9998 12.4998C24.9998 15.6991 23.7795 18.8979 21.3389 21.3387C18.8981 23.7793 15.6988 24.9998 12.4999 24.9998C9.30102 24.9998 6.10173 23.7793 3.66112 21.3387C1.22031 18.8981 0 15.6991 0 12.4998C0 9.30094 1.22031 6.10189 3.66112 3.66109ZM11.7302 6.34399C11.7302 5.96965 12.0338 5.6661 12.4083 5.6661C12.7829 5.6661 13.0865 5.96965 13.0865 6.34399V11.9151H18.6576C19.0319 11.9151 19.3355 12.2186 19.3355 12.593C19.3355 12.9675 19.0319 13.2711 18.6576 13.2711H13.0862V18.8422C13.0862 19.2165 12.7827 19.5201 12.4081 19.5201C12.0336 19.5201 11.73 19.2165 11.73 18.8422V13.2709H6.15911C5.78476 13.2709 5.481 12.9673 5.481 12.5928C5.481 12.2184 5.78455 11.9149 6.15911 11.9149H11.7302V6.34399ZM12.4999 1.356C9.64791 1.356 6.79612 2.44405 4.61999 4.62016C2.44407 6.79606 1.35601 9.64803 1.35601 12.4998C1.35601 15.3518 2.44407 18.2037 4.61999 20.3796C6.79612 22.5557 9.64791 23.6438 12.4999 23.6438C15.3519 23.6438 18.2037 22.5557 20.3798 20.3796C22.5557 18.2037 23.644 15.3516 23.644 12.4998C23.644 9.64803 22.5557 6.79606 20.3798 4.62016C18.2039 2.44405 15.3519 1.356 12.4999 1.356Z" fill="#19770D"/>
                            </svg>
                            <span>Add new price</span>
                        </div>
                    </div>
                    <div></div>
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
                    <h4><strong>Upload File </strong></h4>
                    <FileUpload fromApi={photoFromApi} returnedFile={(res)=>setFile(res)} />
                    
                </div>
                <div>
                    <button className='dark-btn w-full' type='submit' disabled={loading}>{loading?<div className='loader m-auto'></div>:"Submit"}</button>
                </div>
        </form>
    </div>)
}

export default AddService