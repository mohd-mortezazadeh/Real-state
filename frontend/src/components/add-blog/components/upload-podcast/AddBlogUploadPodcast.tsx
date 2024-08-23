import React, {useState, useEffect, useMemo} from 'react'
import {useDropzone} from 'react-dropzone';
import TrashSquareSvg from '../../../svg/trash-square/TrashSquareSvg';
import {postThumbnail} from "../../../../services/api/property";
import {handleAddMedia, handleAddPodcast, handleRemovePodcast} from "../../../../redux/slices/blogSlice";
import {useAppDispatch} from "../../../../hooks/useRedux";
import {toast} from "react-hot-toast";

const AddBlogUploadPodcast = ({isEdit, blogEditData}: any) => {
    const dispatch = useAppDispatch()
    const [podcast, setPodcast] = useState<any>([]);

    const [endUpload, setEndUpload] = useState(true)
    const [progress, setProgress] = useState<any>(0)

    useMemo(() => {

        if (isEdit) {
            setPodcast([])
            if (blogEditData?.media?.length > 1) {
                // blogEditData.media.map(async (item: any) => {
                //     const response = await getGallery(item.id)
                //     setFiles((prev: any) => [...prev, {preview: response.file}])
                //     setEndUpload(true)
                // })


                setPodcast([{
                    preview: blogEditData?.media[1]?.file,
                    name: blogEditData?.media[1]?.file.split('media_file/')[1]
                }])

                dispatch(handleAddPodcast(blogEditData?.media[1]?.id))
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
            'audio/mp3': ['.mp3'],
            'audio/ogg': ['.ogg']
        },
        disabled: podcast.length >= 10 && true,
        onDrop: async acceptedFiles => {
            setEndUpload(false)
            // if (((+podcast?.length + (+acceptedFiles?.length)) <= 10) && (acceptedFiles.length > 0)) {
            setPodcast([...podcast, ...acceptedFiles.map((file, index) => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))]);
            // }


            let podcastData = new FormData()
            if(acceptedFiles[0] === undefined){
               toast.error("فرمت فایل ارسالی مجاز نمیباشد")
            }else{
                podcastData.append('file', acceptedFiles[0])
                podcastData.append('subject_type', '4')

                await postThumbnail(podcastData, options).then(res => {

                    dispatch(handleAddPodcast(res))
                    setEndUpload(true)
                    setProgress(0)
                }).catch(err => {
                    setProgress(0)
                    setEndUpload(true)
                    setPodcast([])
                })
            }

        }
    });


    // create thumbnails from uploaded images
    const thumbs = podcast.map((file: any, index: any) => (


        // preview images container
        <div
            className='w-full pr-3 pl-1 relative border-2 border-dashed border-custom-gray-200/10 rounded-lg overflow-hidden bg-custom-gray-200/5 flex flex-row justify-between items-center'
            key={file.index} style={{height: '60px'}}>
            <span>{podcast[0]?.name}</span>
            <div style={{
                width: `${progress}%`,
                animationFillMode: 'forwards',
                animationDirection: ''
            }} className='h-1 absolute bottom-0 right-0 bg-primary w-3/5 rounded-l-lg'></div>
            {

                !endUpload && <div className='absolute w-full h-full bg-gray-300/70 left-0 top-0 bottom-0'>

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

            {
                endUpload && <div className=' rounded-md cursor-pointer'
                                  onClick={(e) => {


                                      const list = [...podcast];
                                      list.splice(index, 1);
                                      setPodcast(list);
                                      dispatch(handleRemovePodcast())

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
            !podcast.length ?
                <div {...getRootProps({className: 'border-2 border-dashed border-custom-gray-200/10 rounded-lg bg-custom-gray-200/5 h-[100px] flex flex-col justify-center items-center cursor-pointer mb-5'})}>
                    <input {...getInputProps()} />
                    <p className='text-center text-sm p-8'>برای فایل صدای شاخص ، فایل صدا را بکشید و در اینجا رها کنید و
                        یا
                        بر روی باکس کلیک کنید</p>
                </div>
                :
                // preview images container
                <div className=' h-[60px] w-full relative mb-5'>
                    <aside className='h-full'>
                        {thumbs}
                    </aside>
                </div>
        }
        </>
    )
}

export default AddBlogUploadPodcast
