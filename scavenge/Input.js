define(["geometry/Point", "worldDimensions", "utils", "constants"], 
	function(Point, worldDimensions, utils, constants){

	return function(unitDispatcher, selector, planets, player){
		var self = this;

		var lastMouseUp = 0;
		var canvas = document.getElementById("gameArea");


		function positionInWorld(touch){
			return new Point(
				worldDimensions.toWorldX(touch.pageX - canvas.offsetLeft), 
				worldDimensions.toWorldY(touch.pageY - canvas.offsetTop));
		}
		
		this.currentTouches = [];

		// converts a MouseEvent into a TouchEvent
		function convertToTouchEvent(e){
			if (typeof (e.changedTouches) != "undefined"){
				return e;
			}

			return {
				changedTouches: [{
					identifier: 1,
					pageX: e.pageX,
					pageY: e.pageY
				}]
			};
		}

		this.onDown = function(e) {
			var touchEvent = convertToTouchEvent(e);

			var touches = touchEvent.changedTouches;
			for (var i = 0; i < touches.length; i++) {
				var touch = touches[i];
				var position = positionInWorld(touch);

				// try to find a planet underneath
				var originPlanet = selector.findPlanet(planets, position);
				var selectionPercentIncreaser = null;

				if (originPlanet != null && originPlanet.owner != null && originPlanet.owner.type == constants.localPlayer){

					var increaser = function(){
		            	// increase selectedUnit
		            	// we want 100% selecting in 2000ms
		            	// so each 200ms, should increase 10%
		            	originPlanet.selectionPercent = Math.min(originPlanet.selectionPercent + 0.1, 1);
		            	originPlanet.needsUpdate = true;
		            };
		            originPlanet.selectionPercent = 0.2;
		            originPlanet.needsUpdate = true;
					selectionPercentIncreaser = setInterval(increaser, 200)

				}

				if (originPlanet == null){
					// clear selection
				}

				self.currentTouches.push({
		            identifier: touch.identifier,
		            originalMousePosition: position,
		            selectionPercentIncreaser: selectionPercentIncreaser,
		            currentMousePosition: position,
		            targetPlanet: null,
		            originPlanet: originPlanet
		        });

			}
		};

		function findCurrentTouch(identifier){
			for (var i = 0; i < self.currentTouches.length; i++) {
				if (self.currentTouches[i].identifier == identifier){
					return self.currentTouches[i];
				}
			}
			return null;
		}

		this.onMove = function(e){
			var touchEvent = convertToTouchEvent(e);
			for (var i = 0; i < touchEvent.changedTouches.length; i++){
				// find corresponding currentTouch
				var currentTouch = findCurrentTouch(touchEvent.changedTouches[i].identifier);
				if (currentTouch == null){
		    		// this could be a mousemove event without mousedown
					continue;
				}

				currentTouch.currentMousePosition = positionInWorld(touchEvent.changedTouches[i]);

				if (utils.hypo(
					currentTouch.currentMousePosition.x - currentTouch.originalMousePosition.x, 
					currentTouch.currentMousePosition.y - currentTouch.originalMousePosition.y) <= 5 ) {
		    		continue;
				}			
				
		    	if (currentTouch.originPlanet != null && 
		    		// only drag on human player
		    		(currentTouch.originPlanet.owner != null && currentTouch.originPlanet.owner.type == constants.localPlayer) && 
		    		!currentTouch.originPlanet.selected) {
		    		selector.forceSelect(currentTouch.originPlanet);
		    	}

		    	currentTouch.isDragging = true;
		    	var targetUnderFinger = selector.findPlanet(planets, currentTouch.currentMousePosition);
		    	if (targetUnderFinger != null){
			    	currentTouch.targetPlanet = targetUnderFinger;
		    	}

			}

		};

		this.onShake = function(e){
			location.reload();
		}

		this.onCancel = function(e){
			// Removes cancelled touches from the currentTouches array.
			var touchEvent = convertToTouchEvent(e);
		    var touches = touchEvent.changedTouches;

		    for (var i=0; i < touches.length; i++) {
		        var currentTouch = findCurrentTouch(touches[i].identifier);
		        deleteTouch(currentTouch);
		    }
		}

		//var mousePositionOnMouseUp;

		this.onUp = function(e){
			var touchEvent = convertToTouchEvent(e);
			for (var i = 0; i < touchEvent.changedTouches.length; i++){
				
				// find corresponding currentTouch
				var currentTouch = findCurrentTouch(touchEvent.changedTouches[i].identifier);
				if (currentTouch == null){
					// this is strange
					continue;
				}

				if (currentTouch.originPlanet == null){
					deleteTouch(currentTouch);
				}
			

			var mousePosition = currentTouch.currentMousePosition;
			
			var now = utils.timestamp();
	/* TODO: implement double tap
			if (now - lastMouseUp < 500 && mousePositionOnMouseUp.distance(mousePosition) < 5) {
				// double click.
				selector.selectAll(planets, player);
				lastMouseUp = now;
				return;
			}
			mousePositionOnMouseUp = mousePosition;
	*/
				lastMouseUp = now;

				//var targetPlanet = selector.select(mousePosition, planets, currentTouch.originPlanet ? currentTouch.originPlanet.owner || player : player, currentTouch.isDragging);
				var targetPlanet = currentTouch.targetPlanet;
				if (targetPlanet != null) {
		        	
		        	var toDelete = [];
		        	for (var i = 0; i < selector.selectedPlanets.length; i++) {
						var t = selector.selectedPlanets[i];
						if ((currentTouch.originPlanet ? (currentTouch.originPlanet.owner || player) : player) != t.owner){
							continue;
						}

				    	unitDispatcher.onMove(t, targetPlanet);
				    	t.setSelection(0);
				    	toDelete.push(t);
		        	};
		        	for (var i = 0; i < toDelete.length; i++){
		        		var index = selector.selectedPlanets.indexOf(toDelete[i]);
		        		if (index != -1){
			        		selector.selectedPlanets.splice(index, 1);
			        	}

		        	}
		        }
		        currentTouch.isDragging = false;
				currentTouch.targetPlanet = null;
				deleteTouch(currentTouch);
			}

		};

		function deleteTouch(touch){
			
			// fix bug where white disc stays visible without any touch
			if (touch.originPlanet != null){
				touch.originPlanet.selectionPercent = 0;
			}
			if (touch.selectionPercentIncreaser != null){
				clearInterval(touch.selectionPercentIncreaser);
			}
			var index = self.currentTouches.indexOf(touch);
			if (index != -1){
				self.currentTouches.splice(index, 1);
			}

		}
	};
});