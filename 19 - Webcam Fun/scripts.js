const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

let redEffectOn = false;
let rgbSplitOn = false;

async function getVideo() {

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video:true });
        video.srcObject = stream;
        video.play();
    } catch (error) {
        console.log(error);
    }

}


function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);

        let imageData = ctx.getImageData(0, 0, width, height);

        if (redEffectOn) imageData = redEffect(imageData);
        
        if (rgbSplitOn) {
            imageData = rgbSplit(imageData);
            ctx.globalAlpha = 0.5;
        }

        imageData = greenScreen(imageData);


        ctx.putImageData(imageData, 0, 0);

    }, 16);

}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();

    const image = new Image();
    image.src = canvas.toDataURL();
    image.onclick = saveImage;
    strip.appendChild(image);

    
}

function saveImage(event) {

    const downloadLink = document.createElement("a");
    downloadLink.href = event.target.src
    downloadLink.setAttribute("download", "my-image");
    downloadLink.click();
    
}

function redEffect(imageData) {

    for (let i=0; i < imageData.data.length; i += 4) {

        imageData.data[i] += 100;
        imageData.data[i + 1] -= 50;
        imageData.data[i + 2] *= 0.5;

    }

    return imageData;

}

function toggleRed() {
    
    redEffectOn = !redEffectOn;

}

function rgbSplit(imageData) {

    for (let i=0; i < imageData.data.length; i += 4) {

        imageData.data[i - 150] = imageData.data[i];
        imageData.data[i + 500] = imageData.data[i+1];
        imageData.data[i - 480] = imageData.data[i+2];

    }

    return imageData;


}

function toggleSplit() {
    rgbSplitOn = !rgbSplitOn;
}


function greenScreen(imageData) {

    const levels = {}

    document.querySelectorAll(".rgb input").forEach(input => {
        levels[input.name] = input.value;
    })

    for (let i=0; i < imageData.data.length; i += 4) {

        const red = imageData.data[i];
        const green = imageData.data[i+1];
        const blue = imageData.data[i+2];

        if ( red >= levels.rmin && red <= levels.rmax
            && green >= levels.gmin && green <= levels.gmax
            && blue >= levels.bmin && blue <= levels.bmax 
        ) {
            imageData.data[i+3] = 0;

        }

    }


    return imageData;

}



getVideo();
video.addEventListener("canplay", paintToCanvas);

