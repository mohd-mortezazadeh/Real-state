import React, {FC} from "react";
import BlogSingleComment from "../blog-single-comment/BlogSingleComment";

interface ReplyCommentProps {
    comments: any[],
    parentCommentId: number,
    ref?: React.Ref<any>,
    articleId : number,
    user : any
}

// eslint-disable-next-line react/display-name
const ReplyComment: FC<ReplyCommentProps> = React.forwardRef(({comments, parentCommentId,user , articleId}, ref) => {

        const commentBody = (
            <div>
                {
                    comments.map((cm) => {
                        return parentCommentId === cm.reply &&
                            (

                                <div>
                                    <React.Fragment key={cm.id}>
                                        <BlogSingleComment user={user} articleId={articleId} parentCommentId={cm.id} comment={cm}
                                                           parentCommentName={comments.find(cm => cm.id === parentCommentId)?.fullname}/>
                                        <ReplyComment articleId={articleId} comments={comments} user={user} parentCommentId={cm?.id}/>
                                    </React.Fragment>
                                </div>
                            )
                    })
                }
            </div>
        )

        const content = ref
            ? <article ref={ref}>{commentBody}</article>
            : <article>{commentBody}</article>
        return content
    }
)

export default ReplyComment;