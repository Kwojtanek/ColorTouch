'use strict';
var room, roomAngle, walls, logo, $logoText, wallLabels, rotationDisabled = false;
var leftButton, rightButton, dots, loader;
var gallery, galleryBrakeLine, fsGallerySc, fsPatternSc, fsImages;
room = document.querySelector('#room');
logo = document.querySelector('#logo');
$logoText = $('#logo-text');
walls =  document.querySelectorAll('.wall');
roomAngle = 0;
wallLabels = {0: 'about', 90: 'gallery', 180: 'patterns', 270: 'contact' };

function getObKey(Obj, value ) {
    for (var k in Obj){
        if (Obj[k] == value){
            return parseInt(k)
        }
    }
    return 0
}



//Rotate room functions

function decressAngle(){
    var angle = roomAngle;
    while (angle >= 360){
        angle = angle - 360
    }
    while (angle <= -360 ){
        angle = angle + 360
    }
    return angle

}
function translateAngle() {
    var da = decressAngle();
    return da<0 ? da + 360 : da
}
function rotateRoom(angle) {
    room.style.transform='rotateY(' + angle + 'deg) rotateX(0deg)';

}
function toggleLogo() {
    if (translateAngle() == 0) {
        $logoText.fadeIn()
    }
    else {
        $logoText.fadeOut()
    }
}
function hideWalls() {
    var translatedAngle = translateAngle();
    for (var i = 0; i < 4; i++) {
        if (walls[i].getAttribute('data-rotated') == translatedAngle ) {
            $(walls[i]).fadeIn();
        }
        else {
            setTimeout(function (wallnr) {
                $(walls[wallnr]).fadeOut();
            },1200, i)

        }
    }
}
function disableRotation() {
    rotationDisabled = true;
    setTimeout(function () {
        rotationDisabled = false
    },1200)
}

function changeHash(){
    window.location.hash = wallLabels[translateAngle()]
}

function rotateDirection(){
    disableRotation();
    setButtonLabels();
    hideWalls();
    matchDot(translateAngle());
    rotateRoom(roomAngle);
    changeHash(roomAngle);
}

function rotateRight() {
    if (!rotationDisabled) {
        roomAngle += 90;
        rotateDirection()
    }

}

function rotateLeft() {
    if (!rotationDisabled) {
        roomAngle -= 90;
        rotateDirection()
    }

}
//Url functions
$(window).on('hashchange', function () {
    if (!rotationDisabled){
        roomAngle = getObKey(wallLabels, window.location.hash.slice(1));
        rotateDirection();

    }
});


// Navigation functions
leftButton = document.querySelector('#left-label');
rightButton = document.querySelector('#right-label');
dots = document.querySelectorAll('.dot');
loader = document.querySelector('#loader');
function matchDot(angle){
    for (var j=0; j <4; j++){
        if (dots[j].getAttribute('data-rotated') == angle){
            dots[j].style.filter = 'none';
        }
        else {
            dots[j].style.filter = 'grayscale(1)'
        }
    }
}
function setButtonLabels(){
    var translatedAngle = translateAngle();
    if (translatedAngle == 0){
        leftButton.innerText = 'Kontakt';
        rightButton.innerText = 'Galeria'

    }
    if (translatedAngle == 90){
        leftButton.innerText = 'O nas';
        rightButton.innerText = 'Wzory';

    }
    if (translatedAngle == 180){
        leftButton.innerText = 'Galeria';
        rightButton.innerText = 'Kontakt';

    }
    if (translatedAngle == 270){
        leftButton.innerText = 'Wzory';
        rightButton.innerText = 'O nas';

    }
}

//Formularz
var send_data = function () {
    var inputs = document.querySelectorAll('[id^="id"]');
    var count = 0;
    var formElement = document.querySelector("form");
    var request = new XMLHttpRequest();

    request.onreadystatechange= function() {
        if (this.readyState!==4) return; // not ready yet
        if (this.status===200) { // HTTP 200 OK
            alert(this.responseText);
            loader.style.display='none';
            for (var j=0;j<inputs.length;j++){inputs[j].value='';}

        }
        else {
            alert(this.responseText);
            loader.style.display='none';
            for (var k=0;k<inputs.length;i++){inputs[k].value='';}
        }
    };

    for (var i=0;i<inputs.length;i++) {
        if (inputs[i].validity.valid) {
            console.log(inputs[i].validity.valid);
            count +=1;
        }
    }
    if (count == 2){
        loader.style.display='fixed';
        request.open("POST", "post-form");
        request.send(new FormData(formElement));
    }
    else {
        alert('Uzupełnij brakujące dane, wszystkie pola są wymagane. Sprawdź poprawność adresu email.');
    }

};
gallery = $('#fullscreen-gallery');
galleryBrakeLine = document.querySelector('#brake-line3');
fsGallerySc = $('#fs-gallery-sc');
fsPatternSc = $('#fs-pattern-sc');
fsImages = $('.fullsrceen-image');

function displayGallery(name,func) {
    room.style.display= 'none';
    gallery.fadeIn();
    func();
    findTarget(name);
}
function hideGallery() {
    room.style.display= 'block';
    gallery.fadeOut();
}
function setCategory(){
    galleryBrakeLine.style.marginLeft = '1em';
    fsGallerySc.css('display','flex');
    fsPatternSc.fadeOut();
    fsGallerySc.fadeIn();
}
function setPattern() {
    galleryBrakeLine.style.marginLeft = '8em';
    fsPatternSc.css('display','flex');
    fsGallerySc.fadeOut();
    fsPatternSc.fadeIn();

}
function findTarget(target){
    for (var i=0;i<fsImages.length; i++){
        if (fsImages[i].getAttribute('data-name') == target){
            fsImages[i].style.display ='flex';
            $(fsImages[i]).fadeIn();
        }
        else {$(fsImages[i]).fadeOut()}
    }
}
function clickTarget(that){
    findTarget(that.innerText)
}

$(document).ready(function () {
    $(loader).fadeOut();
    matchDot(translateAngle());
    setButtonLabels();
    if ((!window.location.hash) || (window.location.hash in wallLabels)) {
        disableRotation();
        window.location.hash= 'about'
    }
    else {
        roomAngle = getObKey(wallLabels, window.location.hash.slice(1));
        rotateDirection();
    }

});
$(document).on('pageinit', function(event){
   $("#room")
       .swiperight(function() {
        rotateLeft();
    }).swipeleft(function (event) {
       rotateRight();
   });
});