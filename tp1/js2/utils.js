
// triangleStripMesh : container with the 4 buffers (position, normal, uv and index)
function drawTriangleStripMesh(triangleStripMesh) {
	
	// buffer setup

    var modo = "edges";

    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_position_buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, triangleStripMesh.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);
    
    /*
    textureCoordAttribute = gl.getAttribLocation(glProgram, "aVertexTexture");
    gl.enableVertexAttribArray(textureCoordAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.triangleStripMesh.webgl_uvs_buffer);
    gl.vertexAttribPointer(textureCoordAttribute, triangleStripMesh.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);
    */

    vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
    gl.enableVertexAttribArray(vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_normal_buffer);
    gl.vertexAttribPointer(vertexNormalAttribute, triangleStripMesh.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleStripMesh.webgl_index_buffer);

    if (modo!="wireframe"){
  
        //gl.uniform1i(glProgram.useLightingUniform,(lighting=="true"));                    
        gl.drawElements(gl.TRIANGLE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    if (modo!="smooth") {
        
        //gl.uniform1i(glProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// set the shader matrix to transform the vertices
function setShaderMatrix(mMatrix, color) {

    // clear back buffer
	//gl.enable(gl.CULL_FACE);
    //gl.enable(gl.DEPTH.TEST);
    //gl.clearColor(0,0,0,1);
    //gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    
    gl.useProgram(glProgram);

    var normalMatrix = glMatrix.mat4.clone(mMatrix);
	mat4.invert(normalMatrix,normalMatrix);
	mat4.transpose(normalMatrix,normalMatrix);

    gl.uniformMatrix4fv(modelMatrixUniform, false, mMatrix);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
	gl.uniform4fv(colorUniform, color);
}

function ChooseCamera() {

    let cam = currentCam;
    
    document.addEventListener("keypress",function(e){
                
        switch ( e.key ) {
                
            case "1": // drone camera

                cam = "drone";
                break;

            case "2": // crane operator camera
                
                cam = "crane operator";
                break;

            case "3": // orbital camera

                cam = "orbital";
                break;
            
            default:

                break;
        }
    })

    this.toggle = function() {
        
        currentCam = cam;
        
    }
}

function getRandomDouble(min, max) {
        
    if(min > max) {
        console.log("Error: min > max");
        return;
    }
    
    var range = max - min;
    
    return min + range * Math.random();
}

function getControlPoints(numWindowsA, numWindowsB, windowSize) {
    
    var controlPoints = [];

    for (let a = -numWindowsA/2; a < numWindowsA/2; a++) {
        
        var point = vec2.fromValues(a*windowSize,numWindowsB*windowSize/2);

        vec2.add(point, point, vec2.fromValues(0,0));

        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }


    for (let b = numWindowsB/2; b > -numWindowsB/2; b--) {
        
        var point = vec2.fromValues(numWindowsA*windowSize/2,b*windowSize);

        vec2.add(point, point, vec2.fromValues(0,0));

        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    for (let a = numWindowsA/2; a > -numWindowsA/2; a--) {
        
        var point = vec2.fromValues(a*windowSize,-numWindowsB*windowSize/2);

        vec2.add(point, point, vec2.fromValues(0,0));

        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    for (let b = -numWindowsB/2; b < numWindowsB/2; b++) {
        
        var point = vec2.fromValues(-numWindowsA*windowSize/2,b*windowSize);

        vec2.add(point, point, vec2.fromValues(0,0));
        
        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    return controlPoints;
}

function getControlPointsRandom(numWindowsA, numWindowsB, windowSize) {
    
    var controlPoints = [];

    var cornerDelta = 1.0;
    var minRandomDelta = 1.0;
    var maxRandomDelta = 2.0;

    for (let a = -numWindowsA/2; a < numWindowsA/2; a++) {
        
        var point = vec2.fromValues(a*windowSize,numWindowsB*windowSize/2);
        
        // not modifying the rectangle vertices
        if(a != -numWindowsA/2) {

            var randomDelta = getRandomDouble(minRandomDelta,maxRandomDelta);
            vec2.add(point, point, vec2.fromValues(0,randomDelta * windowSize));
        
        } else {

            vec2.add(point, point, vec2.fromValues(-cornerDelta,cornerDelta));
        }

        vec2.add(point, point, vec2.fromValues(0,0));

        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    for (let b = numWindowsB/2; b > -numWindowsB/2; b--) {
        
        var point = vec2.fromValues(numWindowsA*windowSize/2,b*windowSize);
        
        // not modifying the rectangle vertices
        if(b != numWindowsB/2) {

            var randomDelta = getRandomDouble(minRandomDelta,maxRandomDelta);
            vec2.add(point, point, vec2.fromValues(randomDelta * windowSize,0));
        
        } else {

            vec2.add(point, point, vec2.fromValues(cornerDelta,cornerDelta));
        }

        vec2.add(point, point, vec2.fromValues(0,0));

        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    for (let a = numWindowsA/2; a > -numWindowsA/2; a--) {
        
        var point = vec2.fromValues(a*windowSize,-numWindowsB*windowSize/2);
        
        // not modifying the rectangle vertices
        if(a != numWindowsA/2) {

            var randomDelta = getRandomDouble(minRandomDelta,maxRandomDelta);
            vec2.add(point, point, vec2.fromValues(0,-randomDelta * windowSize));
        
        } else {

            vec2.add(point, point, vec2.fromValues(cornerDelta,-cornerDelta));
        }

        vec2.add(point, point, vec2.fromValues(0,0));

        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    for (let b = -numWindowsB/2; b < numWindowsB/2; b++) {
        
        var point = vec2.fromValues(-numWindowsA*windowSize/2,b*windowSize);
        
        // not modifying the rectangle vertices
        if(b != -numWindowsB/2) {

            var randomDelta = getRandomDouble(minRandomDelta,maxRandomDelta);
            vec2.add(point, point, vec2.fromValues(-randomDelta * windowSize,0));
        
        }  else {

            vec2.add(point, point, vec2.fromValues(-cornerDelta,-cornerDelta));
        }

        vec2.add(point, point, vec2.fromValues(0,0));
        
        var point3D = [point[0],0,point[1]];
        
        controlPoints.push(point3D);
    }

    return controlPoints;
}