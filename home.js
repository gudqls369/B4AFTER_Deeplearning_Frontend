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
        beforeImage();
    } else {
        alert("이미지 파일이 아닙니다.");
        dropArea.classList.remove("active");
        dragText.textContent = "드래그 하여 이미지 업로드";
    }
}


// 이미지 백엔드로 전송
// async function beforeImage() {
//     const beforeimage = document.getElementById("beforeimage")
//     console.log(beforeimage)
//     console.log(file)

//     const response = await fetch(`${backend_base_url}/post/upload/`, {
//         headers: {
//             'Authorization': 'Bearer ' + localStorage.getItem("access"),
//         },
//         method: 'POST',
//         body: new URLSearchParams({
//             "before_image": file,
//         })
//     })
// }


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


checkLogin();