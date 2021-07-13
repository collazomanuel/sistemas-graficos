
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
    }

    resetModelMatrix() {

        mat4.identity(this.modelMatrix);
    }

    initializeObject() {
        
        this.triangleStripMesh = null;
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

    draw(parentMatrix) {

		var m = mat4.create();

		mat4.multiply(m, parentMatrix, this.modelMatrix);
        // m is now the model matrix relative to the world

        if (this.triangleStripMesh){
			setShaderMatrix(m, this.color);
			drawTriangleStripMesh(this.triangleStripMesh);
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

class Square extends Object3D {

    constructor(rows = 10, columns = 20, lado = 1, color = vec4.fromValues(1.0,1.0,0.0,1.0)) {

        super(rows, columns);

        this.rootSurface = new SquareSurface(lado);

        this.initializeObject();

        this.color = color;
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns);
    }
}

class Cube extends Object3D {

    constructor(rows = 10, columns = 20, lado = 1, color = vec4.fromValues(1.0,1.0,0.0,1.0)) {

        super(rows, columns);

        this.lado = lado;
        this.color = color;

        this.rootSurface = new SquareSurface(lado);

        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = null;

        var cara1 = new Square(this.rows,this.columns,this.lado,this.color);
        cara1.setTranslation(0,this.lado/2,0.0);
        this.children.push(cara1);
       
        var cara2 = new Square(this.rows,this.columns,this.lado,this.color);
        cara2.setTranslation(0,-this.lado/2,0.0);
        this.children.push(cara2);

        var cara3 = new Square(this.rows,this.columns,this.lado,this.color);
        cara3.setRotation(0,0,Math.PI/2.0);
        cara3.setTranslation(0,-this.lado/2,0);
        this.children.push(cara3);

        var cara4 = new Square(this.rows,this.columns,this.lado,this.color);
        cara4.setRotation(0,0,Math.PI/2.0);
        cara4.setTranslation(0,this.lado/2,0);
        this.children.push(cara4);

        var cara5 = new Square(this.rows,this.columns,this.lado,this.color);
        cara5.setRotation(Math.PI/2.0,0,0);
        cara5.setTranslation(0,-this.lado/2,0);
        this.children.push(cara5);

        var cara6 = new Square(this.rows,this.columns,this.lado,this.color);
        cara6.setRotation(Math.PI/2.0,0,0);
        cara6.setTranslation(0,this.lado/2,0);
        this.children.push(cara6);
    }
}

class Circle extends Object3D {

    constructor(rows = 10, columns = 20, radius = 1, color = vec4.fromValues(1.0,0.0,0.0,1.0)) {

        super(rows, columns);

        this.radius = radius;
        this.color = color;

        this.rootSurface = new CircleSurface(radius);
        
        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns);
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

    constructor(rows = 10, columns = 20, radius = 1, height = 5, color = vec4.fromValues(0.0,0.0,1.0,1.0)) {

        super(rows, columns);

        this.radius = radius;
        this.height = height;
        this.color = color;

        this.rootSurface = new CylinderWithoutLidsSurface(radius, height);

        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = setupBuffersBySurface(this.rootSurface, this.rows, this.columns);
    }
}

class Cylinder extends Object3D {

    constructor(rows = 10, columns = 20, radius = 1, height = 5, color = vec4.fromValues(0.0,0.0,1.0,1.0)) {

        super(rows, columns);

        this.radius = radius;
        this.height = height;
        this.color = color;

        this.rootSurface = null;
        
        this.initializeObject();
    }

    initializeObject() {

        this.triangleStripMesh = null;

        var cylinderWithoutLids = new CylinderWithoutLids(this.rows, this.columns, this.radius, this.height, this.color);
        this.addChildren(cylinderWithoutLids);

        var circuloSuperior = new Circle(this.rows, this.columns, this.radius, this.color);
        circuloSuperior.setTranslation(0,this.height/2,0);
        this.addChildren(circuloSuperior);

        var circuloInferior = new Circle(this.rows, this.columns, this.radius, this.color);
        circuloInferior.setScale(1,-1,1);
        circuloInferior.setTranslation(0,this.height/2,0);
        this.addChildren(circuloInferior);
    }
}
