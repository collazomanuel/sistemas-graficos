class Sweep {

	constructor() {

		this.controlPoints = [];
	}

	getPositionVectorAt(u) {

	}

	getTangentVectorAt(u) {

	}
	
	getNormalVectorAt(u) {

	}

	getBinormalVectorAt(u) {

	}
}

class StraightLine extends Sweep {

	constructor() {

		super(); // p0, p1
	}

	setControlPoints(p0, p1) {

		this.controlPoints = [];

		this.controlPoints.push(p0);
		this.controlPoints.push(p1);
	}

	getNumControlPoints() {

		return (this.controlPoints).length;
	}

	getB0(u) {

		return 1-u;
	}

	getB1(u) {

		return u;
	}

	getDB0(u) {

		return -1;
	}

	getDB1(u) {

		return 1;
	}

	getDDB0(u) {

		return 0;
	}

	getDDB1(u) {

		return 0;
	}

	getPositionVectorAt(u) {

		// u between 0 and 1

		var b0 = this.getB0(u);
		var b1 = this.getB1(u);

		var p0, p1 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);

		var point = vec3.create();

		vec3.add(point, p0, p1);

		return point; // vec3
	}

	getTangentVectorAt(u) {

		// u between 0 and 1

		var db0 = this.getDB0(u);
		var db1 = this.getDB1(u);

		var p0, p1 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);

		var tangentVector = vec3.create();

		vec3.add(tangentVector, p0, p1);
		vec3.normalize(tangentVector, tangentVector);

		//return tangentVector; // vec3

		// HARDCODEO

		return vec3.fromValues(0,1,0);
	}

	getNormalVectorAt(u) {

		var tangentVector = this.getTangentVectorAt(u);
		var binormalVector = this.getBinormalVectorAt(u);
		var normalVector = vec3.create();

		vec3.cross(normalVector, tangentVector, binormalVector);

		vec3.normalize(normalVector, normalVector);

		//return normalVector;

		// HARDCODEO

		return vec3.fromValues(1,0,0);
	}

	getSecondDerivativeVectorAt(u) {

		// u between 0 and 1

		var ddb0 = this.getDDB0(u);
		var ddb1 = this.getDDB1(u);

		var p0, p1 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);

		var secondDerivativeVector = vec3.create();

		vec3.add(secondDerivativeVector, p0, p1);

		vec3.normalize(secondDerivativeVector, secondDerivativeVector);

		return secondDerivativeVector; // vec3
	}

	getBinormalVectorAt(u) {

		var tangentVector = this.getTangentVectorAt(u);

		var binormalVector = vec3.create();

		var secondDerivativeVector = this.getSecondDerivativeVectorAt(u);

		vec3.cross(binormalVector, secondDerivativeVector, tangentVector);
		vec3.normalize(binormalVector, binormalVector);

		// HARDCODEO

		return vec3.fromValues(0,0,1);

		// return binormalVector;
	}
}

class QuadraticBezier extends Sweep {

	constructor() {

		super(); // p0, p1, p2
	}

	setControlPoints(p0, p1, p2) {

		this.controlPoints = [];

		this.controlPoints.push(p0);
		this.controlPoints.push(p1);
		this.controlPoints.push(p2);
	}

	getNumControlPoints() {

		return (this.controlPoints).length;
	}

	getB0(u) {

		return (1-u)*(1-u);
	}

	getB1(u) {

		return 2*(1-u)*u;
	}

	getB2(u) {

		return u*u;
	}

	getDB0(u) {

		return -2*(1-u);
	}

	getDB1(u) {

		return 2*(1-2*u);
	}

	getDB2(u) {

		return 2*u;
	}

	getDDB0(u) {

		return 2;
	}

	getDDB1(u) {
		
		return -4;
	}

	getDDB2(u) {

		return 2;		
	}

	getPositionVectorAt(u) {

		// u between 0 and 1

		var b0 = this.getB0(u);
		var b1 = this.getB1(u);
		var b2 = this.getB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);
		vec3.scale(p2, p2, b2);

		var point = vec3.create();

		vec3.add(point, p0, p1);
		vec3.add(point, point, p2);

