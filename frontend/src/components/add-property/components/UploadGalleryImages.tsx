import React, {FC, useEffect, useState} from 'react'

import {useDropzone} from "react-dropzone";
import {BsPlusCircle} from 'react-icons/bs'

import TrashSquareSvg from "../../svg/trash-square/TrashSquareSvg";
import {getGallery, postThumbnail} from "../../../services/api/property";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../hooks/useRedux";
import {handleAddGallery, handleRemoveGallery, selectPropertyInfo} from "../../../redux/slices/addPropertySlice";
import toast from "react-hot-toast";

const UploadGalleryImages: FC = () => {

    const dispatch = useAppDispatch()
    const propertyState = useAppSelector(selectPropertyInfo)
    // images files states
    const [files, setFiles] = useState<any>([]);


    const [progress, setProgress] = useState<any>([])

    const [endUpload, setEndUpload] = useState<any>([])

    const [fileErrorIndex, setFileErrorIndex] = useState<any>(null)


    // get images if there was in files state(when go prev and come back to this page)
    useEffect(() => {
        if (propertyState.media.gallery.length > 0) {
            propertyState.media.gallery.map(async (id: number) => {
                const response = await getGallery(id)
                setFiles((prev: any) => [...prev, {preview: response.file}])
                setEndUpload((prev: any) => [...prev, true])
            })
        }
    }, [])
    useEffect(() => {


        let list = [...files]

        // endUpload.map((item : boolean,index :number)=>{
        //     if(!item){
        //
        //         list.splice(index , 1)
        //     }
        // })
        let deletedIndex = endUpload.findIndex((item: any) => item === false)

        delete endUpload[deletedIndex]


        if(deletedIndex > -1){
            delete list[deletedIndex]
        }

        setFiles(list)


    }, [endUpload])

    // config dropzone
    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: 10,
        accept: {
            'image/png': [".png"],
            'image/jpeg': [".jpeg"],
            'image/HEIC': [".HEIC"]
        },
        disabled: files.filter((item:any)=>item).length >= 10 && true,
        onDrop: async acceptedFiles => {


            setFileErrorIndex(null)

            if (((+files?.filter((item:any)=>item).length + (+acceptedFiles?.length)) <= 10) && (acceptedFiles.length > 0)) {
                setFiles([...files, ...acceptedFiles.map((file, index) => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                }))]);


                await axios.all(
                    acceptedFiles?.map((file: any, index) => {
                        let thumbnail = new FormData()
                        thumbnail.append('file', file)
                        thumbnail.append('subject_type', '3')

                        const options = {
                            onUploadProgress: (progressEvent: ProgressEvent) => {
                                const {loaded, total} = progressEvent;

                                let precentage = Math.floor((loaded * 100) / total);


                                if (precentage <= 100) {
                                    // setProgress( {
                                    //     ...progress
                                    // })
                                    setProgress((prev: any) => {
                                        const newProgress = [...prev]
                                        newProgress[index + files.length] = precentage
                                        return newProgress
                                    })
                                }
                            },
                            headers: {
                                "Content-Type": "multipart/form-data"
                            },

                        };


                        postThumbnail(thumbnail, options).then(res => {
                            // setProgress(0)
                            // setImageId(prevState => [...prevState , res])

                            dispatch(handleAddGallery(res))
                            if (res) {
                                setEndUpload((prev: any) => {
                                    const newEndUpload = [...prev]
                                    newEndUpload[index + files.length] = true

                                    return newEndUpload
                                })
                            }

                            // setImageId(res)
                        })
                            .catch((err) => {

                                setFileErrorIndex(index + (files.length))
                                setEndUpload((prev: any) => {
                                    const newEndUpload = [...prev]
                                    newEndUpload[index + files.length] = false

                                    return newEndUpload
                                })
                                // const list = [...files];


                                // list.splice(acceptedFiles.length + (files.length), 1);

                                // setFiles(list);
                                //
                                // const newEndUpload = [...endUpload]
                                // // newEndUpload.splice(acceptedFiles.length  + (files.length), 1)
                                // setEndUpload(newEndUpload)
                                //
                                // if(err.response.status ===500){
                                //     toast.error('آپلود عکس با مشکل مواجه شد')
                                // }
                                // dispatch(handleRemoveGallery(acceptedFiles.length + files.length))
                            })
                    })
                )
            } else if (acceptedFiles.length === 0) {
                toast('عکسی برای آگهی انتخاب نمایید')
            } else {
                toast('حداکثر عکس انتخابی 10 مورد میباشد')
            }


        }

    });

    // create thumbnails from uploaded images
    const thumbs = files.map((file: any, index: any) => (


        // preview images container

            file !== undefined &&  <div className='relative' key={file?.index} style={{width: '120px', height: '120px'}}>
            <img
                src={file?.preview}
                alt="پیش نمایش عکس"
                className="rounded-lg drop-img w-full h-full object-cover"

                // Revoke data uri after image is loaded
                // onLoad={() => {
                //     URL.revokeObjectURL(file.preview)
                // }}
            />
            {
                !endUpload[index] &&
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
                endUpload[index] &&
                <div className='absolute rounded-md top-1 left-1 cursor-pointer'
                     onClick={(e) => {


                         const list = [...files];
                         list.splice(index, 1);
                         setFiles(list);


                         const newEndUpload = [...endUpload]
                         newEndUpload.splice(index, 1)
                         setEndUpload(newEndUpload)


                         dispatch(handleRemoveGallery(index))
                         // const ids = [...imageId]
                         // ids.splice(index, 1);
                         // setImageId(ids)
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
        <>
            <div className='drop-thumb'>
                <div className='thumbInner flex flex-row justify-start items-start flex-wrap gap-x-6  w-full'>
                    {thumbs}

                    <div {...getRootProps({className: `drop-zone cursor-pointer ${files.length === 10 && 'opacity-30'}`})}>
                        <input  {...getInputProps()} />
                        <span className=' flex flex-row justify-center items-center'><BsPlusCircle
                            className='text-blue-700 text-2xl'/></span>
                    </div>

                </div>
            </div>
        </>
    )
}

export default UploadGalleryImages
