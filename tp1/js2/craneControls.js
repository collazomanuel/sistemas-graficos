function CraneControls(){

    let DELTA_PLATFORM_HEIGHT = 0.05;
    let DELTA_CABIN_ROTATION = Math.PI/16;
    let DELTA_ARM_ROTATION = Math.PI/64;
    let DELTA_CABLE_EXTENSION = 1;
    
    let craneInitialState = {
        
        platformHeight:initialPlatformHeight,
        cabinRotation:initialCabinRotation,
        armRotation:initialArmRotation,
        cableExtension:initialCableExtension,

        targetPlatformHeight:0,
        targetCabinRotation:0,
        targetArmRotation:0,
        targetCableExtension:0,

        rightAxisMode:"move"
    }

    let minPlatformHeight = 0.3;
    let maxPlatformHeight = 1.9;
    let minArmRotation = -Math.PI/4;
    let maxArmRotation = Math.PI/4;
    let minCableExtension = 5;
    let maxCableExtension = 115;

    let craneState = Object.assign({},craneInitialState);

    document.addEventListener("keypress",function(e){
            
        switch ( e.key ) {

            case "q": // ++ plataform height
                
                if(craneState.platformHeight - DELTA_PLATFORM_HEIGHT > minPlatformHeight) {
                    craneState.targetPlatformHeight=-DELTA_PLATFORM_HEIGHT; break;
                } else {
                    craneState.targetPlatformHeight=0; break;
                }
                
            case "a": // -- plataform height
                
                if(craneState.platformHeight + DELTA_PLATFORM_HEIGHT < maxPlatformHeight) {
                    craneState.targetPlatformHeight=+DELTA_PLATFORM_HEIGHT; break; 
                } else {
                    craneState.targetPlatformHeight=0; break;
                }

            
            case "j": // ++ cabin rotation (360°)
                
                craneState.targetCabinRotation=DELTA_CABIN_ROTATION; break;


            case "l": // -- cabin rotation (360°)

                craneState.targetCabinRotation=-DELTA_CABIN_ROTATION; break;

            case "i": // ++ arm rotation
                
                if(totalArmRotation + DELTA_ARM_ROTATION < maxArmRotation) {
                    craneState.targetArmRotation=DELTA_ARM_ROTATION; break; 
                } else {
                    craneState.targetArmRotation=0; break;
                }

            case "k": // -- arm rotation
                
                if(totalArmRotation - DELTA_ARM_ROTATION > minArmRotation) {
                    craneState.targetArmRotation=-DELTA_ARM_ROTATION; break; 
                } else {
                    craneState.targetArmRotation=0; break;
                }        

            case "w": // ++ cable extension

                if(craneState.cableExtension + DELTA_CABLE_EXTENSION < maxCableExtension) {
                    craneState.targetCableExtension=DELTA_CABLE_EXTENSION; break;
                    
                } else {
                    craneState.targetCableExtension=0; break;
                }

            case "s": // -- cable extension

                if(craneState.cableExtension - DELTA_CABLE_EXTENSION > minCableExtension) {
                    craneState.targetCableExtension=-DELTA_CABLE_EXTENSION; break; 
                } else {
                    craneState.targetCableExtension=0; break;
                }
        }
    })

    this.update=function(){

        prevCableExtension = craneState.cableExtension;

        craneState.platformHeight+=craneState.targetPlatformHeight;
        craneState.cabinRotation=craneState.targetCabinRotation;
        craneState.armRotation=craneState.targetArmRotation;
        craneState.cableExtension+=craneState.targetCableExtension;

        cabinRotation = craneState.cabinRotation;

        if(craneState.platformHeight < 1) {
            
            modifHeightPiezaB = craneState.targetPlatformHeight;
            modifHeightPiezaC = 0;

        } else {

            modifHeightPiezaB = 0;
            modifHeightPiezaC = craneState.targetPlatformHeight;
        }

        cableExtension = craneState.cableExtension;
        modifCableExtension = craneState.targetCableExtension;

        craneState.targetPlatformHeight=0;
        craneState.targetCabinRotation=0;
        craneState.targetArmRotation=0;
        craneState.targetCableExtension=0;

        updateCraneKeyEvents(

            modifHeightPiezaB,
            modifHeightPiezaC,
            craneState.cabinRotation,
            craneState.armRotation,
            modifCableExtension
        );
    }
}

function updateCraneKeyEvents(modifHeightPiezaB, modifHeightPiezaC, cabinRotation, armRotation, modifCableExtension) {        
    
    var heightPiezaA = 4;
    var heightPiezaB = 1.33;
    var heightPiezaC = 1.20;
    var armLength = 58;
    
    piezaBRef.setTranslation(0,modifHeightPiezaB*heightPiezaB,0);
    piezaCRef.setTranslation(0,modifHeightPiezaC*heightPiezaC,0);

    cabinHeight += heightPiezaA*modifHeightPiezaB*heightPiezaB*heightPiezaB;
    cabinHeight += modifHeightPiezaC*heightPiezaC*heightPiezaB*heightPiezaA*heightPiezaC;

    piezaDRef.setRotation(0,cabinRotation,0);

    // ---------------------------------------------------------------------

    totalArmRotation += armRotation;

    armRef.resetModelMatrix();
    armRef.setRotation(totalArmRotation,0,0);
    
    trolleyCableRef.resetModelMatrix();
    trolleyCableRef.setRotation(-totalArmRotation,0,0);
    trolleyCableRef.setRotation(0,0,Math.PI/2);
    trolleyCableRef.setScale(0.15,1,1);
    trolleyCableRef.setRotation(0,0,Math.PI/2);
    trolleyCableRef.setTranslation(0,0,8.7);
    trolleyCableRef.setTranslation(0,armLength*Math.sin(totalArmRotation),0);
    trolleyCableRef.setTranslation(0,0,-0.15*armLength*(1-Math.cos(totalArmRotation)));

    // ---------------------------------------------------------------------

    piezaGRef.setScale(1,1/prevCableExtension,1);
    piezaGRef.setTranslation(0,modifCableExtension/2,0);
    piezaGRef.setScale(1,cableExtension,1);

    piezaHRef.setTranslation(0,modifCableExtension,0);
}
