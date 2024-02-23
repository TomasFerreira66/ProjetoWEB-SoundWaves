window.it = 0
window.onload = function () {
    // Elements
    var audio = document.getElementById("audio");
    var canvas_wave = document.getElementById("canvas_wave");   
    var canvas_equ = document.getElementById("canvas_equ"); 
    //var video = document.getElementById("video"); 
    var ctx_WAVE = canvas_wave.getContext("2d");
    var ctx_GRAPH = canvas_equ.getContext("2d");

    var mouseX = 0;
    var mouseY = 0;
    window.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    //Função para buscar audio e tocar
    var fbtn = document.getElementById("file");
    var fileNameDisplay = document.getElementById("file-name");

    fbtn.addEventListener("click", function () {
        var file = document.createElement("input");
        file.type = "file";
        file.accept = "audio/*";
        file.click();


        file.onchange = function () {
            var files = this.files;

            fileNameDisplay.innerHTML = 'Now Playing:';
            
            for (var i = 0; i < files.length; i++) {
                var fileSpan = document.createElement("span");
                fileSpan.textContent = files[i].name;
                fileNameDisplay.appendChild(fileSpan);
            }

            audio.src = URL.createObjectURL(files[0]);
            audio.load();
            audio.play();
            audio.style.display = "block";
            visualize(0, audio);
        };
    });

//função para decidir qual visualiza~çao usar
    function visualize(from, source) {
        var context = new AudioContext();
            var src = context.createMediaElementSource(source);
        
        console.log(src);
        var analyser = context.createAnalyser();
        var listen = context.createGain();

        src.connect(listen);
        listen.connect(analyser);        
            analyser.connect(context.destination);      
        analyser.fftSize = 2 ** 12;
        var frequencyBins = analyser.fftSize / 2;

        var bufferLength = analyser.frequencyBinCount;
        console.log(bufferLength);
        let dataArray = new Uint8Array(bufferLength);
        var dataHistory = [];
        
        renderFrame();
       


       
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.smoothingTimeConstant = 0.5;

            var WIDTH_WAVE = (canvas_wave.width = window.innerWidth);
            var HEIGHT_WAVE = (canvas_wave.height = window.innerHeight);
           

            var sliceWidth = WIDTH_WAVE * 1.0 / bufferLength;

            var x = 0;
           
     
                //////////////
            ///codigo para gerar o waveform
            
                analyser.getByteFrequencyData(dataArray);
                let start = 0 //dataArray.find(a=> Math.max.apply('',dataArray));
                analyser.getByteTimeDomainData(dataArray);
                ctx_WAVE.lineWidth = 5;
                ctx_WAVE.strokeStyle = "#fff";
                ctx_WAVE.beginPath();
                x = 0;
                for (var i = start; i < bufferLength; i++) {
                    var v = dataArray[i] / 128.0;
                    var y = v * HEIGHT_WAVE / 2;

                    if (i === 0) {
                        ctx_WAVE.moveTo(x, y);
                    } else {
                        ctx_WAVE.lineTo(x, y);
                    }

                    x = i * sliceWidth //frequencyBins/analyser.sampleRate;
                }
                ctx_WAVE.lineTo(WIDTH_WAVE, dataArray[0] / 128.0 * HEIGHT_WAVE / 2);
                ctx_WAVE.stroke();                 
        
    


        var WIDTH_GRAPH = (canvas_equ.width = window.innerWidth);
        var HEIGHT_GRAPH = (canvas_equ.height = window.innerHeight);
        var scale = Math.log(frequencyBins - 1) / WIDTH_GRAPH;

        
        //codigo equealizador
        analyser.getByteFrequencyData(dataArray);
        for (var i = 0; i < bufferLength; i++) {
            let x = Math.floor(Math.log(i) / scale);
            barHeight = dataArray[i];
            /* var r = barHeight + (25 * (i/bufferLength));
                     var g = 250 * (i/bufferLength);
                     var b = 50; */
           
           
           /*
            var h = 300 - barHeight * 300 / 255;
            var s = 100 + "%";
            var l = barHeight < 64 ? barHeight * 50 / 64 + "%" : "50%";
            ctx_GRAPH.fillStyle = "hsl(" + h + "," + s + "," + l + ")";*/

            var h = 280; // Hue value for purple
var s = "100%"; // Saturation value set to maximum
var l = barHeight < 64 ? barHeight * 50 / 64 + "%" : "50%"; // Lightness value calculated based on bar height

ctx_GRAPH.fillStyle = "hsl(" + h + "," + s + "," + l + ")"; // Set the fill color to the calculated HSL value



            
            ctx_GRAPH.fillRect(
                x,
                HEIGHT_GRAPH - barHeight * HEIGHT_GRAPH / 255,
                Math.floor(Math.log(i + 1) / scale) - Math.floor(Math.log(i) / scale),
                HEIGHT_GRAPH
            );
                       
    }
    
}
}



}
function restartAudio() {
    var audioRestart = document.getElementById("audio");
    audioRestart.currentTime = 0;

}
  
