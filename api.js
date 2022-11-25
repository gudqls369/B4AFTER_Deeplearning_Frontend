const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'http://127.0.0.1:5500'

// 회원가입 API
async function handleSignup() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/user/signup/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    // 로그인이 성공하면 홈으로 이동
    if (response.status == 201) {
        location.replace("home.html")
    }
}

// 로그인 API
async function handleLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const response = await fetch(`${backend_base_url}/user/api/token/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })

    // 로컬스토리지에 토큰 저장
    const response_json = await response.json()
    localStorage.setItem("access", response_json.access);
    localStorage.setItem("refresh", response_json.refresh);

    // 로컬스토리지에 토큰 정보 저장
    const base64Url = response_json.access.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    localStorage.setItem("payload", jsonPayload);

    // 로그인이 성공하면 홈으로 이동
    if (response.status == 200) {
        location.replace("home.html")
    }
}


// 로그인 시 정보 가져오기
async function getName() {
    const response = await fetch(`${backend_base_url}/user/mock/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access")
        }
    })

    if (response.status == 200) {
        const payload = localStorage.getItem("payload");
        const payload_parse = JSON.parse(payload)
        console.log(payload_parse.username)
        return payload_parse.username
    } else {
        return null
    }
}


// 로그아웃
function logout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    window.location.replace(`${frontend_base_url}/home.html`)
}


// 게시글 GET
async function getPosts() {
    const response = await fetch(`${backend_base_url}/post/`, {
        method: 'GET',
    })
    response_json = await response.json()
    return response_json
}

// 이미지 POST
async function postImage() {
    const image = document.getElementById("before_image").files[0]
    const imageData = new FormData()
    imageData.append("image", image)

    const response = await fetch(`${backend_base_url}/post/upload/`, {
        method: 'POST',
        body: imageData
    })

    response_json = await response.json()[arr.length - 1];
    return response_json
}

// 이미지 GET
async function getImages() {
    const response = await fetch(`${backend_base_url}/post/upload/`, {
        method: 'GET',
    })
    response_json = await response.json()
    response_json_a = response_json[response_json.length - 1];
    console.log(response_json_a)
    return response_json_a
}


// 게시글 POST
async function postPost(content) {
    const image_id = await getImages();
    console.log(image_id.id)
    const response = await fetch(`${backend_base_url}/post/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "image": image_id.id,
            "content": content
        })
    })
    response_json = await response.json()
    console.log(response_json)
    return response_json
}

// 상세 페이지로 이동
function postDetail(post_id) {
    const url = `${frontend_base_url}/post_detail.html?id=${post_id}`
    location.href = url
}

// 상세 페이지 GET
async function getPostDetail(post_id) {
    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        method: 'GET'
    })

    response_json = await response.json()
    return response_json
}

// 댓글 GET
async function getComments() {
    const response = await fetch(`${backend_base_url}/post/${post_id}/comment/`, {
        method: 'GET',
    })

    response_json = await response.json()
    return response_json
}

async function putPost(post_id, content) {
}