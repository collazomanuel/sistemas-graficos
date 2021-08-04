
class SweptSurface {

    // form circle, curve, anything in 2D
    
    // sweep: curve, straight line (extrusion), anything that has the methods: 
    //      getPositionVectorAt();
    //      getTangentVectorAt();
    //      getNormalVectorAt();
    //      getBinormalVectorAt();

    constructor(form, sweep, deltaForm, deltaSweep) {

        this.positionBuffer = [];
        this.normalBuffer = [];
        this.uvBuffer = [];
        this.indexBuffer = [];

        this.form = form; // "2D" (y = 0)
        this.sweep = sweep; // 3D

        this.deltaForm = deltaForm;
        this.deltaSweep = deltaSweep;
        
        this.levels = 1/deltaSweep;
        
        // positions, tangents, binormals, normals
        this.perimeter = discretizeCurve(this.form, this.deltaForm); // positions, tangents, binormals and normals (y=0)
    }

    getLevelMatrix(level) {

        // level 0, level 1, level 2, etc...
        // u=0, u=0.1, u=0.2, ... u=0.9, u=1.0
        var u = level/(this.levels-1);

        var position = this.sweep.getPositionVectorAt(u);
        var tangent = this.sweep.getTangentVectorAt(u);
        var binormal = this.sweep.getBinormalVectorAt(u);
        var normal = this.sweep.getNormalVectorAt(u);

        // HARDCODING
        //var normal = vec3.fromValues(1,0,0);
        //var tangent = vec3.fromValues(0,1,0);
        //var binormal = vec3.fromValues(0,0,1);

        var levelMatrix = mat4.fromValues(

            normal[0], tangent[0], binormal[0], position[0],
            normal[1], tangent[1], binormal[1], position[1],
            normal[2], tangent[2], binormal[2], position[2],
            0        , 0          , 0         , 1
        );

        mat4.transpose(levelMatrix, levelMatrix);

        return levelMatrix;
    }

    addSurfaceVertices() {
    }

    generateIndexBuffer() {
    }

    setupBuffers() {
    }
}


class TileSurface extends SweptSurface {

    constructor(form, sweep, deltaForm, deltaSweep) {

        super(form, sweep, deltaForm, deltaSweep);
    }

    addBottomLidVertices() {

        var verticesPerLevel = this.perimeter.positions.length;

        var bottomCenterPosition = this.sweep.getPositionVectorAt(0);
        var bottomCenterNormal = this.sweep.getTangentVectorAt(0);
        vec3.scale(bottomCenterNormal, bottomCenterNormal, -1); // if I use the sweep tangent vector as the surface normal, then it has to be inverted for the bottom lid
        var uv = vec2.fromValues(0,0);

        this.positionBuffer.push(bottomCenterPosition[0]);
        this.positionBuffer.push(bottomCenterPosition[1]);
        this.positionBuffer.push(bottomCenterPosition[2]);

        this.normalBuffer.push(bottomCenterNormal[0]);
        this.normalBuffer.push(bottomCenterNormal[1]);
        this.normalBuffer.push(bottomCenterNormal[2]);

        this.uvBuffer.push(uv[0]);
        this.uvBuffer.push(uv[1]);

        var levelMatrix = this.getLevelMatrix(0);

        for (let j = 0; j < verticesPerLevel; j++) {

            var position3D = vec3.clone(this.perimeter.positions[j]);
            
            var uv = vec2.fromValues(this.perimeter.positions[j][0]/5,this.perimeter.positions[j][2]/5);

            var position4D = vec4.fromValues(position3D[0], position3D[1], position3D[2], 1);

            vec4.transformMat4(position4D, position4D, levelMatrix);

            position3D = [position4D[0], position4D[1], position4D[2]];
            
            this.positionBuffer.push(position3D[0]);
            this.positionBuffer.push(position3D[1]);
            this.positionBuffer.push(position3D[2]);
            this.normalBuffer.push(bottomCenterNormal[0]);
            this.normalBuffer.push(bottomCenterNormal[1]);
            this.normalBuffer.push(bottomCenterNormal[2]);
            this.uvBuffer.push(uv[0]);
            this.uvBuffer.push(uv[1]);
        }

        
    }

