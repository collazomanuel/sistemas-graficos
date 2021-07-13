
class SquareSurface {

    constructor(lado) {

        this.lado = lado;
    }

    getPosition(u,v){

        var z = (u - 0.5) * this.lado;
        var x = (v - 0.5) * this.lado;
        var y = 0.0;
        
        return [x,y,z];
    }

    getNormal(u,v){
        
        return [0,1,0];
    }

    getTextureCoordinates(u,v){
        
        return [u,v];
    }
}

class CylinderWithoutLidsSurface {
    
    constructor(radius, height) {

        this.radius = radius;
        this.height = height;
    }

    productoVectorial(v1, v2){
 
        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = v1[2] * v2[0] - v1[0] * v2[2];
        var z = v1[0] * v2[1] - v1[1] * v2[0];

        return [x, y, z];
    }
    
    getPosition(u,v){

        var z = Math.cos(2*u*Math.PI) * this.radius;
        var x = Math.sin(2*u*Math.PI) * this.radius;
        var y = (v-0.5) * this.height;
        
        return [x,y,z];
    }

    getNormal(u,v){

        var du = 0.0001;
        var dv = 0.0001;
        var v1 = this.getPosition(u + du, v);
        var v2 = this.getPosition(u, v + dv);

        return this.productoVectorial(v1, v2);
    }

    getTextureCoordinates(u,v){
        
        return [u,v];
    }
}

class CircleSurface {

    constructor(radius) {

        this.radius = radius;
    }
    
    getPosition(u,v){

        var x = Math.sin(2*u*Math.PI) * Math.sin(2*v*Math.PI) * this.radius;
        var y = 0;
        var z = Math.cos(2*u*Math.PI) * Math.sin(2*v*Math.PI) * this.radius;
        
        return [x,y,z];
    }

    getNormal(u,v){

        return [0,1,0];
    }

    getTextureCoordinates(u,v){
        
        return [u,v];
    }
}

class SphereSurface {

    constructor(radius) {

        this.radius = radius;
    }

    getPosition(u,v){

        var x = this.radius * Math.sin(v*Math.PI) * Math.cos(2*u*Math.PI);
        var y = this.radius * Math.cos(v*Math.PI);
        var z = this.radius * Math.sin(v*Math.PI) * Math.sin(2*u*Math.PI);
        
        return [x,y,z];
    }

    getNormal(u,v){
        
        var pos = this.getPosition(u,v);
        
        return [(pos.x/this.radius), (pos.y/this.radius), (pos.z/this.radius)];
    }

    getTextureCoordinates(u,v){
        
        return [u,v];
    }
}

function setupBuffersBySurface(surface, rows, columns){

    // set up position, normal and uv buffers
	
    var positionBuffer = [];
	var normalBuffer = [];
	var uvBuffer = [];

	for (var i=0; i <= rows; i++) {
		
        for (var j=0; j <= columns; j++) {

			var u=j/columns;
			var v=i/rows;

			var pos = surface.getPosition(u,v);

			positionBuffer.push(pos[0]);
			positionBuffer.push(pos[1]);
			positionBuffer.push(pos[2]);

			var nrm = surface.getNormal(u,v);

			normalBuffer.push(nrm[0]);
			normalBuffer.push(nrm[1]);
			normalBuffer.push(nrm[2]);

            var uvs = surface.getTextureCoordinates(u,v);

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);
		}
	}

    // set up index buffer
    
	var indexBuffer = [];

	for (i=0; i < rows; i++) {
		
        for (j=0; j < columns; j++) {

			indexBuffer.push(i*(columns+1)+j);
			indexBuffer.push((i+1)*(columns+1)+j);
		}

		indexBuffer.push((i)*(columns+1)+columns);
		indexBuffer.push((i+1)*(columns+1)+columns);

		if(i != rows-1){
			indexBuffer.push((i+1)*(columns+1)+columns);
			indexBuffer.push((i+1)*(columns+1));
		}
	}
	
    // buffers creation and initialization

    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    var webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;

    var webgl_index_buffer = gl.createBuffer();
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