		return point; // vec3
	}

	getTangentVectorAt(u) {

		// u between 0 and 1

		var db0 = this.getDB0(u);
		var db1 = this.getDB1(u);
		var db2 = this.getDB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);
		vec3.scale(p2, p2, db2);

		var vector = vec3.create();

		vec3.add(vector, p0, p1);
		vec3.add(vector, vector, p2);

		vec3.normalize(vector, vector);

		return vector; // vec3
	}

	getNormalVectorAt(u) {

		var secondDerivativeVector = this.getSecondDerivativeVectorAt(u);

		return secondDerivativeVector;
	}

	getSecondDerivativeVectorAt(u) {

		// u between 0 and 1

		var ddb0 = this.getDDB0(u);
		var ddb1 = this.getDDB1(u);
		var ddb2 = this.getDDB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);
		vec3.scale(p2, p2, ddb2);

		var secondDerivativeVector = vec3.create();

		vec3.add(secondDerivativeVector, p0, p1);
		vec3.add(secondDerivativeVector, secondDerivativeVector, p2);

		vec3.normalize(secondDerivativeVector, secondDerivativeVector);

		return secondDerivativeVector; // vec3
	}

	getBinormalVectorAt(u) {

		var tangentVector = this.getTangentVectorAt(u);
		var normalVector = this.getNormalVectorAt(u);
		var binormalVector = vec3.create();

		vec3.cross(binormalVector, normalVector, tangentVector);
		vec3.normalize(binormalVector, binormalVector);

		return binormalVector;
	}
}

class CubicBezier extends Sweep {

	constructor() {

		super(); // po, p1, p2, p3
	}

	setControlPoints(p0, p1, p2, p3) {

		this.controlPoints = [];

		this.controlPoints.push(p0);
		this.controlPoints.push(p1);
		this.controlPoints.push(p2);
		this.controlPoints.push(p3);
	}

	loadControlPoints(points){
		
		// points has 4 vectors
		this.controlPoints = points;
	}

	getNumControlPoints() {

		return (this.controlPoints).length;
	}

	getB0(u) {

		return (1-u)*(1-u)*(1-u);
	}

	getB1(u) {

		return 3*(1-u)*(1-u)*u;
	}

	getB2(u) {

		return 3*(1-u)*u*u;
	}

	getB3(u) {

		return u*u*u;
	}

	getDB0(u) {

		return -3*(1-u)*(1-u);
	}

	getDB1(u) {

		return 3*(3*u*u-4*u+1);
	}

	getDB2(u) {

		return 3*(-3*u*u+2*u);
	}

	getDB3(u) {

		return 3*u*u;
	}

	getDDB0(u) {

		return 6*(1-u);
	}

	getDDB1(u) {
		
		return 3*(6*u-4);
	}

	getDDB2(u) {

		return 3*(-6*u+2);		
	}

	getDDB3(u) {

		return 6*u;		
	}

	getPositionVectorAt(u) {

		// u between 0 and 1

		var b0 = this.getB0(u);
		var b1 = this.getB1(u);
		var b2 = this.getB2(u);
		var b3 = this.getB3(u);

		var p0, p1, p2, p3 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);
		p3 = vec3.clone((this.controlPoints)[3]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);
		vec3.scale(p2, p2, b2);
		vec3.scale(p3, p3, b3);

		var point = vec3.create();

		vec3.add(point, p0, p1);
		vec3.add(point, point, p2);
		vec3.add(point, point, p3);

		return point; // vec3
	}

	getTangentVectorAt(u) {

		// u between 0 and 1

		var db0 = this.getDB0(u);
		var db1 = this.getDB1(u);
		var db2 = this.getDB2(u);
		var db3 = this.getDB3(u);

		var p0, p1, p2, p3 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);
		p3 = vec3.clone((this.controlPoints)[3]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);
		vec3.scale(p2, p2, db2);
		vec3.scale(p3, p3, db3);

		var vector = vec3.create();

		vec3.add(vector, p0, p1);
		vec3.add(vector, vector, p2);
		vec3.add(vector, vector, p3);

		vec3.normalize(vector, vector);

		return vector; // vec3
	}

	getNormalVectorAt(u) {

		var tangentVector = this.getTangentVectorAt(u);
		var binormalVector = this.getBinormalVectorAt(u);

		var normalVector = vec3.create();

		vec3.cross(normalVector, tangentVector, binormalVector);
		vec3.normalize(normalVector, normalVector);

		return normalVector;
	}

	getSecondDerivativeVectorAt(u) {

		// u between 0 and 1

		var ddb0 = this.getDDB0(u);
		var ddb1 = this.getDDB1(u);
		var ddb2 = this.getDDB2(u);
		var ddb3 = this.getDDB3(u);

		var p0, p1, p2, p3 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);
		p3 = vec3.clone((this.controlPoints)[3]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);
		vec3.scale(p2, p2, ddb2);
		vec3.scale(p3, p3, ddb3);

		var secondDerivativeVector = vec3.create();

		vec3.add(secondDerivativeVector, p0, p1);
		vec3.add(secondDerivativeVector, secondDerivativeVector, p2);
		vec3.add(secondDerivativeVector, secondDerivativeVector, p3);

		vec3.normalize(secondDerivativeVector, secondDerivativeVector);

		return secondDerivativeVector; // vec3
	}	

	getBinormalVectorAt(u) {

		var tangentVector = this.getTangentVectorAt(u);

		var binormalVector = vec3.create();

		var secondDerivativeVector = this.getSecondDerivativeVectorAt(u);

		vec3.cross(binormalVector, secondDerivativeVector, tangentVector);
		vec3.normalize(binormalVector, binormalVector);

		return binormalVector;
	}
}

