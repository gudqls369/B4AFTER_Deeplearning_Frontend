// 게시글 작성 페이지 보기
window.onload = async function createPost(){
    const images = await getImages()
    const image_list = document.getElementById("get_image")

    images.forEach(image => {
        const newImage = document.createElement("img")        
        newImage.setAttribute("src", `${backend_base_url}${image.image.after_image}`)
        newImage.setAttribute("id", "new_image")
        image_list.append(newImage)
    })

    const image = document.getElementById("new_image").getAttribute("src")
    const content = document.getElementById("content").value

    postPost(image, content)
}
