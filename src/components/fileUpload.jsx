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
            <div className="flex items-center justify-between">
               <div className="flex gap-1 items-center">
                  <img className="w-10 h-10 rounded-full object-cover" src={apiFile} alt="file" />
                  <p>File name: {file  ? file[0].name : apiFile.substring(0,20) } </p>
              </div>
              <div className="cursor-pointer" onClick={()=>{
                setFile(null)
                returnedFile(null)
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="21" viewBox="0 0 19 21" fill="none">
                    <g clipPath="url(#clip0_283_20)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.407301 1.64626H7.05341V0.642578C7.05341 0.28916 7.34653 0 7.70593 0H11.3753C11.7345 0 12.0278 0.288989 12.0278 0.642578V1.64644H18.5929C18.8173 1.64644 19.0002 1.82708 19.0002 2.04788V4.0156H0V2.04771C0 1.8269 0.183086 1.64626 0.407301 1.64626ZM1.50807 5.05945H17.6337C17.9699 5.05945 18.2751 5.33272 18.2447 5.66169L16.88 20.3981C16.8498 20.7272 16.6041 20.9998 16.2686 20.9998H2.85389C2.51826 20.9998 2.27218 20.7278 2.24233 20.3981L0.896515 5.66169C0.866665 5.33152 1.17158 5.05945 1.50807 5.05945ZM11.9877 7.34829H13.6999V18.5104H11.9877V7.34829ZM5.21874 7.34829H6.93107V18.5104H5.21874V7.34829ZM8.60279 7.34829H10.3155V18.5104H8.60279V7.34829Z" fill="#E30E0E"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_283_20">
                    <rect width="19" height="21" fill="white"/>
                    </clipPath>
                    </defs>
                  </svg>
              </div>
            </div>
      }
      
    </div>
  );
}