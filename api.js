const backend_base_url = 'http://127.0.0.1:8000'
const frontend_base_url = 'http://127.0.0.1:5501'

// 게시글 GET[index.html]
async function getPosts(){
    const response = await fetch(`${backend_base_url}/post/`, {
        method:'GET',
    })
    response_json = await response.json()
    return response_json
}
