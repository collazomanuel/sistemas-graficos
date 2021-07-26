class SlideObject {

    constructor(height,width,Nsections,color){
        
        this.color = color;
        this.sectionHeight = height/Nsections; 
       

        //Load the slide sections into the array
        this.slide = this.generateSlide(this.sectionHeight,Nsections,width,color);

    }

    generateSlide(sectionHeight,Nsections,width,color){

        var slide = new Object3D();
        for(let i = 0; i <= Nsections; i++){
            var newSection = new SlideSection(sectionHeight,width,color);
            newSection.setTranslation(0,sectionHeight*i,0);
            slide.addChildren(newSection);
        }
        return slide;
    }

    draw(){

        var m = mat4.create();

        mat4.fromTranslation(m, vec3.fromValues(20,0,14));
        
        (this.slide).draw(m);
    }
}

//Slide section as 3D object
class SlideSection extends Object3D {

    constructor(height,width,color){
        
        super();

        this.color = color;

        this.height = height;
        this.width = width;
        //Referencia a la superficie de barrido cargada
        this.sweptSurface = null;
        this.initializeObject();
    }

    getRouteControlPoints(){
        var controlPoints = [];
        var height = this.height;
        var width = this.width;
        //Loading points (HARDCODED)

        // p2 == v0      p2-p1=v1-v0

        // p0
        controlPoints.push(vec3.fromValues(2*width,height-0*height/12,0*width));
        // p1
        controlPoints.push(vec3.fromValues(2*width,height-1*height/12,-1*width));
        // p2 = v0
        controlPoints.push(vec3.fromValues(1*width,height-2*height/12,-1*width));
        // v1
        controlPoints.push(vec3.fromValues(0*width,height-3*height/12,-1*width));
        // v2 = p0
        controlPoints.push(vec3.fromValues(-1*width,height-4*height/12,-1*width));
        // p1
        controlPoints.push(vec3.fromValues(-2*width,height-5*height/12,-1*width));
        // p2 = v0
        controlPoints.push(vec3.fromValues(-2*width,height-6*height/12,0*width));
        // v1
        controlPoints.push(vec3.fromValues(-2*width,height-7*height/12,1*width));
        // v2 = p0
        controlPoints.push(vec3.fromValues(-1*width,height-8*height/12,1*width));
        // p1
        controlPoints.push(vec3.fromValues(0*width,height-9*height/12,1*width));
        // p2 = v0
        controlPoints.push(vec3.fromValues(1*width,height-10*height/12,1*width));
        // v1
        controlPoints.push(vec3.fromValues(2*width,height-11*height/12,1*width));
        // v2
        controlPoints.push(vec3.fromValues(2*width,height-12*height/12,0*width));

        return controlPoints;
    }

    getFormControlPoints(){

        var controlPoints = [];
        var formWidth = this.width/4; 
        
        //Loading points (HARDCODED)

        controlPoints.push(vec3.fromValues(-2*formWidth,0,1*formWidth));
        controlPoints.push(vec3.fromValues(-1*formWidth,0,0));
        controlPoints.push(vec3.fromValues(+1*formWidth,0,0));
        controlPoints.push(vec3.fromValues(+2*formWidth,0,1*formWidth));

        return controlPoints;
    }

    initializeObject(){
    
        var slideForm = new CubicBezier();
        var slideSweep = new multipleQuadraticBezier();
        slideForm.loadControlPoints(this.getFormControlPoints());
        slideSweep.loadControlPoints(this.getRouteControlPoints());

        var slideDeltaForm = 0.01;
        var slideDeltaSweep = 0.01;

        this.sweptSurface = new SweptSurface(slideForm,slideSweep,slideDeltaForm,slideDeltaSweep);

        this.triangleStripMesh = this.sweptSurface.setupBuffers();
    }
}
