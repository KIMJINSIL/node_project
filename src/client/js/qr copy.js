const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  )};
  
  const courseCheckFetch = async (qrCode) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      window.location.href = "/login?error=need_login";
    }
    
    if(!qrCode) {
      msgAlert("bottom", "잘못된 qr코드입니다.", "error");
      setTimeout(startScan, 3000);
      return;
    }
  
    // 내 위치 정보 가져오기
    const { coords } = await getCurrentPosition();
    if (!coords) {
      msgAlert("bottom", "위치정보를 가져올 수 없습니다.", "error");
      setTimeout(startScan, 3000);
      return;
    }
  
    try {
      const response = await fetch('/api/course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          qrCode,
          latitude : coords.latitude,
          longitude : coords.longitude,
        }),
      });  
      const result = await response.json();
  
      if(response.status == 200) {
        msgAlert("center", "방문 완료", "success");
        setTimeout(() => {
          window.location.href = "/course";
        }, 1000); 
      } else if (response.status === 400) {
        if (result.message === "위치 정보 없음") msgAlert("bottom", "위치정보를 가져올 수 없습니다.", "error");
        else if (result.message === "위치 적용 범위 초과") msgAlert("bottom", "목표물의 100m 반경에 있어야합니다.", "error");
        else msgAlert("bottom", "잘못된 qr코드입니다.", "error");
      } else if (response.status === 401) {
        if (result.message === "토큰 만료") return window.location.href = "/login?error=expired";
        else return window.location.href = "/login?error=need_login";
      } else if (response.status === 409) {  
        msgAlert("bottom", "이미 방문한 코스입니다.", "error");
      } else {
        msgAlert("bottom", "서버 에러", "error");
      }
    } catch(error) {
      console.error("Error:", error);
      msgAlert("bottom", "서버 통신 오류", "error");
    }
    setTimeout(startScan, 3000);
  }
  
  function startScan() {
    // 비디오 요소 생성 및 캔버스 설정
    let video = document.createElement("video");
    let canvasElement = document.getElementById("canvas");
    let canvas = canvasElement.getContext("2d");
  
    // QR 코드 테두리를 그리는 함수
    function drawLine(begin, end, color) {
      canvas.beginPath();
      canvas.moveTo(begin.x, begin.y);
      canvas.lineTo(end.x, end.y);
      canvas.lineWidth = 4;
      canvas.strokeStyle = color;
      canvas.stroke();
    }
  
    // 사용자의 카메라에 액세스하여 비디오 스트림을 가져오는 코드 부분
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.play();
        requestAnimationFrame(tick);
      })
      .catch(function (err) {
        console.error("Error accessing the camera", err);
        msgAlert("bottom", "카메라 접근에 실패했습니다.", "error");
      });
  
    // 각 프레임에서 호출되어 QR 코드를 스캔하는 함수
    function tick() {
      // 비디오가 충분한 데이터를 가지고 있는지 확인
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // 캔버스의 크기를 설정하고 비디오 프레임을 그립니다.
        canvasElement.height = 400;
        canvasElement.width = 400;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        
        // 현재 캔버스에서 이미지 데이터를 가져와서 QR 코드를 스캔합니다.
        let imageData = canvas.getImageData(
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );
  
        // jsQR 라이브러리를 사용하여 QR 코드를 찾습니다.
        var code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
  
        // QR 코드가 찾지 않은 경우 대기 텍스트를 숨깁니다.
        const waitText = document.querySelector(".wait-text");
        waitText.classList.add("hidden");
  
        // QR 코드를 찾은 경우
        if (code) {
          // QR 코드 주변에 테두리를 그립니다.
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
          
          // QR 코드에 저장된 데이터를 사용하여 어떤 작업을 수행합니다. 
          return courseCheckFetch(code.data);
        }
      }
  
      // 다음 프레임에 대해 함수를 다시 호출합니다.
      requestAnimationFrame(tick);
    }
  }
  
  
  userCheckFetch();
  getCurrentPosition();
  startScan();