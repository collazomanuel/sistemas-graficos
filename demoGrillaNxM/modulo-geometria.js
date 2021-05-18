

/*

    Tareas:
    ------

    1) Modificar la función "generarSuperficie" para que tenga en cuenta los parametros filas y columnas al llenar el indexBuffer
       Con esta modificación deberían poder generarse planos de N filas por M columnas

    2) Modificar la funcion "dibujarMalla" para que use la primitiva "triangle_strip"

    3) Crear nuevos tipos funciones constructoras de superficies

        3a) Crear la función constructora "Esfera" que reciba como parámetro el radio

        3b) Crear la función constructora "TuboSenoidal" que reciba como parámetro la amplitud de onda, longitud de onda, radio del tubo y altura.
        (Ver imagenes JPG adjuntas)
        
        
    Entrega:
    -------

    - Agregar una variable global que permita elegir facilmente que tipo de primitiva se desea visualizar [plano,esfera,tubosenoidal]
    
*/


var superficie3D;
var mallaDeTriangulos;

var filas=30;
var columnas=50;

var figura="plano"; // plano, esfera o tubo senoidal


function crearGeometria(){


    if (figura=="plano") {
        superficie3D=new Plano(3, 3);
    }
        
    else if (figura=="esfera") {
        superficie3D=new Esfera(1);
    }
        
    else if (figura=="tubo senoidal") {
        superficie3D=new TuboSenoidal(0.10, 0.20, 0.80, 3.00);
    }
    
    mallaDeTriangulos=generarSuperficie(superficie3D,filas,columnas);
    
}

function dibujarGeometria(){

    dibujarMalla(mallaDeTriangulos);

}

function Plano(ancho,largo){

    this.getPosicion=function(u,v){

        var x = (u - 0.5) * ancho;
        var y = 0;
        var z = (v - 0.5) * largo;
        
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        
        return [0,1,0];
    }

    this.getCoordenadasTextura=function(u,v){
        
        return [u,v];
    }
}

// ---------- Funciones nuevas -----------

function Esfera(radio){

    this.getPosicion=function(u,v){

        var x = radio * Math.sin(v*Math.PI) * Math.cos(2*u*Math.PI);
        var y = radio * Math.cos(v*Math.PI);
        var z = radio * Math.sin(v*Math.PI) * Math.sin(2*u*Math.PI);
        
        return [x,y,z];
    }

    this.getNormal=function(u,v){
        
        var pos = this.getPosicion(u,v);
        
        return [(pos.x/radio), (pos.y/radio), (pos.z/radio)];
    }

    this.getCoordenadasTextura=function(u,v){
        
        return [u,v];
    }
}

function TuboSenoidal(amplitudDeOnda, longitudDeOnda, radio, altura){
    
    this.productoVectorial=function(v1, v2){
 
        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = v1[2] * v2[0] - v1[0] * v2[2];
        var z = v1[0] * v2[1] - v1[1] * v2[0];

        return [x, y, z];
    }
    
    this.getPosicion=function(u,v){

        var x = Math.cos(2*u*Math.PI) * (radio + amplitudDeOnda*Math.sin(2*v*Math.PI/longitudDeOnda));
        var y = (v - 0.5) * altura;
        var z = Math.sin(2*u*Math.PI) * (radio + amplitudDeOnda*Math.sin(2*v*Math.PI/longitudDeOnda));
        
        return [x,y,z];
    }


    this.getNormal=function(u,v){
        
        var du = 0.0001;
        var dv = 0.0001;
        var v1 = this.getPosicion(u + du, v);
        var v2 = this.getPosicion(u, v + dv);

        return this.productoVectorial(v1, v2);
    }

    this.getCoordenadasTextura=function(u,v){
        
        return [u,v];
    }    

}


// ---------------------------------------


function generarSuperficie(superficie,filas,columnas){
    
    positionBuffer = [];
    normalBuffer = [];
    uvBuffer = [];

    for (var i=0; i <= filas; i++) {
        for (var j=0; j <= columnas; j++) {

            var u=j/columnas;
            var v=i/filas;

            var pos=superficie.getPosicion(u,v);

            positionBuffer.push(pos[0]);
            positionBuffer.push(pos[1]);
            positionBuffer.push(pos[2]);

            var nrm=superficie.getNormal(u,v);

            normalBuffer.push(nrm[0]);
            normalBuffer.push(nrm[1]);
            normalBuffer.push(nrm[2]);

            var uvs=superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);

        }
    }

    // Buffer de indices de los triángulos
    
    //indexBuffer=[];  
    //indexBuffer=[0,1,2,2,1,3]; // Estos valores iniciales harcodeados solo dibujan 2 triangulos, REMOVER ESTA LINEA!


    // ---------------------------------------------------

    indexBuffer=[];
    var indexCount = 0;


    for (i=0; i < filas; i++) {
        for (j=0; j < columnas; j++) {

            indexBuffer[indexCount++] = parseInt(i * (columnas + 1) + j);
            indexBuffer[indexCount++] = parseInt((i + 1) * (columnas + 1) + j);
        }

        indexBuffer[indexCount++] = parseInt((i) * (columnas + 1) + columnas);
        indexBuffer[indexCount++] = parseInt((i + 1) * (columnas + 1) + columnas);

        if(i != filas - 1){
            indexBuffer[indexCount++] = parseInt((i + 1) * (columnas + 1) + columnas);
            indexBuffer[indexCount++] = parseInt((i + 1) * (columnas + 1));
        }
    }

    
    // ---------------------------------------------------


    // Creación e Inicialización de los buffers

    webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;


    webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}

function dibujarMalla(mallaDeTriangulos){
    
    // Se configuran los buffers que alimentaron el pipeline
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
       
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);


    if (modo!="wireframe"){
        gl.uniform1i(shaderProgram.useLightingUniform,(lighting=="true"));                    
        /*
            Aqui es necesario modificar la primitiva por triangle_strip
        */
        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
    
    if (modo!="smooth") {
        gl.uniform1i(shaderProgram.useLightingUniform,false);
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
 
}

