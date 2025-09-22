import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG", "GIF"];

export default function FileUpload({returnedFile, fromApi}) {
  
  const [ apiFile, setApiFile ] = useState("")
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    setApiFile(URL.createObjectURL(file[0]))
    returnedFile(file[0])
    setFile(file);
  };
  useEffect(()=>{setApiFile(fromApi)},[fromApi])
  return (
    <div className="flex flex-col gap-2 file-upload">
      <FileUploader
        multiple={true}
        handleChange={handleChange}
        name="file"
        types={fileTypes}
      />
      { 
        !file && apiFile == "" ? 
            <p>no files uploaded yet</p> :
            <div className="flex gap-1 items-center">
                <img className="w-10 h-10 rounded-full object-cover" src={apiFile} alt="file" />
                <p>File name: {file  ? file[0].name : apiFile.substring(0,20) } </p>
            </div>
      }
      
    </div>
  );
}