class QuadraticBSpline extends Sweep {

	constructor() {

		super(); // po, p1, p2
	}

	setControlPoints(p0, p1, p2) {

		this.controlPoints = [];
		
		this.controlPoints.push(p0);
		this.controlPoints.push(p1);
		this.controlPoints.push(p2);
	}

	getNumControlPoints() {

		return (this.controlPoints).length;
	}

	getB0(u) {

		return (1/2)*(1-u)*(1-u);
	}

	getB1(u) {

		return (1/2)+(1-u)*u;
	}

	getB2(u) {

		return u*u/2;
	}

	getDB0(u) {

		return u-1;
	}

	getDB1(u) {

		return 1-2*u;
	}

	getDB2(u) {

		return u;
	}

	getDDB0(u) {

		return 1;		
	}

	getDDB1(u) {

		return -2;		
	}

	getDDB2(u) {

		return 1;		
	}

	getPositionVectorAt(u) {

		// u between 0 and 1

		var b0 = this.getB0(u);
		var b1 = this.getB1(u);
		var b2 = this.getB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);
		vec3.scale(p2, p2, b2);

		var point = vec3.create();

		vec3.add(point, p0, p1);
		vec3.add(point, point, p2);

		return point; // vec3
	}

	getTangentVectorAt(u) {

		// u between 0 and 1

		var db0 = this.getDB0(u);
		var db1 = this.getDB1(u);
		var db2 = this.getDB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);
		vec3.scale(p2, p2, db2);

		var vector = vec3.create();

		vec3.add(vector, p0, p1);
		vec3.add(vector, vector, p2);

		vec3.normalize(vector, vector);

		return vector; // vec3
	}

	getNormalVectorAt(u) {

		var tangentVector = this.getTangentVectorAt(u);
		var binormalVector = this.getBinormalVectorAt(u);

		var normalVector = vec3.create();

		vec3.cross(normalVector, tangentVector, binormalVector);
		vec3.normalize(normalVector, normalVector);

		return normalVector;
	}

	getSecondDerivativeVectorAt(u) {

		// u between 0 and 1

		var ddb0 = this.getDDB0(u);
		var ddb1 = this.getDDB1(u);
		var ddb2 = this.getDDB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.controlPoints)[0]);
		p1 = vec3.clone((this.controlPoints)[1]);
		p2 = vec3.clone((this.controlPoints)[2]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);
		vec3.scale(p2, p2, ddb2);

		var secondDerivativeVector = vec3.create();

		vec3.add(secondDerivativeVector, p0, p1);
		vec3.add(secondDerivativeVector, secondDerivativeVector, p2);

		vec3.normalize(secondDerivativeVector, secondDerivativeVector);

		return secondDerivativeVector; // vec3
	}

	getBinormalVectorAt(u) {
		
		var tangentVector = this.getTangentVectorAt(u);

		var binormalVector = vec3.fromValues(u);

		var secondDerivativeVector = this.getSecondDerivativeVectorAt(u);

		vec3.cross(binormalVector, secondDerivativeVector, tangentVector);
		vec3.normalize(binormalVector, binormalVector);

		// HARDCODEO
		return vec3.fromValues(0,-1,0);

		//return binormalVector;
	}
}



class multipleQuadraticBezier extends Sweep {

	constructor(){
		super();
		this.curves = [];
	}

	loadControlPoints(points){
		
		this.controlPoints = points;
		this.initializeCurve();
	}

