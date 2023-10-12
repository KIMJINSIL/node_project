const msgAlert = (position, message, type) => {
    const Toast = Swal.mixin({
        toast : true,
        position : position,
        showConfirmButton  : false,
        timer : 2000,
    })
    Toast.fire({title:message, icon:type})
}

const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve,  reject);
    })
}

const courseCheckFetch = async (qrCode) => {
    //TODO 로그인 여부 체크 
    const accessToken = localStorage.getItem("accessToken");
    if(!accessToken){
        window.location.href = "/login?error=need_login";
    }

    //qrCode 올바른 데이터인지
    if(!qrCode){
        msgAlert("bottom", "잘못된 QR코드입니다", "error");
        setTimeout(startScane, 3000);
        return;
    }

    //내가 찍은 위치정보(qr코드를 스캔했을 때 내가 어디에 있는지)
    const curruntPosition = await getCurrentPosition();
    const coords = curruntPosition.coords
    if(!coords){
        msgAlert("bottom", "위치정보 오류", "error");
        setTimeout(startScane, 3000);
        return;
    };    

    //서버전송
    //qr코드, 현재 사용자 위치정보(latitude, longitude)
    const response = await fetch('/api/courses', {
        method:'POST',
        headers: {
            'Content-type': 'application/json',
            Accept : 'applicatoin/json',
            Authorization : `Bearer ${accessToken}`
        }, 
        body: JSON.stringify({
            qrCode : qrCode,
            latitude : coords.latitude,
            longitude : coords.longitude,
        })
    })
    const result = await response.json();

    if(response.status === 201){
        msgAlert("center", "방문 완료", "success");
        return setTimeout(()=>{
            window.location.href = "/course";
        }, 3000)
    }else if(response.status === 401){
        msgAlert("center", result.status, "error");
        return setTimeout(()=>{
            window.location.href = "/login?error=need_login";
        }, 3000)
    }else{
        msgAlert("center", result.status, "error");
    }
    setTimeout(startScane, 3000);
}

const startScane = () => {
    let video = document.createElement("video");
    let canvasElement = document.getElementById("canvas");
    let canvas = canvasElement.getContext("2d");

    //줄 그리는 함수
    const drawLine = (begin, end, color) => {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 4;
        canvas.strokeStyle = color;
        canvas.stroke();
    
    }
    
    //비디오 스트림에 qr코드 인식 적용
    const tick = () => {
        if(video.readyState === video.HAVE_ENOUGH_DATA){
            //  css
            canvasElement.height = 400;
            canvasElement.width = 400;
    
            canvas.drawImage(video, 0, 0, canvasElement.height, canvasElement.width);
    
            // 캔버스에 이미지 데이터를 가져와서 qr코드를 스캔한다.
            let imageData = canvas.getImageData(
                0, 0, canvasElement.width, canvasElement.height
            )
    
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts : "dontInvert"
            });
            
            if(code){
                drawLine(
                    code.location.topLeftCorner,
                    code.location.topRightCorner,
                    "#FF0000"
                );
                drawLine(
                    code.location.topRightCorner,
                    code.location.bottomRightCorner,
                    "#FF0000"
                );
                drawLine(
                    code.location.bottomRightCorner,
                    code.location.bottomLeftCorner,
                    "#FF0000"
                );
                drawLine(
                    code.location.bottomLeftCorner,
                    code.location.topLeftCorner,
                    "#FF0000"
                );
                console.log(code.data);
                return courseCheckFetch(code.data);
            }
        }
        requestAnimationFrame(tick);
    }

navigator.mediaDevices
    .getUserMedia({video:{facingMode:"environment"}})
    .then((stream) => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);
    }).catch(function(err){
        console.log(err);
    })

}

startScane();