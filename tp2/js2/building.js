
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

        this.controlPoints1 = getControlPoints(this.numWindowsA, this.numWindowsB, this.windowSize);
        this.controlPointsRandom1 = getControlPointsRandom(this.numWindowsA, this.numWindowsB, this.windowSize);

        this.controlPoints2 = getControlPoints(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);
        this.controlPointsRandom2 = getControlPointsRandom(this.numWindowsA-2, this.numWindowsB-2, this.windowSize);

        this.objects = null;

        this.hasChanged = true; // first
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

        this.hasChanged = true;
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
        
        this.hasChanged = true;
    }

    setNumFloorsFirstSection(num) {

        if(num == this.numFloorsFirstSection) {

            return;
        }

        this.numFloorsFirstSection = num;
        this.hasChanged = true;
    }

    setNumFloorsSecondSection(num) {

        if(num == this.numFloorsSecondSection) {

            return;
        }

        this.numFloorsSecondSection = num;
        this.hasChanged = true;
    }

    setNumColumns(num) {

        if(num == this.numColumns) {

            return;
        }

        this.numColumns = num;
        this.hasChanged = true;
    }

    createFirstSectionFloor() {

        var firstSectionFloor = new Object3D();

        var curve = new ClosedQuadraticBSpline();
        curve.setControlPoints(this.controlPointsRandom1);
        curve.setCenterPoint(vec3.fromValues(0,0,0));

        var tile = new Tile(curve, vec2.fromValues(1.0,1.0), "texturas/StoneTilesFloor01_2K_BaseColor_resultado.jpg");

        firstSectionFloor.addChildren(tile);

        var windows = new Object3D();
        var windowColor = vec4.fromValues(0.7,0.7,0.6,1.0);

        for (let i = 0; i < this.numOfControlPoints1; i++) {

            var pane = new Cube(2,2,0.2,vec4.fromValues(0.15,0.15,0.14,1.0));
            pane.setTranslation(this.controlPoints1[i][0], 1, this.controlPoints1[i][2]);
            pane.setScale(1,10,1);
            windows.addChildren(pane);
            
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
            window.setReflective();

            // translation
            window.setTranslation(centerPosition[0], centerPosition[1], centerPosition[2]);

            // rotation
            if(cp1[0] == cp2[0]) {

                zRotation = true;
                xRotation = false;

            } else {

                xRotation = true;
                zRotation = false;
            }

            window.setRotation(xRotation*Math.PI/2, 0, zRotation*Math.PI/2);

            var posX = centerPosition[0];
            var posZ = centerPosition[2];

            if(posX == (this.windowSize * this.numWindowsA / 2)) {

                window.setScale(1,-1,1);

            } else if(posZ == -(this.windowSize * this.numWindowsA / 2)) {

                window.setScale(1,-1,1);
            }

            windows.addChildren(window);
        }

        firstSectionFloor.addChildren(windows);

        // add columns

        var deltaCurve = 1/this.numColumns;
        var deltaNormal = 1.0;
        var columnsPositions = this.getColumnsPositions(curve, deltaCurve, deltaNormal);

        var columns = new Object3D();

        for (let i = 0; i < columnsPositions.length; i++) {

            //var columnColor = vec4.fromValues(0.35,0,0.11,1);
            var columnColor = vec4.fromValues(1.0,1.0,1.0,1.0);
            var column = new Cylinder(10,10,0.2,this.windowSize,columnColor, vec2.fromValues(1.0,1.0), "texturas/ConcreteWall01_2K_BaseColor_resultado.jpg");

            column.setTranslation(columnsPositions[i][0], columnsPositions[i][1], columnsPositions[i][2]);

            column.setTranslation(0,this.windowSize/2,0);

            columns.addChildren(column);
        }

        firstSectionFloor.addChildren(columns);

        return firstSectionFloor;
    }

    createSecondSectionFloor() {

        var secondSectionFloor = new Object3D();

        var curve = new ClosedQuadraticBSpline();
        curve.setControlPoints(this.controlPointsRandom2);
        curve.setCenterPoint(vec3.fromValues(0,0,0));

        var tile = new Tile(curve, vec2.fromValues(1.0,1.0), "texturas/StoneTilesFloor01_2K_BaseColor_resultado.jpg");

        secondSectionFloor.addChildren(tile);

        var windows = new Object3D();
        var windowColor = vec4.fromValues(0.7,0.7,0.6,1.0);

        for (let i = 0; i < this.numOfControlPoints2; i++) {

            var pane = new Cube(2,2,0.2,vec4.fromValues(0.15,0.15,0.14,1.0));
            pane.setTranslation(this.controlPoints2[i][0], 1, this.controlPoints2[i][2]);
            pane.setScale(1,10,1);
            windows.addChildren(pane);
            
            // add each window

            var xRotation = false;
            var zRotation = false;

            var cp1 = this.controlPoints2[i];
            var cp2;
            
            if(i == this.numOfControlPoints2 - 1) {

                cp2 = this.controlPoints2[0];

            } else {

                cp2 = this.controlPoints2[i+1];
            }

            var centerPosition = vec3.create();
            vec3.add(centerPosition, cp1, cp2);
            vec3.scale(centerPosition, centerPosition, 1/2);
            vec3.add(centerPosition, centerPosition, vec3.fromValues(0,this.windowSize/2,0));

            var window = new Square(2,2,this.windowSize,windowColor);
            window.setReflective();

            // translation
            window.setTranslation(centerPosition[0], centerPosition[1], centerPosition[2]);

            // rotation
            if(cp1[0] == cp2[0]) {

                zRotation = true;
                xRotation = false;

            } else {

                xRotation = true;
                zRotation = false;
            }

            window.setRotation(xRotation*Math.PI/2, 0, zRotation*Math.PI/2);

            var posX = centerPosition[0];
            var posZ = centerPosition[2];

            if(posX == (this.windowSize * (this.numWindowsA-2) / 2)) {

                window.setScale(1,-1,1);

            } else if(posZ == -(this.windowSize * (this.numWindowsA-2) / 2)) {

                window.setScale(1,-1,1);
            }

            windows.addChildren(window);
        }

        secondSectionFloor.addChildren(windows);

        // add columns

        var deltaCurve = 1/this.numColumns;
        var deltaNormal = 1.0;
        var columnsPositions = this.getColumnsPositions(curve, deltaCurve, deltaNormal);

        var columns = new Object3D();

        for (let i = 0; i < columnsPositions.length; i++) {

            //var columnColor = vec4.fromValues(0.35,0,0.11,1);
            var columnColor = vec4.fromValues(1.0,1.0,1.0,1.0);
            var column = new Cylinder(10,10,0.2,this.windowSize,columnColor, vec2.fromValues(1.0,1.0), "texturas/ConcreteWall01_2K_BaseColor_resultado.jpg");

            column.setTranslation(columnsPositions[i][0], columnsPositions[i][1], columnsPositions[i][2]);

            column.setTranslation(0,this.windowSize/2,0);

            columns.addChildren(column);
        }

        secondSectionFloor.addChildren(columns);

        return secondSectionFloor;
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
            
            vec3.scale(normal, curveNormal, -deltaNormal);
            vec3.add(position, curvePosition, normal);
            columnsPositions.push(position);
        }

        return columnsPositions;
    }

    draw() {

        if(!(this.hasChanged)) {

            this.objects.draw();
            return;
        }

        this.objects = new Object3D();

        // 1°) dibujar base
        // 2°) dibujar pisos seccion 1
        // 3°) dibujar techo del último piso seccion 1
        // 4°) dibujar pisos seccion 2
        // 5°) dibujar techo del último piso seccion 2
        // 6°) dibujar ascensor

        // paso 1: dibujar base

        var baseHeight = 3;
        var baseWidthA = this.numWindowsA/2;
        var baseWidthB = this.numWindowsB/2;

        var base = new Cube(2,2,baseHeight,vec4.fromValues(0.5,0.5,0.5,1));
        base.setTranslation(0,baseHeight/2,0);
        base.setScale(baseWidthA,1.0,baseWidthB);
        this.objects.addChildren(base);
        base.draw();

        var floorHeight = baseHeight;

        // paso 2: dibujar pisos seccion 1

        for (let i = 0; i < this.numFloorsFirstSection; i++) {
            
            var newFirstSectionFloor = this.createFirstSectionFloor();
            newFirstSectionFloor.setTranslation(0,floorHeight,0);
            this.objects.addChildren(newFirstSectionFloor);
            newFirstSectionFloor.draw();
            floorHeight += 2;
        }
        
        // paso 3: dibujar techo del último piso seccion 1
        var curve1 = new ClosedQuadraticBSpline();
        curve1.setControlPoints(this.controlPointsRandom1);
        curve1.setCenterPoint(vec3.fromValues(0,0,0));

        var tile1 = new Tile(curve1, vec2.fromValues(1.0,1.0), "texturas/StoneTilesFloor01_2K_BaseColor_resultado.jpg");
        tile1.setTranslation(0,floorHeight,0);
        tile1.setScale(1.0,1.20,1.0); // make it 20% wider
        this.objects.addChildren(tile1);
        tile1.draw();

        // paso 4: dibujar pisos seccion 2
        
        for (let i = 0; i < this.numFloorsSecondSection; i++) {
            
            var newSecondSectionFloor = this.createSecondSectionFloor();
            newSecondSectionFloor.setTranslation(0,floorHeight,0);
            this.objects.addChildren(newSecondSectionFloor);
            newSecondSectionFloor.draw();
            floorHeight += 2;
        }
        
        // paso 5: dibujar techo del último piso seccion 2
        var curve2 = new ClosedQuadraticBSpline();
        curve2.setControlPoints(this.controlPointsRandom2);
        curve2.setCenterPoint(vec3.fromValues(0,0,0));

        var tile2 = new Tile(curve2, vec2.fromValues(1.0,1.0), "texturas/StoneTilesFloor01_2K_BaseColor_resultado.jpg");
        
        tile2.setTranslation(0,floorHeight,0);
        //tile2.setScale(0.75,1.0,0.75);
        
        this.objects.addChildren(tile2);
        tile2.draw();

        // paso 6: dibujar ascensor
        var lifterHeight = 2 + baseHeight + 2.0*(this.numFloorsFirstSection+this.numFloorsSecondSection);
        var lifterWidth = 3;
        var lifter = new Cube(2,2,1,vec4.fromValues(1.0,0.9882,0.9412,1));
        lifter.setTranslation(0, lifterHeight/2,0);
        lifter.setScale(lifterWidth,lifterHeight,lifterWidth)
        this.objects.addChildren(lifter);
        lifter.draw();

        this.hasChanged = false;
    }
}
