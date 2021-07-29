
class Building {

    constructor(position = [0,0,0]) {

        this.position = position;
        
        this.controlPoints1 = [];
        this.controlPointsRandom1 = [];

        this.controlPoints2 = [];
        this.controlPointsRandom2 = [];
        
        this.numWindowsA = 8; // integer > 3
        this.numWindowsB = 8; // integer > 3

        this.numOfControlPoints1 = 2*this.numWindowsA + 2*this.numWindowsB;
        this.numOfControlPoints2 = 2*this.numWindowsA + 2*this.numWindowsB - 2 - 2 - 2 - 2;

        this.numFloorsFirstSection = 5 // integer > 1;
        this.numFloorsSecondSection = 5 // integer > 1;

        this.windowSize = 2;

        this.numColumns = 10;

        this.firstSectionFloor; // Object3D
        this.secondSectionFloor; // Object3D

        this.controlPoints1 = getControlPoints(this.numWindowsA, this.numWindowsB, this.windowSize);
        this.controlPointsRandom1 = getControlPointsRandom(this.numWindowsA, this.numWindowsB, this.windowSize);

        this.controlPoints2 = getControlPoints(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);
        this.controlPointsRandom2 = getControlPointsRandom(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);
    }

    setNumWindowsA(num) {

        if(num == this.numWindowsA) {

            return;
        }

        this.numWindowsA = num;
        this.numOfControlPoints1 = 2*this.numWindowsA + 2*this.numWindowsB;
        this.numOfControlPoints2 = 2*this.numWindowsA + 2*this.numWindowsB - 2 - 2 - 2 - 2;
        
        this.controlPoints1 = getControlPoints(this.numWindowsA, this.numWindowsB, this.windowSize);
        this.controlPointsRandom1 = getControlPointsRandom(this.numWindowsA, this.numWindowsB, this.windowSize);
        this.controlPoints2 = getControlPoints(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);
        this.controlPointsRandom2 = getControlPointsRandom(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);
    }

    setNumWindowsB(num) {

        if(num == this.numWindowsB) {

            return;
        }

        this.numWindowsB = num;
        this.numOfControlPoints1 = 2*this.numWindowsA + 2*this.numWindowsB;
        this.numOfControlPoints2 = 2*this.numWindowsA + 2*this.numWindowsB - 2 - 2 - 2 - 2;

        this.controlPoints1 = getControlPoints(this.numWindowsA, this.numWindowsB, this.windowSize);
        this.controlPointsRandom1 = getControlPointsRandom(this.numWindowsA, this.numWindowsB, this.windowSize);
        this.controlPoints2 = getControlPoints(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);
        this.controlPointsRandom2 = getControlPointsRandom(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);        
    }

    setNumFloorsFirstSection(num) {

        this.numFloorsFirstSection = num;
    }

    setNumFloorsSecondSection(num) {

        this.numFloorsSecondSection = num;
    }

    setNumColumns(num) {

        this.numColumns = num;
    }

