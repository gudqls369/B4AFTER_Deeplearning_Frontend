const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'http://127.0.0.1:5500'

// 회원가입 API
async function handleSignup() {
    var p1 = document.getElementById('password').value;
    var p2 = document.getElementById('password2').value;
    
    if(p1.length == 0) {
        alert('비밀번호를 입력해주세요');
        return false;
    }
        
    if( p1 != p2 ) {
        alert("비밀번호가 일치하지 않습니다");
        return false;
    }else{
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

        response_json = await response.json()
        
        // 로그인이 성공하면 홈으로 이동
        if (response.status == 201) {
            location.replace("login.html")
        }else {
            alert('이미 존재하는 아이디입니다')          
        }
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

    if (response.status == 200) {
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
        location.replace("home.html")
    }else{
        alert('아이디 혹은 비밀번호를 잘못입력했습니다')
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
    alert('로그아웃 하셨습니다')
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
async function postImage(){
    const image = document.getElementById("before_image").value
    const imageData = new FormData()
    imageData.append("image", image)

    const response = await fetch(`${backend_base_url}/post/upload/`, {
        method:'POST',
        headers: {
            'contentType' : 'multipart/form-data',
            'Authorization':localStorage.getItem("token")},
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
    const payload = localStorage.getItem("payload");
    const payload_parse = JSON.parse(payload)
    
    if(payload_parse == null){
        alert('로그인 해주세요')
    }else if(payload_parse.username != response_json_a.user){
        const result = response_json.filter(function (r) { return r.user == payload_parse.username })
        const result_image = result[result.length -1]
        return result_image
    }else{
        return response_json_a
    }
}

// 게시글 POST
async function postPost(content) {
    const image_id = await getImages();
    const response = await fetch(`${backend_base_url}/post/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
            "image": image_id.id,
            "content": content
        })
    })
    response_json = await response.json()
    
    if(response.status == 201){
        alert('글 작성을 완료했습니다')
        window.location.reload(`${frontend_base_url}/home.html`)
    }else{
        const postContent = document.getElementById('input_content')
        if(postContent.value == ''){
            alert('글을 입력해주세요')
        }else{
            alert('로그인 해주세요')
        }
    }
}

// 상세 페이지로 이동
function postDetail(post_id){
    const url = `${frontend_base_url}/post_view.html?id=${post_id}`
    location.href=url
}

// 상세 페이지 GET
async function getPostDetail(post_id) {
    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        method: 'GET'
    })

    response_json = await response.json()
    return response_json
}

// 상세 페이지 PUT
async function putPost(post_id, content){
    const postData = {
        "content":content
    }

    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method:'PUT',
        body:JSON.stringify(postData)
    })

    if(response.status){
        alert('수정 되었습니다')
        response_json = await response.json()
        return response_json
    }else{
        alert('수정 권한이 없습니다')
    }
}

// 상세 페이지 DELETE
async function deletePost(post_id){
    const response = await fetch(`${backend_base_url}/post/${post_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access")
        },
        method:'DELETE',
    })

    if(response.status == 204){
        window.location.replace(`${frontend_base_url}/home.html`)
        alert('삭제 되었습니다')
    }else{
        alert('삭제 권한이 없습니다')
    }
} 

// 댓글 GET
async function getComments() {
    const response = await fetch(`${backend_base_url}/post/${post_id}/comment/`, {
        method: 'GET',
    })

    response_json = await response.json()
    return response_json
}

// 댓글 PUT
async function putComment(post_id, comment_id, content){
    const commentData = {
        "content":content
    }

    const response = await fetch(`${backend_base_url}/post/${post_id}/comment/${comment_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method:'PUT',
        body:JSON.stringify(commentData)
    })

    if(response.status == 200){
        alert('수정되었습니다')
        response_json = await response.json()
        return response_json
    }else{
        alert('수정 권한이 없습니다')
    }
}

// 댓글 DELETE
async function deleteComment(post_id, comment_id){
    const response = await fetch(`${backend_base_url}/post/${post_id}/comment/${comment_id}/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
        },
        method:'DELETE',
    })

    if(response.status == 204){
        window.location.reload(`${frontend_base_url}/post_view.html`)
        alert('삭제 되었습니다')
    }else{
        alert('삭제 권한이 없습니다')
    }
}

// 댓글 POST
async function postComment(post_id, content){
    const commentData = {
        "content":content
    }

    const response = await fetch(`${backend_base_url}/post/${post_id}/comment/`, {
        headers:{
            'Authorization':'Bearer '+localStorage.getItem("access"),
            'content-type':'application/json'
        },
        method:'POST',
        body:JSON.stringify(commentData)
    })

    if(response.status == 201){
        response_json = await response.json()
        return response_json
    }else{
        alert('로그인 해주세요')
    }
}
