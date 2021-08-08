
// triangleStripMesh : container with the 4 buffers (position, normal, uv and index)
function drawTriangleStripMesh(triangleStripMesh, isReflective, isTerrain) {

    var mode = "smooth";
    
    if(isReflective) {

        // buffer setup

        vertexPositionAttributeRM = gl.getAttribLocation(glProgramReflectionMap, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttributeRM);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttributeRM, triangleStripMesh.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        textureCoordAttributeRM = gl.getAttribLocation(glProgramReflectionMap, "aVertexUv");
        gl.enableVertexAttribArray(textureCoordAttributeRM);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_uvs_buffer);
        gl.vertexAttribPointer(textureCoordAttributeRM, triangleStripMesh.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

        vertexNormalAttributeRM = gl.getAttribLocation(glProgramReflectionMap, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttributeRM);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttributeRM, triangleStripMesh.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleStripMesh.webgl_index_buffer);

        if (mode!="wireframe"){
    
            //gl.uniform1i(glProgramReflectionMap.useLightingUniform,(lighting=="true"));                    
            gl.drawElements(gl.TRIANGLE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        if (mode!="smooth") {
            
            //gl.uniform1i(glProgramReflectionMap.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

            
    } else if(isTerrain) {

        // buffer setup

        vertexPositionAttributeT = gl.getAttribLocation(glProgramTerrain, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttributeT);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttributeT, triangleStripMesh.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        textureCoordAttributeT = gl.getAttribLocation(glProgramTerrain, "aVertexUv");
        gl.enableVertexAttribArray(textureCoordAttributeT);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_uvs_buffer);
        gl.vertexAttribPointer(textureCoordAttributeT, triangleStripMesh.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

        vertexNormalAttributeT = gl.getAttribLocation(glProgramTerrain, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttributeT);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttributeT, triangleStripMesh.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleStripMesh.webgl_index_buffer);

        if (mode!="wireframe"){
    
            //gl.uniform1i(glProgram.useLightingUniform,(lighting=="true"));                    
            gl.drawElements(gl.TRIANGLE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        if (mode!="smooth") {
            
            //gl.uniform1i(glProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
    } else {

        // buffer setup

        vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
        gl.enableVertexAttribArray(vertexPositionAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_position_buffer);
        gl.vertexAttribPointer(vertexPositionAttribute, triangleStripMesh.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

        textureCoordAttribute = gl.getAttribLocation(glProgram, "aVertexUv");
        gl.enableVertexAttribArray(textureCoordAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_uvs_buffer);
        gl.vertexAttribPointer(textureCoordAttribute, triangleStripMesh.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

        vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
        gl.enableVertexAttribArray(vertexNormalAttribute);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleStripMesh.webgl_normal_buffer);
        gl.vertexAttribPointer(vertexNormalAttribute, triangleStripMesh.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleStripMesh.webgl_index_buffer);

        if (mode!="wireframe"){
    
            //gl.uniform1i(glProgram.useLightingUniform,(lighting=="true"));                    
            gl.drawElements(gl.TRIANGLE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        if (mode!="smooth") {
            
            //gl.uniform1i(glProgram.useLightingUniform,false);
            gl.drawElements(gl.LINE_STRIP, triangleStripMesh.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}

// set the shader matrix to transform the vertices
function setShaderMatrix(mMatrix, color, texture, isReflective, isTerrain) {

    // clear back buffer
	//gl.enable(gl.CULL_FACE);
    //gl.enable(gl.DEPTH.TEST);
    //gl.clearColor(0,0,0,1);
    //gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    if(isReflective) {

        gl.useProgram(glProgramReflectionMap);

        var normalMatrix = glMatrix.mat4.clone(mMatrix);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);

        gl.uniformMatrix4fv(modelMatrixUniformRM, false, mMatrix);
        gl.uniformMatrix4fv(normalMatrixUniformRM, false, normalMatrix);


        gl.activeTexture(gl.TEXTURE0);
        //gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        gl.uniform1i(uSamplerCubeUniformRM, 0);


    } else if(isTerrain) {

        gl.useProgram(glProgramTerrain);

        var normalMatrix = glMatrix.mat4.clone(mMatrix);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);

        gl.uniformMatrix4fv(modelMatrixUniformT, false, mMatrix);
        gl.uniformMatrix4fv(normalMatrixUniformT, false, normalMatrix);


        gl.useProgram(glProgramTerrain);

        var texture1 = loadTexture("texturas/Grass01_2K_BaseColor_resultado.jpg");
        var texture2 = loadTexture("texturas/Moss01_2K_BaseColor_resultado.jpg");
        var texture3 = loadTexture("texturas/SandyGravel02_2K_BaseColor_resultado.jpg");

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture1);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, texture3);

        gl.uniform1i(uSamplerGrassUniformT, 1);
        gl.uniform1i(uSamplerMossUniformT, 2);                
        gl.uniform1i(uSamplerSandyGravelUniformT, 3);




    } else {

        gl.useProgram(glProgram);

        var normalMatrix = glMatrix.mat4.clone(mMatrix);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);

        gl.uniformMatrix4fv(modelMatrixUniform, false, mMatrix);
        gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);

        gl.uniform4fv(colorUniform, color);

        if(texture != null) {
    
            // Tell WebGL we want to affect texture unit 4
            gl.activeTexture(gl.TEXTURE4);
            // Bind the texture to texture unit 4
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(uSamplerUniform, 4);
        }
    }
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

    var cornerDelta = 2.5;
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

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(url) {
    
    if(textures.has(url)) {

        return textures.get(url);
    }
    
    //textures.set('Jessie', {phone: "213-555-1234", address: "123 N 1st Ave"})
    
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    
    image.onload = function() {
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        // WebGL1 has different requirements for power of 2 images
        // vs non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            
            // Yes, it's a power of 2. Generate mips.
            
            gl.generateMipmap(gl.TEXTURE_2D);
        
        } else {
            
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    
    image.src = url;

    textures.set(url, texture);

    return texture;
}

function isPowerOf2(value) {
    
    return (value & (value - 1)) == 0;
}
