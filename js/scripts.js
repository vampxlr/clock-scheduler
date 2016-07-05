var canvas =document.getElementById('myCan');

var ctx = (canvas.getContext) ?
           canvas.getContext('2d') :null;


if(ctx){

    ctx.fillStyle = '#4A4464';
    ctx.lineWidth = 17;
    ctx.lineCap = 'round';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';

    function degToRad(degree) {
        var factor = Math.PI/180;
        return degree*factor;
    }

    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    console.log("centerX: "+centerX)
    console.log("centerY: "+centerY)

        var data = [360 ];
        var labels = ["360"];
        var colors = ["#733EE3"];




    function drawSegment(canvas, context, i) {
        context.save();
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        radius = Math.floor(canvas.width / 2);

        var startingAngle = degreesToRadians(sumTo(data, i));
        var arcSize = degreesToRadians(data[i]);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = colors[i];
        context.fill();

        context.restore();

        drawSegmentLabel(canvas, context, i);
    }


    function drawSegmentWithLocation(canvas, context, degstartingAngle) {
        context.save();
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        radius = Math.floor(canvas.width / 2);

        var startingAngle = degreesToRadians(degstartingAngle);
        var arcSize = degreesToRadians(30);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius,
            startingAngle, endingAngle, false);
        context.closePath();

        context.fillStyle = "#fff";
        context.fill();

        context.restore();

        //drawSegmentLabel(canvas, context, i);
    }


    function degreesToRadians(degrees) {
        return (degrees * Math.PI)/180;
    }
    function radiansToDegrees(rad) {
        return (rad / Math.PI)*180;
    }
    function sumTo(a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    }


    function drawSegmentLabel(canvas, context, i) {
        context.save();
        var x = Math.floor(canvas.width / 2);
        var y = Math.floor(canvas.height / 2);
        var angle = degreesToRadians(sumTo(data, i));

        context.translate(x, y);
        context.rotate(angle);
        var dx = Math.floor(canvas.width * 0.5) - 10;
        var dy = Math.floor(canvas.height * 0.05);

        context.textAlign = "right";
        var fontSize = Math.floor(canvas.height / 25);
        context.font = fontSize + "pt Helvetica";

        context.fillText(labels[i], dx, dy);

        context.restore();
    }

    function pixelToDegree(x,y){
    var delY = y - centerY
    var delX = x - centerX
    var quardant = 1;
        if(delY>0 && delX>0)
        {
            quardant = 1
        }

        if(delY>0 && delX<0)
        {
            quardant = 2
        }
        if(delY<0 && delX<0)
        {
            quardant = 3
        }
        if(delY<0 && delX>0)
        {
            quardant = 4
        }


    var gradient = delY/delX
        radSlope = Math.atan(gradient)
        degrees = radiansToDegrees(radSlope)
        console.log(degrees)
        console.log(quardant)
        return degrees
    }

    for (var i = 0; i < data.length; i++) {
        drawSegment(canvas, ctx, i);
    }

    drawSegmentWithLocation(canvas,ctx,20)
    pixelToDegree(251,241)


    function clickdraw(){
      var  x = event.offsetX;

       var y = event.offsetY;

    console.log("x: "+x)
    console.log("y: "+y)
        console.log(event)
       console.log( pixelToDegree(x,y))
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSegment(canvas, ctx, 0);
        drawSegmentWithLocation(canvas,ctx,pixelToDegree(x,y)-15)

    }

    canvas.addEventListener('mousemove', clickdraw);

}
console.log(ctx)