    addSurfaceVertices() {

        var verticesPerLevel = this.perimeter.positions.length;
        
        for (let i = 0; i < this.levels; i++) {

            var levelMatrix = this.getLevelMatrix(i);
            
            for (let j = 0; j < verticesPerLevel; j++) {

                var position3D = vec3.clone(this.perimeter.positions[j]);
                var normal3D = vec3.clone(this.perimeter.normals[j]);
                
                var uv = vec2.fromValues(this.perimeter.positions[j][0]/5,this.perimeter.positions[j][2]/5);

                var position4D = vec4.fromValues(position3D[0], position3D[1], position3D[2], 1);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1);

                vec4.transformMat4(position4D, position4D, levelMatrix);
                vec4.transformMat4(normal4D, normal4D, levelMatrix);

                position3D = [position4D[0], position4D[1], position4D[2]];
                normal3D = [normal4D[0], normal4D[1], normal4D[2]];

                vec3.normalize(normal3D,normal3D);
                
                this.positionBuffer.push(position3D[0]);
                this.positionBuffer.push(position3D[1]);
                this.positionBuffer.push(position3D[2]);
                this.normalBuffer.push(normal3D[0]);
                this.normalBuffer.push(normal3D[1]);
                this.normalBuffer.push(normal3D[2]);
                this.uvBuffer.push(uv[0]);
                this.uvBuffer.push(uv[1]);
            }
        }
    }

    addTopLidVertices() {

        var verticesPerLevel = this.perimeter.positions.length;

        var levelMatrix = this.getLevelMatrix(this.levels-1);

        var topCenterPosition = this.sweep.getPositionVectorAt(1);
        var topCenterNormal = this.sweep.getTangentVectorAt(1);
        var uv = vec2.fromValues(0,0);

        for (let j = 0; j < verticesPerLevel; j++) {

            var position3D = vec3.clone(this.perimeter.positions[j]);
            
            var uv = vec2.fromValues(this.perimeter.positions[j][0]/5,this.perimeter.positions[j][2]/5);

            var position4D = vec4.fromValues(position3D[0], position3D[1], position3D[2], 1);

            vec4.transformMat4(position4D, position4D, levelMatrix);

            position3D = [position4D[0], position4D[1], position4D[2]];
            
            this.positionBuffer.push(position3D[0]);
            this.positionBuffer.push(position3D[1]);
            this.positionBuffer.push(position3D[2]);
            this.normalBuffer.push(topCenterNormal[0]);
            this.normalBuffer.push(topCenterNormal[1]);
            this.normalBuffer.push(topCenterNormal[2]);
            this.uvBuffer.push(uv[0]);
            this.uvBuffer.push(uv[1]);
        }

        this.positionBuffer.push(topCenterPosition[0]);
        this.positionBuffer.push(topCenterPosition[1]);
        this.positionBuffer.push(topCenterPosition[2]);

        this.normalBuffer.push(topCenterNormal[0]);
        this.normalBuffer.push(topCenterNormal[1]);
        this.normalBuffer.push(topCenterNormal[2]);

        this.uvBuffer.push(0.0);
        this.uvBuffer.push(0.0);
    }

    generateIndexBuffer() {

        var bottomLidIndex = 0;
        var topLidIndex = (this.positionBuffer.length/3);

        var verticesPerLevel = this.perimeter.positions.length;

        // bottom lid

        for (let i = 1; i < verticesPerLevel+1; i++) {
            
            this.indexBuffer.push(bottomLidIndex);
            this.indexBuffer.push(i); // first vertices
        }

        for (let point = 0; point < verticesPerLevel; point++) {

            this.indexBuffer.push((1+(0+0)*verticesPerLevel)+point);
            this.indexBuffer.push((1+(0+1)*verticesPerLevel)+point);
        }

        this.indexBuffer.push(1+((0+1)*verticesPerLevel)+0);

        // surface

        for (let level = 0; level < this.levels; level++) {
            
            for (let point = 0; point < verticesPerLevel; point++) {

                this.indexBuffer.push((1+(level+0+1)*verticesPerLevel)+point);
                this.indexBuffer.push((1+(level+1+1)*verticesPerLevel)+point);
            }

            this.indexBuffer.push(1+((level+1)*verticesPerLevel)+0);
        }

        // top lid

        for (let point = 0; point < verticesPerLevel; point++) {

            this.indexBuffer.push((1+(this.levels-1+0)*verticesPerLevel)+point);
            this.indexBuffer.push((1+(this.levels+1)*verticesPerLevel)+point);
        }

        this.indexBuffer.push(1+((this.levels+1)*verticesPerLevel)+0);


        for (let i = 0; i < verticesPerLevel; i++) {
            
            this.indexBuffer.push(topLidIndex);
            this.indexBuffer.push((topLidIndex-verticesPerLevel)+i); // last vertices
        }
    }

    setupBuffers() {

        this.addBottomLidVertices();
        this.addSurfaceVertices();
        this.addTopLidVertices();
        this.generateIndexBuffer();

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.positionBuffer.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.normalBuffer.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.uvBuffer.length / 2;
    
        var webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = this.indexBuffer.length;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }
}

