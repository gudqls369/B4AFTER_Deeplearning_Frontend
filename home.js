// 이미지 업로드
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
        uploadImage()
    } else {
        alert("이미지 파일이 아닙니다.");
        dropArea.classList.remove("active");
        dragText.textContent = "드래그 하여 이미지 업로드";
    }
}

// 이미지 DB 업로드
async function uploadImage(){
    console.log(file)
    const imageData = new FormData()
    imageData.append("before_image", file)
    for (var pair of imageData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]);
        }

    const response = await fetch('http://127.0.0.1:8000/post/upload/', {
        method:'POST',
        headers: {
            'Authorization':'Bearer '+localStorage.getItem("access"),
        },
        body: imageData
        
    })

    if (response.status == 201){
        return response
    }else{
        alert('로그인 해주세요')
    }
}




// 이미지 파일 변환
async function transferImage(){
    const beforeimg = document.getElementById("beforeimage").value

    const response = await fetch('http://127.0.0.1:8000/post/upload/', {
        headers: {
            'Authorization':localStorage.getItem("token")},
        method: 'PUT',
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    })
    
    if (response.status == 200){
        return response
    }else{
        alert(response.status)
    }
}


// 로그인 여부 확인
async function checkLogin() {
    const name = await getName();
    console.log(name)
    const loginoutButton = document.getElementById("loginout")
    if(name){
        loginoutButton.innerText = "로그아웃"
        loginoutButton.setAttribute("onclick", "logout()")
    }else{
        loginoutButton.innerText = "로그인"
        loginoutButton.setAttribute("onclick", "location.href='/login.html'")
    }
}

// 유저 정보 가져오기
// window.onload = () => {
//     const payload = localStorage.getItem("payload");
//     const payload_parse =JSON.parse(payload)
//     console.log(payload_parse.username)
// }

// 게시글 보기
async function loadPosts(){
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
        newCard.setAttribute("style", "max-width:30rem;")

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

async function createPost(){
    window.location.href = `${frontend_base_url}/create_post.html`
}

checkLogin();
loadPosts();
