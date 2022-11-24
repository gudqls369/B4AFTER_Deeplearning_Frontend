// 게시글 url 가져오기 
const urlParams = new URLSearchParams(window.location.search)
const post_id = urlParams.get('id')

// 상세 페이지 게시글 보기
async function loadPostDetail(post_id){
    const post = await getPostDetail(post_id)

    const postImage = document.getElementById("image")
    const postUser = document.getElementById("username")
    const postContent = document.getElementById("post_content")
    const postTime = document.getElementById("time")

    postImage.setAttribute("src", `${backend_base_url}${post.image.after_image}`)
    postUser.innerText = post.user
    postContent.innerText = post.content
    postTime.innerText = post.update_at

    // 상세 페이지 댓글 보기
    const comments = await getComments()
    const comment_list = document.getElementById("comment_list")
    comment_list.innerHTML = ''

    for(let i = 0; i < comments.length; i++){
        const newComment = document.createElement("div")
        newComment.setAttribute("id", `comment_content_${comments[i].id}`)

        const newCommentUser = document.createElement("small")
        newCommentUser.innerText = comments[i].user

        const newCommentContent = document.createElement("p")
        newCommentContent.innerText = comments[i].content
        newCommentContent.setAttribute("id", `new_comment_content_${comments[i].id}`)
        
        const newCommentTime = document.createElement("small")
        newCommentTime.innerText = comments[i].update_at
        newCommentTime.setAttribute("id", `comment_time_${comments}`)

        // 댓글 수정 버튼    
        const commentUpdateButton = document.createElement("button")
        commentUpdateButton.innerText = '수정'
        commentUpdateButton.setAttribute("type", "button")
        commentUpdateButton.setAttribute("id", `${comments[i].id}`)
        commentUpdateButton.setAttribute("onclick", "updateCommentMode(this.id)")

        //댓글 삭제 버튼
        const commentDeleteButton = document.createElement("button")
        commentDeleteButton.innerText = '삭제'
        commentDeleteButton.setAttribute("type", "button")
        commentDeleteButton.setAttribute("id", `${comments[i].id}`)
        commentDeleteButton.setAttribute("onclick", "deleteCommenteMode(this.id)")
       
        newComment.appendChild(newCommentUser)
        newComment.appendChild(newCommentContent)
        newComment.appendChild(newCommentTime)
        newComment.appendChild(commentUpdateButton)
        newComment.appendChild(commentDeleteButton)
        comment_list.appendChild(newComment)
    }
}

//게시글 수정 화면
function updatePostMode(){
    const postContent = document.getElementById("post_content")
    postContent.style.visibility = "hidden"

    const inputPostContent = document.createElement("textarea")
    inputPostContent.setAttribute("id", "input_post_content")
    inputPostContent.innerText = postContent.innerHTML
    inputPostContent.rows = 1
    inputPostContent.cols = 100

    const newPostContent = document.getElementById("new_post_content")
    newPostContent.insertBefore(inputPostContent, postContent)
    
    const updatePostButton = document.getElementById("update_post")
    updatePostButton.setAttribute("onclick", "updatePost()")
}

// 게시글 수정
async function updatePost(){
    var inputPostContent = document.getElementById("input_post_content")
    await putPost(post_id, inputPostContent.value)

    inputPostContent.remove()
    
    const postContent = document.getElementById("post_content")
    postContent.style.visibility = "visible"

    const updatePostButton = document.getElementById("update_post")
    updatePostButton.setAttribute("onclick", "updateMode()")
    loadPostDetail(post_id)
}

// 게시글 삭제
async function deletePostMode() {
    await deletePost(post_id)
}

//댓글 수정 화면
function updateCommentMode(comment_id){
    const newCommentContent = document.getElementById(`new_comment_content_${comment_id}`)
    newCommentContent.style.visibility = "hidden"

    const inputCommentContent = document.createElement("textarea")
    inputCommentContent.setAttribute("id", `input_comment_content_${comment_id}`)
    inputCommentContent.innerText = newCommentContent.innerHTML
    inputCommentContent.rows = 3
    inputCommentContent.cols = 20

const commentTime = document.getElementById(`comment_time_${comment_id}`)
    const updateCommentContent = document.getElementById(`comment_content_${comment_id}`)
    updateCommentContent.insertBefore(inputCommentContent, commentTime)
    
    const updateCommentButton = document.getElementById(`${comment_id}`)
    updateCommentButton.setAttribute("onclick", "updateComment(this.id)")
}

// 댓글 수정
async function updateComment(comment_id){
    var inputCommentContent = document.getElementById(`input_comment_content_${comment_id}`)
    await putComment(post_id, comment_id, inputCommentContent.value)

    inputCommentContent.remove()
    const newCommentContent = document.getElementById(`new_comment_content_${comment_id}`)
    newCommentContent.style.visibility = "visible"

    const updateCommentButton = document.getElementById(`${comment_id}`)
    updateCommentButton.setAttribute("onclick", "updateCommentMode(this.id)")

    loadPostDetail(post_id)
}

// 댓글 삭제
async function deleteCommenteMode(comment_id){
    await deleteComment(post_id, comment_id)
}

loadPostDetail(post_id)