class SlideSurface extends SweptSurface {

    constructor(form, sweep, deltaForm, deltaSweep) {

        super(form, sweep, deltaForm, deltaSweep);

        this.invertNormal = false;
    }

    setInvertNormal(){

        this.invertNormal = true;
    }

    addSurfaceVertices() {

        var verticesPerLevel = this.perimeter.positions.length - 1;
        
        for (let i = 0; i < this.levels; i++) {

            var levelMatrix = this.getLevelMatrix(i);

            var levelMatrixNormal = mat4.clone(levelMatrix);

            mat4.invert(levelMatrixNormal, levelMatrixNormal);
            mat4.transpose(levelMatrixNormal, levelMatrixNormal);
            
            for (let j = 0; j < verticesPerLevel; j++) {

                var position3D = vec3.clone(this.perimeter.positions[j]);
                var normal3D = vec3.clone(this.perimeter.normals[j]);

                var uv = vec2.fromValues(0,0);

                var position4D = vec4.fromValues(position3D[0], position3D[1], position3D[2], 1.0);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1.0);

                vec4.transformMat4(position4D, position4D, levelMatrix);
                vec4.transformMat4(normal4D, normal4D, levelMatrixNormal);

                position3D = vec3.fromValues(position4D[0], position4D[1], position4D[2]);
                normal3D = vec3.fromValues(normal4D[0], normal4D[1], normal4D[2]);
                
                if(this.invertNormal) {

                    vec3.scale(normal3D, normal3D, -1);
                }

                vec3.normalize(normal3D,normal3D);

                this.positionBuffer.push(position3D[0]);
                this.positionBuffer.push(position3D[1]);
                this.positionBuffer.push(position3D[2]);
                this.normalBuffer.push(normal3D[0]);
                this.normalBuffer.push(normal3D[1]);
                this.normalBuffer.push(normal3D[2]);
                this.uvBuffer.push(uv[0]);
                this.uvBuffer.push(uv[1]);
            }
        }
    }

    generateIndexBuffer() {

        var verticesPerLevel = this.perimeter.positions.length - 1;

        for (let level = 0; level < this.levels; level+=2) {
            
            for (let point = 0; point < verticesPerLevel; point++) {
                
                this.indexBuffer.push((((level+0)*verticesPerLevel)+point));
                this.indexBuffer.push((((level+1)*verticesPerLevel)+point));
            }

            if(level < this.levels - 2) {

                for (let point = verticesPerLevel-1; point >= 0; point--) {

                    this.indexBuffer.push((((level+1)*verticesPerLevel)+point));
                    this.indexBuffer.push((((level+2)*verticesPerLevel)+point));
                }
            }
        }        
    }

    setupBuffers() {

        this.addSurfaceVertices();
        this.generateIndexBuffer();

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.positionBuffer.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.normalBuffer.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.uvBuffer.length / 2;
    
        var webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = this.indexBuffer.length;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }
}
