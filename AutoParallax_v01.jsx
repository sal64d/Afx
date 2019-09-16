{	
	function AutoParallax()
	{
		var scriptName = "AutoParallax_v01";
		if (app.project && app.project.activeItem && app.project.activeItem instanceof CompItem) {
			app.beginUndoGroup(scriptName);
			
			var comp = app.project.activeItem;
			
			// 0. Get Label Groups
			var labels = [];
			for (var i=1; i <= comp.layers.length; i++){
				var lay = comp.layer(i);
				
				if (lay.threeDLayer) { 			
					if (unique(labels, lay.label)) { labels.push(lay.label); }
				}
				
			}
		
			// 0.1. Create a Plane for Each Label
			for(var i = 0; i < labels.length; i++){
				var planeNull = comp.layers.addNull();
				planeNull.name = "Plane_" + (i+1).toString();
				planeNull.threeDLayer = true;
					
				// Set Plane Scale Exp
				planeNull.property("Scale").expression = 'var p = 100 + (transform.position[2]* 100/ thisComp.layer("PlxCam").cameraOption.focusDistance);[p,p,100];';
				
				// Parent Label Groups to Respective PlaneLayers
				var first = true;
				for(var j = 1; j<= comp.layers.length; j++){
						var lay = comp.layer(j);
						if (lay !== planeNull && lay.threeDLayer && lay.label == labels[i]){
							lay.parent = planeNull;
							if (first) { planeNull.moveBefore(lay); first = false;}
						}
				}
			}
			
			// 1. Create a Camera
			var camLayer = comp.layers.addCamera("PlxCam", [comp.width/2, comp.height/2]);
			
			// 1.1 Set Camera
			camLayer.property("position").setValue([comp.width/2, comp.height/2, -1866.7]);
			camLayer.property("zoom").setValue(1866.7);
			camLayer.property("focusDistance").setValue(1866.7);
			camLayer.property("aperture").setValue(17.7);
			
			// 2. Create Camera Control Null
			var nullLayer = comp.layers.addNull();
			nullLayer.name = "PlxCamCtrl";
			nullLayer.threeDLayer = true;
			
			// 3. Parent Camera to Null
			camLayer.parent = nullLayer;
			
			// 3.1 Lock Camera
			camLayer.locked = true;
			
			// 4. Create Master Controls on Camera Control Null
			
			app.endUndoGroup();
		}
		else {
			alert("Error: Open a Comp First");
		}
	}
	AutoParallax();
	
	function unique(arr, elem){
		for (var i = 0; i< arr.length; i++){
			if (arr[i] == elem){
				return false;
			}
		}
		return true;
	}
			
}