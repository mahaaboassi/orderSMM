
const Notification = ()=>{

    return(<div className='popup'>
        <div style={{maxHeight: `${window.innerHeight -200}px`}} className='content-popup p-2 flex flex-col gap-2'>
            <div className='flex justify-end cursor-pointer ' onClick={closePopup}>{closeIcon}</div>
            <div className='py-5 w-full h-full'>
                {/* {status.component} */}
            </div>
        </div>
       

    </div>)
}

export default Notification