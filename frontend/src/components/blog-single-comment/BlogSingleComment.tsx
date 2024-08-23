import DateSvg from "../svg/date/DateSvg";
import ReplySvg from "../svg/replay/replySvg";
import React, {FC, useEffect, useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {create_comment, delete_comment} from "../../redux/slices/commentSlice";
import {useAppDispatch} from "../../hooks/useRedux";
import TrashSquareSvg from "../svg/trash-square/TrashSquareSvg";
import DeleteCommentModal from "../delete-comment-modal/DeleteCommentModal";

interface BlogSingleCommentProps {
    comment: any,
    parentCommentName?: string,
    parentCommentId: number,
    ref?: React.Ref<any>,
    articleId: number,
    user: any
}

// eslint-disable-next-line react/display-name
const BlogSingleComment: FC<BlogSingleCommentProps> = React.forwardRef(({
                                                                            comment,
                                                                            articleId,
                                                                            user,
                                                                            parentCommentName,
                                                                            parentCommentId
                                                                        }, ref) => {

    const [reply, setReply] = useState(false)

    // const [userName , setUserName] = useState(null)

    const dispatch = useAppDispatch()
    const [delCommentModal, setDelCommentModal] = useState(false)
    const [deleteId, setDeleteId] = useState<number>()


    const handleDeleteComment = () => {
        dispatch(delete_comment(deleteId))
    }

    const formik = useFormik({
        initialValues: {
            fullname: user?.fullname,
            content: '',
            replied_to: parentCommentId,
            article: articleId
        },
        enableReinitialize : true,
        validationSchema: Yup.object({
            fullname: Yup.string()
                .nullable()
                .required('نام خود را وارد نمایید'),
            content: Yup.string()
                .min(5, 'حداقل مقدار مجاز پیام 5 کاراکتر میباشد')
                .required('پیام خود را وارد نمایید'),
            replied_to: Yup.number().nullable()
        }),
        onSubmit: function (values, formikHelpers) {
            dispatch(create_comment({value: values}))

            formikHelpers.resetForm()
        }

    })


    const commentBody = (

        comment && <div className='w-full p-4 flex flex-col gap-y-6 rounded-2xl bg-white box-shadow-1 mb-4'>
            {
                delCommentModal &&
                <div
                    className='backdrop-blur-md w-full h-full fixed top-0 left-0 z-50 flex flex-col items-center justify-center'
                    style={{backgroundColor: 'rgba(0,0,0,0.3)'}}
                >
                    <DeleteCommentModal delCommentModal={delCommentModal} setDelCommentModal={setDelCommentModal}
                                        handleDeleteComment={handleDeleteComment}
                    />
                </div>
            }
            <div className='flex items-center gap-x-2 justify-between'>
                <p>
                    <span className='font-bold text-lg'>{comment.fullname}</span>
                    {
                        comment?.reply && <span className='text-custom-gray-200 text-sm'>@{parentCommentName}</span>
                    }
                </p>

                {
                    (comment?.is_admin && user?.role?.id === 1) && <button onClick={() => {
                        setDelCommentModal(true)
                        setDeleteId(comment?.id)
                    }
                    }>
                        <TrashSquareSvg width={28} height={28}/>
                    </button>
                }
            </div>

            <div>
                {comment.content}
            </div>

            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-x-2'>
                    <DateSvg height={16} width={16} color={'#737373'}/>
                    <span
                        className='text-sm text-custom-gray-200'>{new Date(+comment.created_at).toLocaleDateString('fa', {
                        day: 'numeric',
                        month: 'long',
                        year: "numeric"
                    })}</span>

                </div>
                <button
                    className='bg-primary flex items-center gap-x-1 p-1 px-2 rounded text-white hover:bg-blue-800 transition-colors'
                    onClick={() => setReply(!reply)}
                >
                    <ReplySvg/>
                    {
                        reply ? <span>بیخیال</span> : <span>پاسخ به</span>
                    }
                </button>
            </div>
            {/*reply form*/}
            {
                reply ? <form onSubmit={formik.handleSubmit} className='flex flex-col gap-y-4'>
                    <div>
                        <span className='text-sm'> در حال پاسخ به {comment?.fullname}</span>
                    </div>

                    <input
                        type="text"
                        name='fullname'
                        disabled={user?.fullname}
                        value={user?.fullname || formik.values.fullname}
                        onChange={formik.handleChange}
                        className="bg-custom-gray-100 w-full md:w-1/2 pr-3 py-3 pl-7  text-sm font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                        placeholder="نام نام خانوادگی خود را وارد کنید"
                    />
                    <span className='text-red-400 text-sm'>

                        <>
                          {formik?.errors?.fullname}
                        </>
                    </span>


                    <textarea
                        value={formik.values.content}
                        name='content'
                        className="bg-custom-gray-100 pr-5 py-4 pl-7 text-custom-gray-200 text-xs font-light rounded-lg border-[0.8px] border-custom-gray-200/10"
                        placeholder=" پیام خود را وارد کنید"
                        onChange={formik.handleChange}
                        rows={7}
                    />
                    <span className='text-red-400 text-sm'>{formik.errors.content}</span>

                    <div>
                        <button type='submit'
                                className='bg-primary hover:bg-blue-800 transition-colors text-white rounded p-1 px-2'>
                            ارسال نظر
                        </button>
                    </div>
                </form> : null
            }
        </div>

    );
    const content = ref
        ? <article ref={ref}>{commentBody}</article>
        : <article>{commentBody}</article>

    return content
})

export default BlogSingleComment;