import React, {useState, useEffect, useMemo} from 'react'
import {useDropzone} from 'react-dropzone';
import TrashSquareSvg from '../../../svg/trash-square/TrashSquareSvg';
import { postThumbnail} from "../../../../services/api/property";
import {useAppDispatch} from "../../../../hooks/useRedux";
import {handleAddMedia, handleRemoveMedia} from "../../../../redux/slices/blogSlice";
import toast from "react-hot-toast";

const AddBlogUploadImage = ({blogEditData , isEdit , setOpenModal} : any) => {
    const [files, setFiles] = useState<any>([]);
    const [endUpload, setEndUpload] = useState<any>(true)
    const dispatch = useAppDispatch()

    const [progress, setProgress] = useState<any>([])

    useMemo(() => {

        if(isEdit){
                setFiles([])
            if (blogEditData?.media?.length > 0) {
                // blogEditData.media.map(async (item: any) => {
                //     const response = await getGallery(item.id)
                //     setFiles((prev: any) => [...prev, {preview: response.file}])
                //     setEndUpload(true)
                // })
                setFiles([{preview : blogEditData?.media[0]?.file}])
                dispatch(handleAddMedia(blogEditData?.media[0]?.id))
            }
        }
    }, [blogEditData])


    const options = {
        onUploadProgress: (progressEvent: ProgressEvent) => {
            const {loaded, total} = progressEvent;
            let precentage = Math.floor((loaded * 100) / total);

            if (precentage <= 100) {
                setProgress(precentage)
            }
        },
        headers: {
            "Content-Type": "multipart/form-data"
        },
    };

    // config dropzone
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': []
        },
        disabled: files.length >= 10 && true,
        onDrop: async acceptedFiles => {
            if(acceptedFiles[0].name.length > 80 ){
                toast.error("حداکثر کاراکتر مجاز برای نام عکس 80 میباشد.")

            }else{
                setEndUpload(false)
                // if (((+files?.length + (+acceptedFiles?.length)) <= 10) && (acceptedFiles.length > 0)) {
                setFiles([...files, ...acceptedFiles.map((file, index) => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))]);
                // }

                let media = new FormData()
                if (acceptedFiles[0] === undefined) {

                    media.append('file', '')
                    media.append('subject_type', '4')
                } else {
                    media.append('file', acceptedFiles[0])
                    media.append('subject_type', '4')
                }

                await postThumbnail(media, options).then(res => {

                    dispatch(handleAddMedia(res))
                    setEndUpload(true)
                    setProgress(0)
                }).catch(err => {
                    setProgress(0)
                    setEndUpload(true)
                    setFiles([])
                })
            }


        }
    });


    // create thumbnails from uploaded images
    const thumbs = files.map((file: any, index: any) => (


        // preview images container
        <div className='w-full h-full relative rounded-lg overflow-hidden' key={file.index} style={{height: '180px'}}>
            <img
                src={file.preview}
                alt="پیش نمایش عکس"
                className="rounded-lg drop-img w-full h-full object-cover"

                // Revoke data uri after image is loaded
                // onLoad={() => {
                //     URL.revokeObjectURL(file.preview)
                // }}
            />
            {

                !endUpload &&
                <div className='absolute w-full h-full bg-gray-300/70 left-0 top-0 bottom-0'>

                    {
                        <div
                            className='absolute rounded top-1/2 right-1/2 translate-x-1/2 bottom-0 w-3/4 h-2  right-0  bg-white overflow-hidden z-40'>

                            <div style={{
                                width: `${progress[index]}%`,
                                animationFillMode: 'forwards',
                                animationDirection: ''
                            }}

                                 className='absolute w-full h-full top-0 left-0 bg-primary/60 transition-all'>

                            </div>

                        </div>
                    }

                </div>

            }

            {
                endUpload && <div className='absolute rounded-md top-1 left-1 cursor-pointer'
                                  onClick={(e) => {


                                      const list = [...files];
                                      list.splice(index, 1);
                                      setFiles(list);
                                      dispatch(handleRemoveMedia())


                                  }}
                >
                    <TrashSquareSvg/>


                </div>
            }
        </div>

    ));

    // clean memory that create object url
    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        // return () => files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <>          {
            !files.length ?
                <div {...getRootProps({className: 'border-2 border-dashed border-custom-gray-200/10 rounded-lg bg-custom-gray-200/5 h-[180px] flex flex-col justify-center items-center cursor-pointer mb-5'})}>
                    <input {...getInputProps()} />
                    <p className='text-center p-8 text-sm'>برای آپلود عکس شاخص ، فایل عکس را بکشید و در اینجا رها کنید و
                        یا
                        بر روی باکس کلیک کنید</p>
                </div>
                :
                // preview images container
                <div className=' h-full w-full relative mb-5'>
                    <aside className='h-full'>
                        {thumbs}
                    </aside>
                </div>
        }
        </>
    )
}

export default AddBlogUploadImage
