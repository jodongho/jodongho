var map; 
var markers = [];
var positions;
var storeList;
var loadYn = "N";
var loadYn2 = "N";

/*function apInit_kakao(x,y){
    //alert('=jjj=apInit_kakao=');
    $(".map_finding").hide();
    $(".nearby_info").show();
    $(".nearby_map").show();
    
    if(localStorage.getItem("useLoc") == "Y"){
        $(".useLocRecom").hide();
    }else{
        $(".useLocRecom").show();
    }
    
    var container = document.getElementById('map');
    var options = {
            center: new daum.maps.LatLng(x, y),
            level: 7 // 지도의 확대 레벨
    };
    
    map = new daum.maps.Map(container, options);
    
    // 마우스 드래그로 지도 이동이 완료되었을 때 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    daum.maps.event.addListener(map, 'dragend', function() {        
        
        // 지도 중심좌표를 얻어옵니다 
        var latlng = map.getCenter(); 
        
        var message = '변경된 지도 중심좌표는 ' + latlng.getLat() + ' 이고, ';
        message += '경도는 ' + latlng.getLng() + ' 입니다';
        message += '지도레벨은 ' + map.getLevel() + ' 입니다';
        console.log("===jjj==="+message);

        getNearStoreList(latlng.getLat(), latlng.getLng(), map.getLevel());
        
    });
    
    // 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
//    var zoomControl = new daum.maps.ZoomControl();
//    map.addControl(zoomControl, daum.maps.ControlPosition.RIGHT);

 // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
    daum.maps.event.addListener(map, 'zoom_changed', function() {        
         // 지도의 현재 레벨을 얻어옵니다
        var mapLevel = map.getLevel();
        
        var message = '현재 지도 레벨은 ' + mapLevel + ' 입니다';
        console.log("===jjj==="+message);
        
        if(mapLevel > 6){
            map.setLevel(7);
        }
        
        // 지도 중심좌표를 얻어옵니다 
        var latlng = map.getCenter();         
        getNearStoreList(latlng.getLat(), latlng.getLng(), map.getLevel());
        
    });
    
    var options = { // Drawing Manager를 생성할 때 사용할 옵션입니다
            map: map, // Drawing Manager로 그리기 요소를 그릴 map 객체입니다
            drawingMode: [ // drawing manager로 제공할 그리기 요소 모드입니다
                daum.maps.drawing.OverlayType.MARKER,
                daum.maps.drawing.OverlayType.POLYLINE,
                daum.maps.drawing.OverlayType.RECTANGLE,
                daum.maps.drawing.OverlayType.CIRCLE,
                daum.maps.drawing.OverlayType.POLYGON
            ],
            // 사용자에게 제공할 그리기 가이드 툴팁입니다
            // 사용자에게 도형을 그릴때, 드래그할때, 수정할때 가이드 툴팁을 표시하도록 설정합니다
            guideTooltip: ['draw', 'drag', 'edit'], 
            markerOptions: { // 마커 옵션입니다 
                draggable: true, // 마커를 그리고 나서 드래그 가능하게 합니다 
                removable: true // 마커를 삭제 할 수 있도록 x 버튼이 표시됩니다  
            },
            polylineOptions: { // 선 옵션입니다
                draggable: true, // 그린 후 드래그가 가능하도록 설정합니다
                removable: true, // 그린 후 삭제 할 수 있도록 x 버튼이 표시됩니다
                editable: true, // 그린 후 수정할 수 있도록 설정합니다 
                strokeColor: '#39f', // 선 색
                hintStrokeStyle: 'dash', // 그리중 마우스를 따라다니는 보조선의 선 스타일
                hintStrokeOpacity: 0.5  // 그리중 마우스를 따라다니는 보조선의 투명도
            },
            rectangleOptions: {
                draggable: true,
                removable: true,
                editable: true,
                strokeColor: '#39f', // 외곽선 색
                fillColor: '#39f', // 채우기 색
                fillOpacity: 0.5 // 채우기색 투명도
            },
            circleOptions: {
                draggable: true,
                removable: true,
                editable: true,
                strokeColor: '#39f',
                fillColor: '#39f',
                fillOpacity: 0.5
            },
            polygonOptions: {
                draggable: true,
                removable: true,
                editable: true,
                strokeColor: '#39f',
                fillColor: '#39f',
                fillOpacity: 0.5,
                hintStrokeStyle: 'dash',
                hintStrokeOpacity: 0.5
            }
        };

        // 위에 작성한 옵션으로 Drawing Manager를 생성합니다
        manager = new daum.maps.drawing.DrawingManager(options);
        
        getNearStoreList(x, y, map.getLevel());
}*/

