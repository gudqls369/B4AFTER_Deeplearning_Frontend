// 게시글 url 가져오기 
const urlParams = new URLSearchParams(window.location.search)
const post_id = urlParams.get('id')

// 상세 페이지 게시글 보기
async function loadPostDetail(post_id){
    const post = await getPostDetail(post_id)
    console.log(post)

    const postImage = document.getElementById("image")
    const postUser = document.getElementById("username")
    const postContent = document.getElementById("content")
    const postTime = document.getElementById("time")

    postImage.setAttribute("src", `${backend_base_url}${post.image.after_image}`)
    postUser.innerText = post.user
    postContent.innerText = post.content
    postTime.innerText = post.update_at

    // 상세 페이지 댓글 보기
    const comments = await getComments()
    console.log(comments)
    const comment_list = document.getElementById("comment_list")

    for(let i = 0; i < comments.length; i++){
        const newComment = document.createElement("div")
        const newCommentUser = document.createElement("small")
        const newCommentContent = document.createElement("p")
        const newCommentTime = document.createElement("small")

        newCommentUser.innerText = comments[i].user
        newCommentContent.innerText = comments[i].content
        newCommentTime.innerText = comments[i].update_at

        newComment.appendChild(newCommentUser)
        newComment.appendChild(newCommentContent)
        newComment.appendChild(newCommentTime)
        comment_list.appendChild(newComment)
    }
}

loadPostDetail(post_id)