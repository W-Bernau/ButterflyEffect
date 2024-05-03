var myCanvas = document.getElementById("my_canvas");
var ctx = myCanvas.getContext("2d");
var progression = 10;
function draw(startX, startY, len, angle, branchWidth) {
    ctx.lineWidth = branchWidth;

    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = 'white';

    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI/180);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.stroke();

    if(len < 10) {
        ctx.restore();
        return;
    }

    draw(0, -len, len*0.8, angle-15, branchWidth*0.8);
    draw(0, -len, len*0.8, angle+15, branchWidth*0.8);

    ctx.restore();
}
draw(400, 600, progression, 0, 10);

document.getElementById("progress").oninput = function(){
    console.log(this.value)
    progression = this.value;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    draw(400, 600, progression, 0, 10);
};

var settings = {
    progression: 10,

    apply:function() {


      //  mass1 = this.mass1;
      //  mass2 = this.mass2;
        progression = this.progression;
       
    }
};

let gui = new dat.GUI();

gui.add(settings, 'progression', 10, 200);
gui.add(settings, 'apply');
gui.close();