    createFirstSectionFloor() {

        this.firstSectionFloor = new Object3D();

        var curve = new ClosedQuadraticBSpline();
        curve.setControlPoints(this.controlPointsRandom1);
        curve.setCenterPoint(vec3.fromValues(0,0,0));

        var tile = new Tile(curve);

        this.firstSectionFloor.addChildren(tile);

        var windows = new Object3D();
        var windowColor = vec4.fromValues(0.7,0.7,0.6,1.0);

        for (let i = 0; i < this.numOfControlPoints1; i++) {
            
            // add each window

            var xRotation = false;
            var zRotation = false;

            var cp1 = this.controlPoints1[i];
            var cp2;
            
            if(i == this.numOfControlPoints1 - 1) {

                cp2 = this.controlPoints1[0];

            } else {

                cp2 = this.controlPoints1[i+1];
            }            

            var centerPosition = vec3.create();
            vec3.add(centerPosition, cp1, cp2);
            vec3.scale(centerPosition, centerPosition, 1/2);
            vec3.add(centerPosition, centerPosition, vec3.fromValues(0,this.windowSize/2,0));

            var window = new Square(2,2,this.windowSize,windowColor);

            // translation
            window.setTranslation(centerPosition[0], centerPosition[1], centerPosition[2]);

            // rotation
            if(cp1[0] == cp2[0]) {

                zRotation = true;

            } else {

                xRotation = true;
            }

            window.setRotation(xRotation*Math.PI/2, 0, zRotation*Math.PI/2);

            windows.addChildren(window);
        }

        this.firstSectionFloor.addChildren(windows);

        // add columns

        var deltaCurve = 1/this.numColumns;
        var deltaNormal = 1.0;
        var columnsPositions = this.getColumnsPositions(curve, deltaCurve, deltaNormal);

        var columns = new Object3D();

        for (let i = 0; i < columnsPositions.length; i++) {

            var column = new Cylinder(10,10,0.2,this.windowSize,vec4.fromValues(0.35,0,0.11,1));

            column.setTranslation(columnsPositions[i][0], columnsPositions[i][1], columnsPositions[i][2]);

            column.setTranslation(0,this.windowSize/2,0);

            columns.addChildren(column);
        }

        this.firstSectionFloor.addChildren(columns);

    }

    createSecondSectionFloor() {

        this.secondSectionFloor = new Object3D();

        var curve = new ClosedQuadraticBSpline();
        curve.setControlPoints(this.controlPointsRandom2);
        curve.setCenterPoint(vec3.fromValues(0,0,0));

        var tile = new Tile(curve);

        this.secondSectionFloor.addChildren(tile);

        var windows = new Object3D();
        var windowColor = vec4.fromValues(0.7,0.7,0.6,1.0);

        for (let i = 0; i < this.numOfControlPoints2; i++) {
            
            // add each window

            var xRotation = false;
            var zRotation = false;

            var cp1 = this.controlPoints2[i];
            var cp2;
            
            if(i == this.numOfControlPoints2 - 1) {

                cp2 = this.controlPoints2[0];

            } else {

                cp2 = this.controlPoints2[i+1];

                if(this.controlPoints2.length != this.numOfControlPoints2) {

                    console.log("yey");
                }
            }

            var centerPosition = vec3.create();
            vec3.add(centerPosition, cp1, cp2);
            vec3.scale(centerPosition, centerPosition, 1/2);
            vec3.add(centerPosition, centerPosition, vec3.fromValues(0,this.windowSize/2,0));

            var window = new Square(2,2,this.windowSize,windowColor);

            // translation
            window.setTranslation(centerPosition[0], centerPosition[1], centerPosition[2]);

            // rotation
            if(cp1[0] == cp2[0]) {

                zRotation = true;

            } else {

                xRotation = true;
            }

            window.setRotation(xRotation*Math.PI/2, 0, zRotation*Math.PI/2);

            windows.addChildren(window);
        }

        this.secondSectionFloor.addChildren(windows);

        // add columns

        var deltaCurve = 1/this.numColumns;
        var deltaNormal = 1.0;
        var columnsPositions = this.getColumnsPositions(curve, deltaCurve, deltaNormal);

        var columns = new Object3D();

        for (let i = 0; i < columnsPositions.length; i++) {

            var column = new Cylinder(10,10,0.2,this.windowSize,vec4.fromValues(0.35,0,0.11,1));

            column.setTranslation(columnsPositions[i][0], columnsPositions[i][1], columnsPositions[i][2]);

            column.setTranslation(0,this.windowSize/2,0);

            columns.addChildren(column);
        }

        this.secondSectionFloor.addChildren(columns);
    }

