function func_agree() {
    var pw = document.getElementById("password");
    if (pw.type == "password") {
        pw.type = "text";
    } else {
        pw.type = "password";
    }
}


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


checkLogin();