//버튼 클릭 시 호출되는 핸들러 입니다
/*function selectOverlay(type) {
  // 그리기 중이면 그리기를 취소합니다
  manager.cancel();

  // 클릭한 그리기 요소 타입을 선택합니다
  manager.select(daum.maps.drawing.OverlayType[type]);
}*/


/*
function searchAddrFromCoords(coords, callback) {
  // 주소-좌표 변환 객체를 생성합니다
  var geocoder = new daum.maps.services.Geocoder();
  // 좌표로 행정동 주소 정보를 요청합니다
  geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
}*/

//지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
/*function displayCenterInfo(result, status) {
  if (status === daum.maps.services.Status.OK) {
      var infoDiv = document.getElementById('locAddr');
      for(var i = 0; i < result.length; i++) {
          // 행정동의 region_type 값은 'H' 이므로
          if (result[i].region_type === 'H') {
              infoDiv.innerHTML = result[i].address_name;
              break;
          }
      }
  }    
}*/

//스토어 가져오기
/*function getNearStoreList(lat, lon, mapLevel){
    
    var distKm = 0;
    var distKmStr = "";
    switch(mapLevel){
        case 7 : distKm = 1.1; distKmStr = "1Km"; break;
        case 6 : distKm = 0.7; distKmStr = "500m"; break;
        case 5 : distKm = 0.30; distKmStr = "250m"; break;
        case 4 : distKm = 0.20; distKmStr = "100m"; break;
        case 3 : distKm = 0.15; distKmStr = "50m"; break;
        case 2 : distKm = 0.15; distKmStr = "30m"; break;
        case 1 : distKm = 0.08; distKmStr = "20m"; break;
        default : distKm = 0; distKmStr = ""; break;
    }
  $("#distKmStr").html(distKmStr);
    
  //주변매장 조회
  common.Ajax.sendJSONRequest(
          "POST"
          , _baseUrl + "store/getStoreListJson.do?searchType=near&usrLat="+lat+"&usrLng="+lon+"&distKm="+distKm
          , ""
          , mstore.main._callback_getNewStoreListAjax);    
}*/

//지도에 마커와 인포윈도우를 표시하는 함수입니다
/*function displayMarker(positions) {
    // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
    
  // 마커 이미지의 이미지 주소입니다
  //  var imageSrc = "http://t1.daumcdn.net/localimg/localimages/07/2015/mobileweb/mks/marker_place_off.png"; 
  var imageSrc = _cssUrl + '../image/comm/marker_place_off.png'; 
  
  // 마커 이미지의 이미지 크기 입니다
  var imageSize = new daum.maps.Size(24, 35); 
  
  // 마커 이미지를 생성합니다    
  var markerImage = new daum.maps.MarkerImage(imageSrc, imageSize); 

  // 지도를 재설정할 범위정보를 가지고 있을 LatLngBounds 객체를 생성합니다
  var bounds = new daum.maps.LatLngBounds(); 
  
  markers = [];  
  for (var i = 0; i < positions.length; i ++) {
      // 마커를 생성합니다
      var marker = new daum.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i].latlng, // 마커를 표시할 위치
          title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image : markerImage // 마커 이미지 
      });
      
      //===인포윈도우===//
//      var iwContent = "<span id="+positions[i].title+">"+positions[i].title+"</span>";
//
//      // 인포윈도우를 생성합니다
//      var infowindow = new daum.maps.InfoWindow({
//          position : positions[i].latlng, 
//          content : iwContent 
//      });
//        
//      // 마커 위에 인포윈도우를 표시합니다. 두번째 파라미터인 marker를 넣어주지 않으면 지도 위에 표시됩니다
//      infowindow.open(map, marker); 
      //===인포윈도우===//
     
      // 마커가 지도 위에 표시되도록 설정합니다
      marker.setMap(map); 
      // 생성된 마커를 배열에 추가합니다
      markers.push(marker);
      //마커이벤트등록
      mapMarkerListener(markers[i],i);
      
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(positions[i].latlng);
  
  }// end of for
  console.log("==jjj===표시된 마커수=="+markers.length);
  
  // 내위치 마커를 생성합니다(내위치 허용되어 있을 경우에만)
  if(localStorage.getItem("useLoc") == 'Y'){
      // 마커 이미지를 생성합니다    
      var markerImage_my = new daum.maps.MarkerImage(_cssUrl + '../image/comm/marker_now.png' , new daum.maps.Size(24, 24)); 
//      var markerImage_my = new daum.maps.MarkerImage("http://t1.daumcdn.net/localimg/localimages/07/2015/mobileweb/mks/marker_now.png" , new daum.maps.Size(24, 35)); 
      
      var marker_my= new daum.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: new daum.maps.LatLng($("#usrLat").val(), $("#usrLng").val()),
          title : "현위치", // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          image : markerImage_my// 마커 이미지 
      });
      marker_my.setMap(map);
      
      markers.push(marker_my);
  }
}*/

