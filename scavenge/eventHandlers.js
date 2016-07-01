define(["libs/shake", "worldDimensions"], function(Shake, worldDimensions){

	return {
		startListening: function(input){
			document.ontouchmove = function(event){
			    event.preventDefault();
			};

			window.addEventListener('resize', worldDimensions.resize, false);
			window.addEventListener('orientationchange', worldDimensions.resize, false);

			var gameCanvas = document.getElementById("gameArea");
			var shakeEvent = new Shake();
			shakeEvent.start();
			window.addEventListener('shake', input.onShake, false);
			gameCanvas.addEventListener('touchstart', input.onDown, false);
			gameCanvas.addEventListener('touchend', input.onUp, false);
			gameCanvas.addEventListener('touchleave', input.onUp, false);
			gameCanvas.addEventListener('touchmove', input.onMove, false);		
			gameCanvas.addEventListener('touchcancel', input.onCancel, false);
			gameCanvas.addEventListener('mousedown', input.onDown, false);
			gameCanvas.addEventListener('mouseup', input.onUp, false);
			gameCanvas.addEventListener('mousemove', input.onMove, false);


		}
	}
});