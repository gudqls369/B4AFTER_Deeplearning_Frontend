function func_agree() {

    var pw = document.getElementById("password");
    if (pw.type == "password") {
        pw.type = "text";
    } else {
        pw.type = "password";
    }

    var pw2 = document.getElementById("password2");
    if (pw2.type == "password") {
        pw2.type = "text";
    } else {
        pw2.type = "password";
    }
}