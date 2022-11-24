// 게시글 url 가져오기 
const urlParams = new URLSearchParams(window.location.search)
const post_id = urlParams.get('id')

// 상세 페이지 게시글 보기
async function loadPostDetail(post_id){
    const post = await getPostDetail(post_id)
    console.log(post)

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

//게시글 수정 화면
function updateMode(){
    // const image = document.getElementById("image")
    const content = document.getElementById("post_content")
    content.style.visibility = "hidden"

    const inputContent = document.createElement("textarea")
    inputContent.setAttribute("id", "input_content")
    inputContent.innerText = content.innerHTML
    inputContent.rows = 1
    inputContent.cols = 100

    const newContent = document.getElementById("content")
    newContent.insertBefore(inputContent, content)
    
    const updatePostButton = document.getElementById("update_post")
    updatePostButton.setAttribute("onclick", "updatePost()")
}

// 게시글 수정
async function updatePost(){
    var inputContent = document.getElementById("input_content")
    await putPost(post_id, inputContent.value)

    inputContent.remove()
    
    const content = document.getElementById("post_content")
    content.style.visibility = "visible"

    const updatePostButton = document.getElementById("update_post")
    updatePostButton.setAttribute("onclick", "updateMode()")
    loadPostDetail(post_id)
}

// 게시글 삭제
async function deleteMode() {
    await deletePost(post_id)
}

loadPostDetail(post_id)