	initializeCurve(){
		//Create all bezier curves of the route
		var cps = this.controlPoints;
		for(let i = 0; i < cps.length-1;i+=2){
			var newCurve = new QuadraticBezier();
			newCurve.setControlPoints(cps[i],cps[i+1],cps[i+2]);
			this.curves.push(newCurve);		
		}


	}

	getPositionVectorAt(u){
		// 6 Curvas -> t = [0,6]		
		var t = u*this.curves.length; //Si, por ejemplo, u = 0.2, t = 1.2
		var curveNum = (t-(t%1)); // curva 1

		if(curveNum == 6) {

			curveNum = 5;
		}
		
		return this.curves[curveNum].getPositionVectorAt(t%1);//Punto en 0.2 de la curva 1 
	}

	getTangentVectorAt(u){
		var t = u*this.curves.length; 
		var curveNum = (t-(t%1)); 

		if(curveNum == 6) {

			curveNum = 5;
		}

		return this.curves[curveNum].getTangentVectorAt(t%1);
	}

	getNormalVectorAt(u){
		var t = u*this.curves.length; 
		var curveNum = (t-(t%1)); 

		if(curveNum == 6) {

			curveNum = 5;
		}

		return this.curves[curveNum].getBinormalVectorAt(t%1);
	}
	
	getBinormalVectorAt(u){
		var t = u*this.curves.length; 
		var curveNum = (t-(t%1)); 

		if(curveNum == 6) {

			curveNum = 5;
		}

		return this.curves[curveNum].getNormalVectorAt(t%1);
	}



}



class ClosedQuadraticBSpline extends Sweep {

	constructor() {

		super();
		this.centerPoint;
	}

	setCenterPoint(centerPoint) {

		this.centerPoint = centerPoint;
	}
	
	getCenterPoint() {

		return this.centerPoint;
	}

	setControlPoints(points) {

		this.controlPoints = [];

		for (var i = 0; i < points.length; i++) {
		  this.controlPoints.push(points[i]);
		}
	}

	getControlPoints() {

		return this.controlPoints;
	}

	getNumControlPoints() {

		return this.controlPoints.length;
	}

