{
	// Adds a Disp Map and Adjustment Layer for Water Effects
	// Created By Shaurya; kharb.shaurya@gmail.com
    // v_0.1:
    //      > Adds a Simple DispMap Comp with a Fractal Noise Solid
    //      > Adds an Adjustment Layer
    
	function WaterScript()
	{
		var scriptName = "Water_Script_v0.1";

		if (app.project && 
			app.project.activeItem && 
			app.project.activeItem instanceof CompItem) {
				
			app.beginUndoGroup(scriptName);
			
			var comp = app.project.activeItem;
			
			var solid = comp.layers.addSolid([0,0,0],"DispMap_Solid",comp.width,comp.height,comp.pixelAspect);
			solid.Effects.addProperty("Fractal Noise");
			
			var AdjLayer = comp.layers.addSolid([1,1,1],"WaterEffect",comp.width,comp.height,comp.pixelAspect);
			AdjLayer.adjustmentLayer = true;
			
			AdjLayer.Effects.addProperty("Displacement Map");
			
			var dComp = comp.layers.precompose([solid.index],"dMap_WaterEffect",moveAllAttributes = true)
			var dComp_Layer = comp.selectedLayers[0];
			
			solid = dComp.layer(1);
			
			dComp_Layer.enabled = false;
			dComp_Layer.shy = true;
			dComp_Layer.guideLayer = true;
			
			
			AdjLayer.effect("Displacement Map")(1).setValue(dComp_Layer.index);
			
			AdjLayer.Effects.addProperty("Slider Control");
			AdjLayer.effect("Slider Control").name = "Scale";
			AdjLayer.effect("Scale")(1).setValue(10);
			
			AdjLayer.Effects.addProperty("Slider Control");
			AdjLayer.effect("Slider Control").name = "Speed";
			AdjLayer.effect("Speed")(1).setValue(1)
			
			AdjLayer.Effects.addProperty("Slider Control");
			AdjLayer.effect("Slider Control").name = "Strength";
			AdjLayer.effect("Strength")(1).setValue(4)
			
			AdjLayer.effect("Displacement Map")(3).expression = "effect('Strength')(1)";
			AdjLayer.effect("Displacement Map")(5).expression = "effect('Strength')(1)";
			
			solid.effect("Fractal Noise")("Evolution").expression = 'time *100* comp("'+ comp.name +'").layer("'+ AdjLayer.name +'").effect("Speed")(1)';
			solid.effect("Fractal Noise")("Scale").expression = 'comp("'+ comp.name +'").layer("'+ AdjLayer.name +'").effect("Scale")(1)';
			AdjLayer.moveAfter(dComp_Layer);
			
			AdjLayer.selected = true;
			
			app.endUndoGroup();
			
			
		}
		else {
			alert("Error: Open/Activate a Comp First!", scriptName);
		}
	}
	
	
	WaterScript();
}
