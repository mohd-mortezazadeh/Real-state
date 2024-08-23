import React, {FC, useEffect, useState} from 'react'
import {useDropzone} from "react-dropzone";
import TrashSquareSvg from '../../svg/trash-square/TrashSquareSvg';
import {getGallery, postThumbnail} from "../../../services/api/property";
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import {handleAddThumbnail, handleRemoveThumbnail, selectPropertyInfo} from "../../../redux/slices/addPropertySlice";
import toast from "react-hot-toast";

interface UploadPrimaryImageProps {
    handleChange: (value: any, action: any) => void,
}

const UploadPrimaryImage: FC<UploadPrimaryImageProps> = ({handleChange}) => {

    // image file state

    const [primaryImage, setPrimaryImage] = useState<any>([]);

    const [progress, setProgress] = useState(0)

    const [endUpload, setEndUpload] = useState(false)

    const dispatch = useAppDispatch()

    const propertyState = useAppSelector(selectPropertyInfo)

    //go prev page and come back and get the images
    useEffect(() => {

        if (propertyState?.media?.thumbnail?.length > 0) {
            const response = getGallery(propertyState.media.thumbnail)
                .then(res => {
                    setPrimaryImage([{preview: res.file}])
                    setEndUpload(true)
                })
                .catch(()=>{
                    setEndUpload(true)
                })
        }
    }, [])

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


    // drop zone config

    const {getRootProps, getInputProps} = useDropzone({
        accept: {
            'image/*': []
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 20000000,


        onDrop: async acceptedFiles => {

            if(acceptedFiles[0].name.length > 80){
                toast.error("حداکثر کاراکتر مجاز برای نام عکس 80 میباشد")
            }else{
                setEndUpload(false)
                setPrimaryImage(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));
                handleChange("gallery", acceptedFiles)


                let thumbnail = new FormData()
                thumbnail.append('file', acceptedFiles[0])
                thumbnail.append('subject_type', '2')

                await postThumbnail(thumbnail, options).then(res => {

                    dispatch(handleAddThumbnail(res))
                    setEndUpload(true)
                    setProgress(0)
                }).catch(err => {

                    setProgress(0)
                    setEndUpload(true)

                    setPrimaryImage([])
                    if(err.response.status === 500){
                        toast.error('آپلود عکس با مشکل مواجه شد')
                    }
                })

            }

        }
    });


    // create preview 
    const thumbs = primaryImage.map((file: any) => (
        <div key={file.name} className="w-full h-full relative rounded-lg overflow-hidden">
            <img
                src={file.preview}
                className="h-full w-full object-cover"
                // Revoke data uri after image is loaded
                onLoad={() => {
                    URL.revokeObjectURL(file.preview)
                }}
            />
            {
                endUpload &&
                <div className='absolute rounded-md top-4 left-4 cursor-pointer z-50'
                     onClick={async (e) => {
                         await setPrimaryImage(primaryImage.filter((item: any) => item.name !== file.name))
                         dispatch(handleRemoveThumbnail())
                     }}
                >
                    <TrashSquareSvg/>
                </div>
            }


            {/*    progress bar*/}

            {
                !endUpload &&
                <div className='absolute w-full h-full bg-gray-300/70 left-0 top-0 bottom-0'>

                    {
                        <div
                            className='absolute rounded top-1/2 right-1/2 translate-x-1/2 bottom-0 w-3/4 h-2  right-0  bg-white overflow-hidden z-40'>

                            <div style={{
                                width: `${progress}%`,
                                animationFillMode: 'forwards',
                                animationDirection: ''
                            }}

                                 className='absolute w-full h-full top-0 left-0 bg-primary/60 transition-all'>

                            </div>

                        </div>
                    }

                </div>
            }

        </div>
    ));


    // clear memory 
    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => primaryImage.forEach((file: any) => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        <div>
            {
                !primaryImage.length ?

                    //  drop-zone
                    <div {...getRootProps({className: 'border-2 border-dashed border-custom-gray-200/10 rounded-lg bg-custom-gray-200/5 h-80 flex flex-col justify-center items-center cursor-pointer'})}>
                        <input {...getInputProps()} />
                        <p className='text-center p-8'>برای آپلود عکس شاخص ، فایل عکس را بکشید و در اینجا رها کنید و یا
                            بر روی باکس کلیک کنید</p>
                    </div>
                    :
                    // preview images container
                    <div className=' h-96 w-full relative'>
                        <aside className='h-full'>
                            {thumbs}
                        </aside>
                    </div>

            }


        </div>
    );
}

export default UploadPrimaryImage
