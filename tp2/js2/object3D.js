
class Object3D {

    constructor(rows = 10, columns = 20) {

        // a triangleStripMesh is a container with the position, normal, uv and index buffers
        this.triangleStripMesh = null;

        // model matrix (relative to its parent)
        this.modelMatrix = mat4.create();

        this.translation = vec3.fromValues(0,0,0); // default: (0,0,0)
        this.rotation = vec3.fromValues(0,0,0); // default: (0,0,0)
        this.scale = vec3.fromValues(1,1,1); // default: (1,1,1)
        
        this.children = [];

        this.rows = rows;
        this.columns = columns;

        this.texture = null;
        this.textureURL = null;
        this.textureScale = vec2.create();

        this.isReflective = false;
    }

    setReflective() {

        this.isReflective = true;
    }

    resetModelMatrix() {

        mat4.identity(this.modelMatrix);
    }

    initializeObject() {
        
        this.triangleStripMesh = null;
    }

    setTextureURL(textureURL) {

        this.textureURL = textureURL;
        this.texture = loadTexture(textureURL);
    }

	updateModelMatrix() {
		
		mat4.translate(this.modelMatrix, this.modelMatrix, this.translation);
        
        mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
		mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
		mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
		
		mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

        // return to default values
        this.translation = vec3.fromValues(0,0,0); // default: (0,0,0)
        this.rotation = vec3.fromValues(0,0,0); // default: (0,0,0)
        this.scale = vec3.fromValues(1,1,1); // default: (1,1,1)
	}

    draw(parentMatrix = mat4.create()) {

		var m = mat4.create();

		mat4.multiply(m, parentMatrix, this.modelMatrix);
        // m is now the model matrix relative to the world

        if(this.triangleStripMesh) {

            if(this.isReflective) {

                setShaderMatrix(m, this.color, this.texture, true, glProgramReflectionMap);
                drawTriangleStripMesh(this.triangleStripMesh, true);
    
            } else {
    
                setShaderMatrix(m, this.color, this.texture, false, glProgram);
                drawTriangleStripMesh(this.triangleStripMesh, false);
            }
        }

		for (var i = 0; i < this.children.length; i++){
			this.children[i].draw(m);
		}
	}

    addChildren(newChild) {
		
        this.children.push(newChild);
	}

	removeChildren(childrenToRemove) {
		
        const index = this.children.indexOf(childrenToRemove);
		
        if (index > -1) {
		    this.children.splice(index, 1);
		}
	}

    setTranslation(x, y, z) {
		
        vec3.set(this.translation, x, y, z);
        this.updateModelMatrix();
	}

	setRotation(x, y, z) {
		
        vec3.set(this.rotation, x, y, z);
        this.updateModelMatrix();
	}

	setScale(x, y, z) {
		
        vec3.set(this.scale, x, y, z);
        this.updateModelMatrix();
	}
}

class Tile extends Object3D {

    constructor(tileForm, textureScale = vec2.fromValues(1.0,1.0), textureURL = null) {

        super(10,10); // rows and columns makes no effect

        this.color = vec4.fromValues(1.0,1.0,1.0,1.0);

        this.sweptSurface = null;

        this.textureScale = textureScale;

        if(textureURL != null) {

            this.setTextureURL(textureURL);
        }

        this.tileForm = tileForm;

        this.initializeObject();
    }

    initializeObject() {

        var tileSweep = new StraightLine();
        tileSweep.setControlPoints([0,0,0], [0,0.3,0]);

        var tileDeltaForm = 0.01;
        var tileDeltaSweep = 0.5;

        this.sweptSurface = new TileSurface(this.tileForm, tileSweep, tileDeltaForm, tileDeltaSweep);

        this.triangleStripMesh = this.sweptSurface.setupBuffers();
    }
}

class Square extends Object3D {

    constructor(rows = 10, columns = 20, lado = 1, color = vec4.fromValues(1.0,1.0,0.0,1.0), textureScale = vec2.fromValues(1.0,1.0), textureURL = null) {

        super(rows, columns);

        this.rootSurface = new SquareSurface(lado);

        this.textureScale = textureScale;
        this.color = color;

        if(textureURL != null) {

            this.setTextureURL(textureURL);
        }

        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns, this.textureScale);
    }
}

class Cube extends Object3D {

    constructor(rows = 10, columns = 20, lado = 1, color = vec4.fromValues(1.0,1.0,0.0,1.0), textureScale = vec2.fromValues(1.0,1.0), textureURL = null) {

        super(rows, columns);

        this.lado = lado;

        this.rootSurface = new SquareSurface(lado);

        this.textureScale = textureScale;
        this.color = color;

        if(textureURL != null) {

            this.setTextureURL(textureURL);
        }

        this.initializeObject();
    }