/*function mapMarkerListener(targetMarker,j){     // 스크립트 로드 순서때문에 따로 작성 ( 해당 지점에 대한 설명 출력 )
    daum.maps.event.addListener(targetMarker, "click", function(){
        mstore.common.setMapEvent(storeList[j].strNo);
    });
 }
*/
//배열에 추가된 마커들을 지도에 표시하거나 삭제하는 함수입니다
/*function setMarkers(map) {
  for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
  }            
}*/

//function onSuccessGeolocation(position) {
//    mstore.main.storeListAjax(true,position);
//}
//
//// 201912 fixed
//function onErrorGeolocation(error) {
//    mstore.main.storeListAjax(false,null);
//}

function onSuccessGeolocationApp() {
//    alert("=jjj========onSuccessGeolocationApp====loadYn====="+loadYn);
    
      localStorage.setItem("useLoc", "Y");
      mstore.main.getNearStoreListAjax(); 
      /*mstore.main.getNewStoreListAjax();*/
}

function onErrorGeolocationApp(error) {
//    alert("=jjj==onErrorGeolocationApp===loadYn="+loadYn+" loadYn2"+loadYn2+" useloc="+localStorage.getItem("useLoc"));
    if(loadYn == "N"){//매장 호출 안했을 경우에만 호출하도록 설정. geo가 뭐때문인지 error 상황이면 자꾸 재귀호출함 ㅠㅠ..
        loadYn = "Y";
    
        if(common.app.appInfo.isapp){
            location.href = "oliveyoungapp://getLocationSettings";
        }else{
            if(error.code == 1){
               if(confirm("올리브영이(가) 이 기기의 위치정보에 접근(를) 할 수 있도록 허용하시겠습니까?\n만약 하고싶으면 단말기 GPS켜라")){
                    localStorage.setItem("useLoc", "N");
                }else{
                    localStorage.setItem("useLoc", "N");
                }
            }else if(error.code == 3){
                localStorage.setItem("useLoc", "Y");
            }else if(error.code == 2){//위치 정보 수집 불가(예: GPS 동작 불가 지역 등)
                alert("현위치 탐색중 오류가 발생하였습니다.");
            }
            mstore.main.getNearStoreListAjax();
            /*mstore.main.getNewStoreListAjax();*/
        }
    }
}

//‘퍼미션 허용여부’(Y/N), ‘GPS 허용여부'(Y/N)
function setLocationSettings(permissionYn, gpsYn) {
//  alert('=jjj=setLocationSettings 매장관리에서 호출되었습니다 permissionYn:'+permissionYn + " gpsYn:"+gpsYn);  
  if(permissionYn == "Y"){
      localStorage.setItem("useLoc", "Y");
  }else{
      localStorage.setItem("useLoc", "N");
  }
  mstore.main.getNearStoreListAjax(); //navigator.geolocation 판단함
  /*mstore.main.getNewStoreListAjax();*/
}