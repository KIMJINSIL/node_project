const usersNav = document.getElementById("usersNav");

const notLoginHtml = () => {
    let html = "";
    html += `<a href="/login"><button>로그인</button></a>`
    console.log(html);
    usersNav.innerHTML = html;
}

const logout = () => {
    localStorage.removeItem("accessToken");
    location.reload();
}

const loginHtml = (data) => {
    let html = "";
    html += `<div class="user-info">`
    if (data.user_image) {
      html += `<img src="${data.user_image}" alt="유저 이미지">`
    } else {
      html += `<img src="/file/people.jpg" alt="유저 이미지">`
    }
    html += `
              <span>${data.user_name}</span>
            </div>`
    html += `<button class="logout-btn" onclick="logout()">로그아웃</button>`
    usersNav.innerHTML = html;
  }


const checkUserInfo = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        notLoginHtml();
        return;
    }
    const response = await fetch("/api/token/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        }
    });
    const result = await response.json();

    if(response.status === 200) {
        loginHtml(result);
    } else {
        notLoginHtml();
    }
}
checkUserInfo();