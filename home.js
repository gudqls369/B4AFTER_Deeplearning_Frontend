const dropArea = document.querySelector(".drag-area"),
    dragText = dropArea.querySelector("header"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
let file;

button.onclick = () => {
    input.click();
}

input.addEventListener("change", function () {
    file = this.files[0];
    dropArea.classList.add("active");
    showFile();
});


dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("active");
    dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    file = event.dataTransfer.files[0];
    showFile();
});

function showFile() {
    let fileType = file.type;
    let validExtensions = ["image/jpeg", "image/jpg", "image/png"];
    if (validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imgTag = `<img src="${fileURL}" alt="">`;
            dropArea.innerHTML = imgTag;
        }
        fileReader.readAsDataURL(file);
    } else {
        alert("이미지 파일이 아닙니다.");
        dropArea.classList.remove("active");
        dragText.textContent = "Drag & Drop to Upload File";
    }
}

window.onload = async function loadPosts(){
    const posts = await getPosts()
    const post_list = document.getElementById("post_list")
    
    console.log(posts)

    posts.forEach(post => {
        const newPost = document.createElement("div")
        newPost.classList.add("col")
        newPost.setAttribute("id", post.id)
        newPost.setAttribute("onclick", "postDetail(this.id)")

        const newCard = document.createElement("div")
        newCard.classList.add("card")
        newCard.classList.add("border-light")
        newCard.classList.add("bg-secondary")
        newCard.setAttribute("style", "max-width:18rem;")

        const postImage = document.createElement("img")
        postImage.classList.add("card-img-top")
        postImage.setAttribute("src", `${backend_base_url}${post.image.after_image}`)

        const newCardFooter = document.createElement("div")
        newCardFooter.classList.add("card-footer")

        const postUser = document.createElement("p")
        postUser.classList.add("text-white")
        postUser.innerText = post.user

        const postTime = document.createElement("small")
        postTime.classList.add("text-white-50")
        postTime.innerText = post.update_at

        newCardFooter.append(postUser)
        newCardFooter.append(postTime)
        newCard.append(postImage)
        newCard.append(newCardFooter)
        newPost.append(newCard)
        post_list.append(newPost)
    })
}