import React, {useCallback, useEffect, useRef, useState} from "react";
import BlogSingleComment from "../blog-single-comment/BlogSingleComment";
import ReplyComment from "../reply-comment/ReplyComment";
import {useAppDispatch, useAppSelector} from "../../hooks/useRedux";
import {comments, get_comments, reset} from "../../redux/slices/commentSlice";

interface BlogCommentsProps {
    articleId : number,
    user : any
}

const BlogComments = ({articleId , user}: BlogCommentsProps) => {

    const dispatch = useAppDispatch()

    const commentsState = useAppSelector(comments)

    const [page, setPage] = useState(1)

    const filpRef = useRef<HTMLDivElement>(null)


    const intObserver: any = useRef()

    const lastPostRef = useCallback((property: { isIntersecting: any; }[]) => {

        if (commentsState?.getLoading) return
        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(properties => {
            if (properties[0]?.isIntersecting && commentsState?.hasNextPage) {
                setPage(prev => prev + 1)
            }
        })

        if (property) intObserver.current.observe(property)
    }, [commentsState?.hasNextPage, commentsState?.getLoading])


    useEffect(() => {
        dispatch(get_comments({page, id :articleId}))


    }, [page])


    const content = commentsState?.comments?.map((cm: any, i: any) => {

        if (commentsState?.comments.length === i + 1) {

            return !cm?.repl &&
                (
                    <React.Fragment key={cm.id}>
                        <BlogSingleComment user={user} articleId={articleId} comment={cm} parentCommentId={cm.id} ref={lastPostRef}/>
                        <div className='mr-12'>
                            <ReplyComment user={user} articleId={articleId} comments={commentsState?.comments} parentCommentId={cm.id} ref={lastPostRef}/>
                        </div>
                    </React.Fragment>
                )

        }

        return !cm?.reply &&
            (
                <React.Fragment key={cm.id}>
                    <BlogSingleComment user={user} articleId={articleId} comment={cm} parentCommentId={cm.id}/>
                    <div className='mr-12'>
                        <ReplyComment user={user} articleId={articleId} comments={commentsState?.comments} parentCommentId={cm.id}/>
                    </div>
                </React.Fragment>
            )
    })

    return (
        <div>
            {/*<h2 className='mb-4 text-xl font-bold'>نظرات</h2>*/}

            {content}

        </div>
    );
};

export default BlogComments;