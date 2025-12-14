"use strict"

var currPlatform = null;
var currDevice = null;

// Set the name of the "hidden" property and the change event for visibility
var hidden, visibilityChange;

if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") { // Firefox up to v17
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") { // Chrome up to v32, Android up to v4.4, Blackberry up to v10
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function AddVisibilityChange(handler) {
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
        alert("This demo requires a modern browser that supports the Page Visibility API.");
    } else {
        // Handle page visibility change   
        //console.log("Add visibility change");
        document.addEventListener(visibilityChange, handler, false);

        /*
        // When the video pauses and plays, change the title.
        videoElement.addEventListener("pause", function () {
            document.title = 'Paused';
        }, false);

        videoElement.addEventListener("play", function () {
            document.title = 'Playing'
        }, false);
        */
    }
}

function RemoveVisibilityChange(handler) {
    // Warn if the browser doesn't support addEventListener or the Page Visibility API
    if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
        //alert("This demo requires a modern browser that supports the Page Visibility API.");
    } else {
        // Handle page visibility change   
        //console.log("remove visibility change");
        document.removeEventListener(visibilityChange, handler, false);
    }
}

function IsEmpty(value)
{
    return value === undefined || value === null || value === "";
}


function Intersect(obj1, obj2) {
    var objBounds1 = obj1.getBounds().clone();
    var objBounds2 = obj2.getBounds().clone();

    var pt = obj1.globalToLocal(objBounds2.x, objBounds2.y);
    
    var h1 = -(objBounds1.height / 2 + objBounds2.height);
    var h2 = objBounds2.width / 2;
    var w1 = -(objBounds1.width / 2 + objBounds2.width);
    var w2 = objBounds2.width / 2;

    //console.log("pt.y: " + pt.y);
    //console.log("h1: " + h1);
    //console.log("h2: " + h2);

    if (pt.x > w2 || pt.x < w1) return false;
    if (pt.y > h2 || pt.y < h1) return false;

    return true;
}

function IntersectRect2Rect(obj1, obj2) {
    var objBounds1 = obj1.getBounds().clone();
    var objBounds2 = obj2.getBounds().clone();    
    if (obj1.x + objBounds1.width >= obj2.x &&    // r1 right edge past r2 left
        obj1.x <= obj2.x + objBounds2.width &&    // r1 left edge past r2 right
        obj1.y + objBounds1.height >= obj2.y &&    // r1 top edge past r2 bottom
        obj1.y <= obj2.y + objBounds2.height) {    // r1 bottom edge past r2 top
        return true;
    }
    return false;
}

function IntersectRect2RectComplex(obj1, obj2) {    
    if (obj1.x + obj1.width >= obj2.x &&    // r1 right edge past r2 left
        obj1.x <= obj2.x + obj2.width &&    // r1 left edge past r2 right
        obj1.y + obj1.height >= obj2.y &&    // r1 top edge past r2 bottom
        obj1.y <= obj2.y + obj2.height) {    // r1 bottom edge past r2 top
        return true;
    }
    return false;
}

function RealDistanceBetween2Points(startX, startY, endX, endY) {
    var a = startX - endX;
    var b = startY - endY;
    var dist = Math.sqrt(a * a + b * b);    
    if (a > 0) dist *= -1;
    return dist;
}

function CheckMobileDevice() {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

// check if android, ios or ipad
function IsMobileDevice() {
    if (IsEmpty(currDevice)) {
        GetPlatform();
    }
    return currDevice === DEVICE.MOBILE;
};

function IsIpad() {
    return (navigator.userAgent.match(/Mac/) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
}

function IsIOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function GetBrowser() {
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf("Chrome") != -1
        || navigator.userAgent.match('CriOS')) {
        return 'Chrome';
    } else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) {
        return 'IE';//crap
    } else if (navigator.userAgent.indexOf("Safari") != -1) {
        return 'Safari';
    } else {
        return 'Unknown';
    }
}

function GetPlatform() {
    if (IsEmpty(currPlatform)) {
        if (!IsIOS() && GetBrowser() === BROWSER.SAFARI) {
            currPlatform = PLATFORM.SAFARI; currDevice = DEVICE.DESKTOP;
        }
        else if (IsIOS()) {
            if (GetBrowser() === BROWSER.SAFARI) {
                currPlatform = PLATFORM.IOS_SAFARI; currDevice = DEVICE.MOBILE;
            }
            else if (GetBrowser() === BROWSER.CHROME) {
                currPlatform = PLATFORM.IOS_CHROME; currDevice = DEVICE.MOBILE;
            }
            else {
                currPlatform = PLATFORM.IOS_UNKNOWN; currDevice = DEVICE.MOBILE;
            };
        }
        else if (CheckMobileDevice()) {
            currPlatform = PLATFORM.ANDROID; currDevice = DEVICE.MOBILE;
        }
        else {
            currPlatform = PLATFORM.CHROME; currDevice = DEVICE.DESKTOP;
        };
    }
    return currPlatform;
}

function GetDevice() {
    if (IsEmpty(currDevice)) {
        GetPlatform();
    }
    return currDevice;
}

function GetUserDeviceInfo() {
    return GetDevice() + ", " + GetPlatform()
}



/*
function GetMultilineText(msg) {
    msg = msg.replace("\n", "");
    if (msg.length > 20) {
        return msg.substring(0, 20) + "\n" + msg.substring(20);
    } else {
        return msg;
    }
}
*/
function GetMultilineText(msg, length, callback, hasIndent) {
    var segments = [];
    //console.log("count spaces: " + (msg.split(" ").length - 1));

    msg = msg.replaceAll("\n", "");
    //console.log("msg: " + msg);
    if (msg.length <= length) {
        callback(msg);
    }

    //var count = 0;
    var end = 0;
    var grab = function () {
        var start = end;
        end = end + length;
        if (start === 0 && !IsEmpty(hasIndent)) {
            end -= 2;
        }
        var subText = msg.substring(start, end);
        //var subText = msg.substring(0, th);
        //console.log("subText: " + subText);        
        segments.push(subText);
        //count += end;
        //console.log("count: " + count);
        //console.log("end: " + end);
        if (end <= msg.length) {
            grab();
        } else {
            let text = "";            
            segments.forEach(function (item, index) {
                text += item;
                if (index < segments.length) {
                    text += "\n";
                }
            });
            //console.log("finalText: " + text);
            callback(text);
        }
    }
    grab();
}

function Random(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function RandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
    //The maximum is exclusive and the minimum is inclusive
}

function Shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function ColorHex2Dec(hex) {        
    var decList = [];
    decList.push(parseInt(hex.substring(1, 3), 16));
    decList.push(parseInt(hex.substring(3, 5), 16));
    decList.push(parseInt(hex.substring(5, 7), 16));
    return decList;
}

function SetEntryInputPos(input, pos, ratio) {        
    input.x = ratio * pos.x;
    input.y = ratio * pos.y;
    input.x -= (ratio * 90);
    input.y -= (ratio * (100 + (0 * 32.5)));    
}

function AngleBetween2Points(x0, y0, x1, y1) {
    return Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
}
