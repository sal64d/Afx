/*========================================
 *		ParallaxFX V_0.2a
 * 
 * Create Quick Parallax Effects in afx.
 *
 * By Shaurya; kharb.shaurya@gmai.com
 *
 * ChangeLog: 
 * # 0.1:
 * 	> Creates Camera, Camera Controller, Plane for each 3d Layer
 * # 0.2a:
 *	 > Camera Fix
 * 	> Added Master Controls to Camera Control
 * 	> Can Duplicate Planes to Create Additional Planes
 *	 > ignores 'None(0)' Label
 * 	> Creates All Plane Layers hidden and Shy
 * 
 * TODO:
 * 	> Can't Set/Change Final Position of MC
 * 	> Can't Reset Position of MC or Planes
 */

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
				
				if (lay.threeDLayer && lay.label != 0) { 			
					if (unique(labels, lay.label)) { labels.push(lay.label); }
				}
				
			}
		
			// 0.1. Create a Plane for Each Label
			for(var i = 0; i < labels.length; i++){
				
				var planeNull = comp.layers.addNull();
				planeNull.name = "Plane_" + (i+1).toString();
				planeNull.threeDLayer = true;
				planeNull.label = 0;
				planeNull.shy = true;
				planeNull.enabled = false;
					
				// Set Plane Scale Exp
				planeNull.property("Scale").expression = 'var p = 100 + (transform.position[2]* 100/ thisComp.layer("PlxCam").cameraOption.focusDistance);[p,p,100];';
				
				// Set Plane Pos Expression
				planeNull.property("Position").expression = '\
					var i = 6 - parseInt(thisLayer.name.split("_")[1]); \
					var h = thisComp.height; \
					var n = parseInt(thisComp.layer("PlxCamCtrl").effect("Plx_NUM_OF_PLANES")("Slider")); \
					var scaleFactor = thisComp.layer("PlxCamCtrl").effect("Plx_Scale")("Slider"); \
					var zpos = -scaleFactor/100 * ((i*h/(n+1)) - h/2); \
					transform.position + [0,0,zpos]; \
				';
				
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
			camLayer.label = 0;
			camLayer.shy = true;
			
			// 1.1 Set Camera
			var fd = parseFloat((comp.width/2)/Math.tan(54.43*Math.PI/360));
			camLayer.property("position").setValue([comp.width/2, comp.height/2, -fd]);
			camLayer.property("zoom").setValue(fd);
			camLayer.property("focusDistance").setValue(fd);
			camLayer.property("aperture").setValue(17.7);
			
			// 2. Create Camera Control Null
			var nullLayer = comp.layers.addNull();
			nullLayer.name = "PlxCamCtrl";
			nullLayer.threeDLayer = true;
			nullLayer.label = 0;
			nullLayer.shy = true;
			nullLayer.enabled = false;
			
			// 3. Parent Camera to Null
			camLayer.parent = nullLayer;
			
			// 3.1 Lock Camera
			camLayer.locked = true;
			
			// 4. Create Master Controls on Camera Control Null
			nullLayer.Effects.addProperty("Slider Control");
			nullLayer.effect("Slider Control").name = "Plx_Zoom";
			
			nullLayer.Effects.addProperty("Point Control");
			nullLayer.effect("Point Control").name = "Plx_Position";
			
			nullLayer.Effects.addProperty("Slider Control");
			nullLayer.effect("Slider Control").name = "Plx_Scale";
			
			nullLayer.Effects.addProperty("3D Point Control");
			nullLayer.effect("3D Point Control").name = "Plx_Rotation";
			
			nullLayer.Effects.addProperty("Slider Control");
			nullLayer.effect("Slider Control").name = "Plx_NUM_OF_PLANES";
			
			// 4.1 Set Master Controls Values
			nullLayer.effect("Plx_Zoom")(1).setValue(200);
			nullLayer.effect("Plx_Scale")(1).setValue(100);
			nullLayer.effect("Plx_Position")(1).setValue([0,0]);
			nullLayer.effect("Plx_Rotation")(1).setValue([0,0,0]);
			nullLayer.effect("Plx_NUM_OF_PLANES")(1).setValue(labels.length);
			
			// 4.2 Set MC Keyframes
			var t = [nullLayer.inPoint, nullLayer.outPoint];
			var pos = nullLayer.property('Position').value;
			nullLayer.property('Position').setValuesAtTimes(t,[[pos[0],pos[1],1.0],pos]);
			nullLayer.property('xRotation').setValuesAtTimes(t,[1,0]);
			nullLayer.property('yRotation').setValuesAtTimes(t,[1,0]);
			nullLayer.property('zRotation').setValuesAtTimes(t,[1,0]);
			
			// 4.3 Set MC Expressions
			nullLayer.property('Position').expression = '\
				var t = transform.position; \
				var s = effect("Plx_Zoom")("Slider"); \
				var p = effect("Plx_Position")("Point"); \
				[t[0] + p[0]*t[2]/10, t[1] + p[1]*t[2]/10, t[2]*s]; \
			';
			
			nullLayer.property('xRotation').expression = '\
				-effect("Plx_Rotation")("3D Point")[1]*transform.xRotation/1000 \
			';
			
			nullLayer.property('yRotation').expression = '\
				effect("Plx_Rotation")("3D Point")[0]*transform.yRotation/1000 \
			';
			
			nullLayer.property('zRotation').expression = '\
				effect("Plx_Rotation")("3D Point")[2]*transform.zRotation/1000 \
			';
			
			
			
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