    getColumnsPositions(curve, deltaCurve, deltaNormal) {

        // deltaCurve between 0 and 1 (0.05)
        // deltaNormal between 0 and 1

        var columnsPositions = [];

        for (let u = 0; u < 1; u+=deltaCurve) {
            
            var curvePosition = curve.getPositionVectorAt(u);
            var curveNormal = curve.getNormalVectorAt(u);

            var position = vec3.create();
            var normal = vec3.create();
            
            vec3.scale(normal, curveNormal, deltaNormal);
            vec3.add(position, curvePosition, normal);
            columnsPositions.push(position);
        }

        return columnsPositions;
    }

    draw() {

        // 1°) dibujar base
        // 2°) dibujar pisos seccion 1
        // 3°) dibujar techo del último piso seccion 1
        // 4°) dibujar pisos seccion 2
        // 5°) dibujar techo del último piso seccion 2
        // 6°) dibujar ascensor

        this.createFirstSectionFloor();
        this.createSecondSectionFloor();
        
        // paso 1: dibujar base

        var baseHeight = 3;
        var baseWidthA = this.numWindowsA/2;
        var baseWidthB = this.numWindowsB/2;

        var base = new Cube(2,2,baseHeight,vec4.fromValues(0.5,0.5,0.5,1));

        var mBase = mat4.create();
        mat4.fromTranslation(mBase, vec3.fromValues(0,baseHeight/2,0));
        mat4.scale(mBase, mBase, vec3.fromValues(baseWidthA,1.0,baseWidthB));
        base.draw(mBase);

        var floorHeight = baseHeight;

        // paso 2: dibujar pisos seccion 1

        var m1 = mat4.create();
        
        for (let i = 0; i < this.numFloorsFirstSection; i++) {
            
            var translation = vec3.fromValues(0,floorHeight,0);
            mat4.fromTranslation(m1, translation);

            this.firstSectionFloor.draw(m1);
            floorHeight += 2;
        }
        
        // paso 3: dibujar techo del último piso seccion 1
        var curve1 = new ClosedQuadraticBSpline();
        curve1.setControlPoints(this.controlPointsRandom1);
        curve1.setCenterPoint(vec3.fromValues(0,0,0));
        var tile1 = new Tile(curve1);
        var translation = vec3.fromValues(0,floorHeight,0);
        mat4.fromTranslation(m1, translation);
        tile1.draw(m1);

        // paso 4: dibujar pisos seccion 2
        var m2 = mat4.create();

        var translation = vec3.fromValues(0,floorHeight,0);
        mat4.fromTranslation(m2, translation);
        
        for (let i = 0; i < this.numFloorsSecondSection; i++) {
            
            var translation = vec3.fromValues(0,floorHeight,0);
            mat4.fromTranslation(m2, translation);
            mat4.scale(m2, m2, vec3.fromValues(0.75,1.0,0.75));

            this.secondSectionFloor.draw(m2);
            floorHeight += 2.0;
        }
        
        // paso 5: dibujar techo del último piso seccion 2
        var curve2 = new ClosedQuadraticBSpline();
        curve2.setControlPoints(this.controlPointsRandom2);
        curve2.setCenterPoint(vec3.fromValues(0,0,0));
        var translation = vec3.fromValues(0,floorHeight,0);
        mat4.fromTranslation(m2, translation);
        mat4.scale(m2, m2, vec3.fromValues(0.75,1.0,0.75));
        var tile2 = new Tile(curve2);
        tile2.draw(m2);

        // paso 6: dibujar ascensor
        var lifterHeight = 2 + baseHeight + 2.0*(this.numFloorsFirstSection+this.numFloorsSecondSection);
        var lifterWidth = 3;
        var lifter = new Cube(2,2,1,vec4.fromValues(0.5,0.5,0.5,1));
        var mLifter = mat4.create();
        mat4.fromTranslation(mLifter, vec3.fromValues(0, lifterHeight/2,0));
        mat4.scale(mLifter, mLifter, vec3.fromValues(lifterWidth,lifterHeight,lifterWidth));
        lifter.draw(mLifter);
    }
}
