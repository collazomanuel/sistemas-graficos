
class Slide {

    constructor(position = [-30,0,-20]) {

        this.position = position;
        
        this.controlPoints = [];
        this.numWindowsA = 12; // integer > 3
        this.numWindowsB = 6; // integer > 3

        this.numOfControlPoints = 2*this.numWindowsA + 2*this.numWindowsB;

        this.numFloorsFirstSection = 6 // integer > 1;
        this.numFloorsSecondSection = 4 // integer > 1;

        this.numPerimetralColumns = 20; // integer > 3

        this.windowSize = 1;

        this.perimeterPointsFirstSection;

        this.setControlPoints();
    }

    setControlPoints() {

        var randomDelta; // between -0.5 and 1
        
        for (let a = -this.numWindowsA/2; a < this.numWindowsA/2; a++) {
            
            var point = vec2.fromValues(a*this.windowSize,this.numWindowsB*this.windowSize/2);
            
            // not modifying the rectangle vertices
            if(a != -this.numWindowsA/2) {

                randomDelta = getRandomDouble(-0.5,1);
                vec2.add(point, point, vec2.fromValues(0,randomDelta * this.windowSize));
            }

            vec2.add(point, point, vec2.fromValues(this.position[0],this.position[2]));

            this.controlPoints.push(point);
        }


        for (let b = this.numWindowsB/2; b > -this.numWindowsB/2; b--) {
            
            var point = vec2.fromValues(this.numWindowsA*this.windowSize/2,b*this.windowSize);
            
            // not modifying the rectangle vertices
            if(b != this.numWindowsB/2) {

                randomDelta = getRandomDouble(-0.5,1);
                vec2.add(point, point, vec2.fromValues(randomDelta * this.windowSize,0));
            }   

            vec2.add(point, point, vec2.fromValues(this.position[0],this.position[2]));
            
            this.controlPoints.push(point);

        }

        for (let a = this.numWindowsA/2; a > -this.numWindowsA/2; a--) {
            
            var point = vec2.fromValues(a*this.windowSize,-this.numWindowsB*this.windowSize/2);
            
            // not modifying the rectangle vertices
            if(a != this.numWindowsA/2) {

                randomDelta = getRandomDouble(-0.5,1);
                vec2.add(point, point, vec2.fromValues(0,randomDelta * this.windowSize));
            }

            vec2.add(point, point, vec2.fromValues(this.position[0],this.position[2]));

            this.controlPoints.push(point);
        }

        for (let b = -this.numWindowsB/2; b < this.numWindowsB/2; b++) {
            
            var point = vec2.fromValues(-this.numWindowsA*this.windowSize/2,b*this.windowSize);
            
            // not modifying the rectangle vertices
            if(b != -this.numWindowsB/2) {

                randomDelta = getRandomDouble(-0.5,1);
                vec2.add(point, point, vec2.fromValues(randomDelta * this.windowSize,0));
            }

            vec2.add(point, point, vec2.fromValues(this.position[0],this.position[2]));
            
            this.controlPoints.push(point);
        }
    }

    setPerimeterPointsFirstSection(d) {

        this.perimeterPointsFirstSection = [];

        var curve = new ClosedQuadraticBSpline();
        curve.setControlPoints(this.controlPoints);

        var discretization = discretizeCurve(curve, d);

        for (var i = 0; i < discretization.length; i++) {

            (this.perimeterPointsFirstSection)[i] = [(discretization[i])[0],0,(discretization[i])[1]];
        }



    }

    getControlPoints() {

        return this.controlPoints;
    }    

    draw() {

        // test for control points, placing cylinders

        /*

        var cylinders = [];

        for (var i = 0; i < this.controlPoints.length; i++) {
            
            cylinders[i] = (new Cylinder(5, 10, 0.2, 2, vec4.fromValues(0.5,1.0,0.05,1.0)));

            (cylinders[cylinders.length - 1]).setTranslation((this.controlPoints)[i][0],0,(this.controlPoints)[i][1]);
        }

        for (var i = 0; i < cylinders.length; i++) {
            (cylinders[i]).draw(mat4.create());
        }

        */

        var cylinders = [];

        for (var i = 0; i < this.perimeterPointsFirstSection.length; i++) {
            
            cylinders[i] = (new Cylinder(5, 10, 0.2, 2, vec4.fromValues(0.5,1.0,0.05,1.0)));

            (cylinders[i]).setTranslation((this.perimeterPointsFirstSection)[i][0],(this.perimeterPointsFirstSection)[i][1],(this.perimeterPointsFirstSection)[i][2]);
        }

        for (var i = 0; i < cylinders.length; i++) {
            (cylinders[i]).draw(mat4.create());
        }
    }
}
