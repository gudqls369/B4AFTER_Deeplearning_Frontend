function func_agree() {
    var pw = document.getElementById("password");
    if (pw.type == "password") {
        pw.type = "text";
    } else {
        pw.type = "password";
    }
}

