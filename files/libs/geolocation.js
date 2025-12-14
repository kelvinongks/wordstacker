let seekInterval = null;
let callbackSuccess = null;
let callbackTracking = null;
let indexDest = null;
let idGeoWatch = null;

let options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
};

const LATLONG_DESTINATIONS = [
    { name: "佛牙寺", lat: 1.2812636438581986, lon: 103.84454345252028, pos: { x: 420, y: 650 }, rangeKm: 0.020 },
    { name: "硕莪巷", lat: 1.2815032559642328, lon: 103.84472565864971, pos: { x: 680, y: 650 }, rangeKm: 0.015 },
    //{ name: "硕莪巷", lat: 1.2814097594769256, lon: 103.84468993758665, pos: { x: 680, y: 650 } },
    { name: "马里安曼庙", lat: 1.2826243534824362, lon: 103.84537823397787, pos: { x: 1060, y: 430 }, rangeKm: 0.015 },
    { name: "詹美回教堂", lat: 1.2831209475648633, lon: 103.84567902698386, pos: { x: 1180, y: 350 }, rangeKm: 0.015 },
    { name: "宝塔街", lat: 1.2834329463740886, lon: 103.84429949578747, pos: { x: 720, y: 150 }, rangeKm: 0.015, extra: {  } },
    { name: "URA CENTRE", lat: 1.2798217203837414, lon: 103.84501714772267, pos: { x: 740, y: 200 }, rangeKm: 0.015, extra: {} },
    { name: "MAXWELL FOOD CENTRE", lat: 1.2803369794040445, lon: 103.84468203205611, pos: { x: 740, y: 200 }, rangeKm: 0.015, extra: {} },
]

function SetTracking(callback) {
    //console.log("set tracking");
    callbackTracking = callback;
    idGeoWatch = navigator.geolocation.watchPosition(WatchPositionSuccess, WatchPositionError, options)
}


function StopLocation() {
    //console.log("Stop location");
    navigator.geolocation.clearWatch(idGeoWatch);
    idGeoWatch = null;
    callbackTracking = null;
    callbackSuccess = null;
}
function GetLocation(index, callback) {
    //console.log("[GetLocation]");
    indexDest = index;
    callbackSuccess = callback;
    // dummy
    navigator.geolocation.getCurrentPosition(function () { }, function () { }, {
        timeout: 1000, enableHighAccuracy: false, maximumAge: 0 });

    navigator.geolocation.getCurrentPosition(function (pos) {
        //console.log("location check okay");
        //openWindow(pos);
        /*
        var currentPos = pos.coords.latitude + "," + pos.coords.longitude;
        var destPos = LATLONG_DESTINATIONS[0].lat + "," + LATLONG_DESTINATIONS[0].lon;
        window.open("https://www.google.com/maps/dir/" + currentPos + "/" + destPos);
        */
        //parent.jumpTo(PAGE_INDEX.INTRO_01);  
        if (!IsEmpty(callbackSuccess)) {
            callbackSuccess(true);
            callbackSuccess = null;
        }

        /*
        seekInterval = setInterval(function () {
            SeekDestnation(indexDest)
        }, 1000)
        */
        //idGeoWatch = navigator.geolocation.watchPosition(WatchPositionSuccess, WatchPositionError, options)


    }, errorCallback, options);
}

function CheckLocation(callback, errorCallback) {
    navigator.geolocation.getCurrentPosition(function (pos) {
        if (!IsEmpty(callback)) {
            //console.log("location check okay");
            callback(pos);
        }
    }, function (error) {
            if (!IsEmpty(errorCallback)) {
                //console.log("location check error");
                //console.log("error.code: " + error.code);
                errorCallback(error);
            }
    }, {
        timeout: 10000, enableHighAccuracy: false, maximumAge: 0
    });

    /*
    navigator.geolocation.getCurrentPosition(function (pos) {
        console.log("location check okay");
        parent.jumpTo(PAGE_INDEX.INTRO_01);
        scene01.showBtnProceed(true);
    }, errorCallback);
    */
}     


function WatchPositionSuccess(pos) {
    var dest = LATLONG_DESTINATIONS[indexDest];
    let dist = GetDistanceFromLatLonInKm(pos.coords.latitude, pos.coords.longitude, dest.lat, dest.lon);
    //console.log("dist: " + dist.toFixed(2) + "km");
    if (!IsEmpty(callbackTracking)) {
        callbackTracking(true, dist.toFixed(3), pos, indexDest);
    }
}

function WatchPositionError(error) {
    navigator.geolocation.clearWatch(idGeoWatch);
    if (!IsEmpty(callbackTracking)) {
        callbackTracking(false, error, null, indexDest);
        callbackTracking = null;
    }
    /*
    setTimeout(function () {
        idGeoWatch = navigator.geolocation.watchPosition(WatchPositionSuccess, WatchPositionError, options);
    }, 1000);
    */
}

function SeekDestnation(indexDest) {
    navigator.geolocation.getCurrentPosition(function (pos) {
        var dest = LATLONG_DESTINATIONS[indexDest];
        let dist = GetDistanceFromLatLonInKm(pos.coords.latitude, pos.coords.longitude, dest.lat, dest.lon);
        //console.log("dist: " + dist.toFixed(2) + "km");
        if (!IsEmpty(callbackTracking)) {
            callbackTracking(true, dist.toFixed(2));
        }
        //scene01.update(dist.toFixed(2) + "km", dest);
    }, errorCallback);
}

function GetDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = Deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = Deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(Deg2rad(lat1)) * Math.cos(Deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function Deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function errorCallback(error) {
    //clearInterval(seekInterval);
    //console.log("error.code: " + error.code);

    if (!IsEmpty(callbackSuccess)) {
        callbackSuccess(false, error, indexDest);
        callbackSuccess = null;
    }    
    if (!IsEmpty(callbackTracking)) {
        callbackTracking(false, error);
        callbackTracking = null;
    }

    //panelError.show("请启用定位追踪系统。")
    /*
    var embedMap = document.getElementById("embedMap");
    var divError = document.getElementById("dist");
    embedMap.style.display = "none";
    divError.style.display = "block";
    embedMap.style = "position: absolute; width:0; height:0; border: 0; border: none;"
    if (error.code === 1) {
        divError.innerHTML = "Pls allow location.";
    } else if (error.code === 2) {
        divError.innerHTML = "The network is down.";
    } else if (error.code === 3) {
        divError.innerHTML = "The attempt timed out.";
    } else {
        divError.innerHTML = "Unknown error.";
    }
    */
}