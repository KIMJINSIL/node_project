const joinBtn = document.getElementById("joinBtn");
const userIdInput = document.getElementById("userId");
const userPasswordInput = document.getElementById("userPassword");
const userNameInput = document.getElementById("userName");

const msgAlert = (position, message, type) => {
    const Toast = Swal.mixin({
        toast : true,
        position : position,
        showConfirmButton  : false,
        timer : 2000,
    })
    Toast.fire({title:message, icon:type})
}

const joinFetch = async () => {
    const userId = userIdInput.value;
    const userPassword = userPasswordInput.value;
    const userName = userNameInput.value;

    if(!userId || !userPassword  || !userName){
        msgAlert("bottom", "모든 필드를 채워주세요", "error");
    }

    const response = await fetch("/api/join", {
        method : 'POST',
        headers : {
            'Content-Type' : "application/json",
            Accept : "application/json",
        }, 
        body : JSON.stringify({
            userId : userId,
            userPassword : userPassword,
            userName : userName,
        })
    })
    const result = await response.json();

    if(response.status === 201){
        msgAlert("center", "회원가입 성공", "success");
        setTimeout(()=>{
            window.location.href = "/login";
        }, 1000)
    }else{
        msgAlert("bottom", result.status, "error");
    }

}
joinBtn.addEventListener("click",joinFetch)