    initializeObject() {

        // test

        this.triangleStripMesh = null;

        var alteredTextureScale = vec2.fromValues(this.textureScale[1], this.textureScale[0]);

        var cara1 = new Square(this.rows,this.columns,this.lado,this.color,this.textureScale,this.textureURL);
        cara1.setTranslation(0,this.lado/2,0.0);
        this.children.push(cara1);
       
        var cara2 = new Square(this.rows,this.columns,this.lado,this.color,this.textureScale,this.textureURL);
        cara2.setScale(1,-1,1);
        cara2.setTranslation(0,this.lado/2,0.0);
        this.children.push(cara2);

        var cara3 = new Square(this.rows,this.columns,this.lado,this.color,alteredTextureScale,this.textureURL);
        cara3.setRotation(0,0,Math.PI/2.0);
        cara3.setScale(1,-1,1);
        cara3.setTranslation(0,this.lado/2,0);
        this.children.push(cara3);

        var cara4 = new Square(this.rows,this.columns,this.lado,this.color,alteredTextureScale,this.textureURL);
        cara4.setRotation(0,0,Math.PI/2.0);
        cara4.setTranslation(0,this.lado/2,0);
        this.children.push(cara4);

        var cara5 = new Square(this.rows,this.columns,this.lado,this.color,this.textureScale,this.textureURL);
        cara5.setRotation(Math.PI/2.0,0,0);
        cara5.setScale(1,-1,1);
        cara5.setTranslation(0,this.lado/2,0);
        this.children.push(cara5);

        var cara6 = new Square(this.rows,this.columns,this.lado,this.color,this.textureScale,this.textureURL);
        cara6.setRotation(Math.PI/2.0,0,0);
        cara6.setTranslation(0,this.lado/2,0);
        this.children.push(cara6);
    }
}

class Circle extends Object3D {

    constructor(rows = 10, columns = 20, radius = 1, color = vec4.fromValues(1.0,0.0,0.0,1.0), textureScale = vec2.fromValues(1.0,1.0), textureURL = null) {

        super(rows, columns);

        this.radius = radius;
        this.textureScale = textureScale;
        this.color = color;

        if(textureURL != null) {

            this.setTextureURL(textureURL);
        }


        this.rootSurface = new CircleSurface(radius);
        
        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns, this.textureScale);
    }
}

class Sphere extends Object3D {

    constructor(rows = 10, columns = 20, radius = 1, color = vec4.fromValues(1.0,0.0,0.0,1.0)) {

        super(rows, columns);

        this.radius = radius;
        this.color = color;

        this.rootSurface = new SphereSurface(radius);
        
        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns);
    }
}

class CylinderWithoutLids extends Object3D {

    constructor(rows = 10, columns = 20, radius = 1, height = 5, color = vec4.fromValues(0.0,0.0,1.0,1.0), textureScale = vec2.fromValues(1.0,1.0), textureURL = null) {

        super(rows, columns);

        this.radius = radius;
        this.height = height;
        
        this.color = color;

        this.textureScale = textureScale;

        if(textureURL != null) {

            this.setTextureURL(textureURL);
        }

        this.rootSurface = new CylinderWithoutLidsSurface(radius, height);

        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns, this.textureScale);
    }
}

class Cylinder extends Object3D {

    constructor(rows = 10, columns = 20, radius = 1, height = 5, color = vec4.fromValues(0.0,0.0,1.0,1.0), textureScale = vec2.fromValues(1.0,1.0), textureURL = null) {

        super(rows, columns);

        this.radius = radius;
        this.height = height;
        
        this.textureScale = textureScale;
        this.color = color;

        if(textureURL != null) {

            this.setTextureURL(textureURL);
        }

        this.rootSurface = null;
        
        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = null;

        var cylinderWithoutLids = new CylinderWithoutLids(this.rows, this.columns, this.radius, this.height, this.color, this.textureScale, this.textureURL);
        this.addChildren(cylinderWithoutLids);

        var circuloSuperior = new Circle(this.rows, this.columns, this.radius, this.color, this.textureScale, this.textureURL);
        circuloSuperior.setTranslation(0,this.height/2,0);
        this.addChildren(circuloSuperior);

        var circuloInferior = new Circle(this.rows, this.columns, this.radius, this.color, this.textureScale, this.textureURL);
        circuloInferior.setScale(1,-1,1);
        circuloInferior.setTranslation(0,this.height/2,0);
        this.addChildren(circuloInferior);
    }
}

class Axis extends Object3D {

    constructor(color = vec4.fromValues(0.0,0.0,1.0,1.0), direction) {

        super(10, 10);

        this.direction = direction;
        this.color = color;

        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = null;

        var x = this.direction[0];
        var y = this.direction[1];
        var z = this.direction[2];

        var line = new StraightLine();

        line.setControlPoints([0,0,0], [x,y,z]);

        var discretizedLine = discretizeCurve(line, 0.005);    

        var cube0 = new Cube(2, 2, 0.01, this.color);
        cube0.setTranslation(discretizedLine.positions[0][0],discretizedLine.positions[0][1],discretizedLine.positions[0][2]);
        this.addChildren(cube0);

        var cube1 = new Cube(2, 2, 0.01, this.color);
        cube1.setTranslation(discretizedLine.positions[1][0],discretizedLine.positions[1][1],discretizedLine.positions[1][2]);
        this.addChildren(cube1);

        var cube2 = new Cube(2, 2, 0.01, this.color);
        cube2.setTranslation(discretizedLine.positions[2][0],discretizedLine.positions[2][1],discretizedLine.positions[2][2]);
        this.addChildren(cube2);

        var cube3 = new Cube(2, 2, 0.01, this.color);
        cube3.setTranslation(discretizedLine.positions[3][0],discretizedLine.positions[3][1],discretizedLine.positions[3][2]);
        this.addChildren(cube3);
    }
}