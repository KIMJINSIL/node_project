const locationMap = document.getElementById("location-map");
let map;
let markers = []; 
let isMapDrawn = false;
let userLatitude;
let userLongitude;

console.log(locationMap);

const drawMap = (latitude, lognitude) => {
    const options = {
        center : new kakao.maps.LatLng(latitude, lognitude),
        level : 2
    };
    map = new kakao.maps.Map(locationMap, options);
    map.setZoomable(false);
}

const deleteMakers = () => {
    for(let i=0; i<markers.length; i++){
        markers[i].setMap(null);
    }
    markers = [];
}

const addUserMarker = () =>{
    let marker = new kakao.maps.Marker({
        map : map,
        position : new kakao.maps.LatLng(userLatitude, userLongitude)
    });
    markers.push(marker);
}

const addCourseMaker = () =>  {
    let markerImage = "/file/map_not_done.png";
    let markerSize = new kakao.maps.Size(24,28);

    const image = new kakao.maps.MarkerImage(markerImage, markerSize);
    const position = new kakao.maps.LatLng(35.87580328326801, 128.6813941363172);
    new kakao.maps.Marker({
        map : map,
        position : position,
        title : "영진",
        image : image
    })
}

const configurationLocationWatch = () => {
    if(navigator.geolocation){
        navigator.geolocation.watchPosition((position) => {

            deleteMakers();
            
            userLatitude = position.coords.latitude;
            userLongitude = position.coords.longitude;
            if(!isMapDrawn){
                drawMap(userLatitude,userLongitude)
                isMapDrawn  = true;
            }
            //유저 마커 그리기
            addUserMarker();
        })
    }
}


configurationLocationWatch();