	getPositionVectorAt(u) {
		
		// u between 0 and 1

		u*=(this.controlPoints).length;

		// use all control points in order and then add p0 and p1

		// curva 0, curva 1, curva 2, etc
		var curveNum = (u-(u%1));

		if(curveNum > (this.controlPoints).length) {

			console.log("Incorrent input");
			return;
		}

		// add redundant points to calculate the last 2 curves
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[0])[0], (this.controlPoints[0])[1], (this.controlPoints[0])[2]));
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[1])[0], (this.controlPoints[1])[1], (this.controlPoints[1])[2]));

		var p0 = vec3.fromValues(((this.controlPoints)[curveNum])[0],((this.controlPoints)[curveNum])[1], ((this.controlPoints)[curveNum])[2]);
		var p1 = vec3.fromValues(((this.controlPoints)[curveNum+1])[0],((this.controlPoints)[curveNum+1])[1], ((this.controlPoints)[curveNum+1])[2]);
		var p2 = vec3.fromValues(((this.controlPoints)[curveNum+2])[0],((this.controlPoints)[curveNum+2])[1], ((this.controlPoints)[curveNum+2])[2]);

		var quadraticBSpline = new QuadraticBSpline();
		quadraticBSpline.setControlPoints(p0, p1, p2);
		var positionVector = quadraticBSpline.getPositionVectorAt(u % 1);

		// remove redundant points used in calculation
		(this.controlPoints).pop();
		(this.controlPoints).pop();

		return positionVector;
	}

	getTangentVectorAt(u) {

		// u between 0 and 1

		u*=(this.controlPoints).length;

		// use all control points in order and then add p0 and p1

		var curveNum = (u-(u%1));

		if(curveNum > (this.controlPoints).length) {

			console.log("Incorrent input");
			return;
		}

		// add redundant points to calculate the last 2 curves
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[0])[0], (this.controlPoints[0])[1], (this.controlPoints[0])[2]));
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[1])[0], (this.controlPoints[1])[1], (this.controlPoints[1])[2]));

		var p0 = vec3.fromValues(((this.controlPoints)[curveNum])[0],((this.controlPoints)[curveNum])[1], ((this.controlPoints)[curveNum])[2]);
		var p1 = vec3.fromValues(((this.controlPoints)[curveNum+1])[0],((this.controlPoints)[curveNum+1])[1], ((this.controlPoints)[curveNum+1])[2]);
		var p2 = vec3.fromValues(((this.controlPoints)[curveNum+2])[0],((this.controlPoints)[curveNum+2])[1], ((this.controlPoints)[curveNum+2])[2]);

		var quadraticBSpline = new QuadraticBSpline();
		quadraticBSpline.setControlPoints(p0, p1, p2);
		var tangentVector = quadraticBSpline.getTangentVectorAt(u % 1);

		// remove redundant points used in calculation
		(this.controlPoints).pop();
		(this.controlPoints).pop();

		return tangentVector;
	}

	getNormalVectorAt(u) {

		// u between 0 and 1

		u*=(this.controlPoints).length; // now u between 0 - ...

		// use all control points in order and then add p0 and p1

		var curveNum = (u-(u%1));

		if(curveNum > (this.controlPoints).length) {

			console.log("Incorrent input");
			return;
		}

		// add redundant points to calculate the last 2 curves
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[0])[0], (this.controlPoints[0])[1], (this.controlPoints[0])[2]));
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[1])[0], (this.controlPoints[1])[1], (this.controlPoints[1])[2]));

		var p0 = vec3.fromValues(((this.controlPoints)[curveNum])[0],((this.controlPoints)[curveNum])[1], ((this.controlPoints)[curveNum])[2]);
		var p1 = vec3.fromValues(((this.controlPoints)[curveNum+1])[0],((this.controlPoints)[curveNum+1])[1], ((this.controlPoints)[curveNum+1])[2]);
		var p2 = vec3.fromValues(((this.controlPoints)[curveNum+2])[0],((this.controlPoints)[curveNum+2])[1], ((this.controlPoints)[curveNum+2])[2]);

		var quadraticBSpline = new QuadraticBSpline();
		quadraticBSpline.setControlPoints(p0, p1, p2);
		var normalVector = quadraticBSpline.getNormalVectorAt(u % 1);

		// remove redundant points used in calculation
		(this.controlPoints).pop();
		(this.controlPoints).pop();

		return normalVector;
	}

	getBinormalVectorAt(u) {

		// u between 0 and 1

		u*=(this.controlPoints).length;

		// use all control points in order and then add p0 and p1

		var curveNum = (u-(u%1));

		if(curveNum > (this.controlPoints).length) {

			console.log("Incorrent input");
			return;
		}

		// add redundant points to calculate the last 2 curves
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[0])[0], (this.controlPoints[0])[1], (this.controlPoints[0])[2]));
		(this.controlPoints).push(vec3.fromValues((this.controlPoints[1])[0], (this.controlPoints[1])[1], (this.controlPoints[1])[2]));

		var p0 = vec3.fromValues(((this.controlPoints)[curveNum])[0],((this.controlPoints)[curveNum])[1], ((this.controlPoints)[curveNum])[2]);
		var p1 = vec3.fromValues(((this.controlPoints)[curveNum+1])[0],((this.controlPoints)[curveNum+1])[1], ((this.controlPoints)[curveNum+1])[2]);
		var p2 = vec3.fromValues(((this.controlPoints)[curveNum+2])[0],((this.controlPoints)[curveNum+2])[1], ((this.controlPoints)[curveNum+2])[2]);

		var quadraticBSpline = new QuadraticBSpline();


		quadraticBSpline.setControlPoints(p0, p1, p2);
		var binormalVector = quadraticBSpline.getBinormalVectorAt(u % 1);

		// remove redundant points used in calculation
		(this.controlPoints).pop();
		(this.controlPoints).pop();

		return binormalVector;
	}
}

function discretizeCurve(curve, d) {

	// d is the discretization

	var positions = [];
	var tangents = [];
	var binormals = [];
	var normals = [];

	var position = vec3.create();
	var tangent = vec3.create();
	var binormal = vec3.create();
	var normal = vec3.create();

	for (var i = 0; i <= 1; i+=d) {
		
		position = curve.getPositionVectorAt(i);
		tangent = curve.getTangentVectorAt(i);
		binormal = curve.getBinormalVectorAt(i);
		normal = curve.getNormalVectorAt(i);

		positions.push(position);
		tangents.push(tangent);
		binormals.push(binormal);
		normals.push(normal);
	}

	return {
		
		positions: positions,
		tangents: tangents,
		binormals: binormals,
		normals: normals
	};
}
