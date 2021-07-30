class Slide {

    constructor(height,width,color,levels){
        
        this.height = height;
        this.width = width;
        this.color = color;
        this.levels = levels;

        this.slide = this.generateSlide(this.height,this.width,this.color,this.levels);
    }

    generateSlide(height,width,color,levels){

        var slide = new Object3D();
        
        for(let i = 0; i < levels; i++){
            
            var newSection = new SlideSection(height,width,color);
            newSection.setTranslation(0,height*i,0);
            slide.addChildren(newSection);
        }
        
        return slide;
    }

    draw(){

        var m = mat4.create();

        mat4.fromTranslation(m, vec3.fromValues(0,0,23));
        
        (this.slide).draw(m);
    }

    setNumLevels(numLevels) {

        if(this.levels == numLevels) {

            return;
        }

        this.levels = numLevels;
        this.slide = this.generateSlide(this.height,this.width,this.color,this.levels);
    }
}

class SlideSection extends Object3D {

    constructor(height,width,color){
        
        super();

        this.height = height;
        this.width = width;
        this.color = color;

        this.sweptSurface = null;
        
        this.initializeObject();

        this.setTranslation(0,2,0);
    }

    getRouteControlPoints(){
        
        var controlPoints = [];
        var height = this.height;
        var width = this.width;
        
        //Loading points (HARDCODED)
        // p2 == v0      p2-p1=v1-v0
        
        // a0
        controlPoints.push(vec3.fromValues(2*width,height-0*height/12,0*width));
        // a1
        controlPoints.push(vec3.fromValues(2*width,height-1*height/12,-1*width));
        // a2 = b0
        controlPoints.push(vec3.fromValues(1*width,height-2*height/12,-1*width));
        // b1
        controlPoints.push(vec3.fromValues(0*width,height-3*height/12,-1*width));
        // b2 = c0
        controlPoints.push(vec3.fromValues(-1*width,height-4*height/12,-1*width));
        // c1
        controlPoints.push(vec3.fromValues(-2*width,height-5*height/12,-1*width));
        // c2 = d0
        controlPoints.push(vec3.fromValues(-2*width,height-6*height/12,0*width));
        // d1
        controlPoints.push(vec3.fromValues(-2*width,height-7*height/12,1*width));
        // d2 = e0
        controlPoints.push(vec3.fromValues(-1*width,height-8*height/12,1*width));
        // e1
        controlPoints.push(vec3.fromValues(0*width,height-9*height/12,1*width));
        // e2 = f0
        controlPoints.push(vec3.fromValues(1*width,height-10*height/12,1*width));
        // f1
        controlPoints.push(vec3.fromValues(2*width,height-11*height/12,1*width));
        // f2
        controlPoints.push(vec3.fromValues(2*width,height-12*height/12,0*width));

        return controlPoints;
    }

    getFormControlPoints(){

        var controlPoints = [];
        var formWidth = this.width/4; 
        
        //Loading points (HARDCODED)
        controlPoints.push(vec3.fromValues(-2*formWidth,0,1*formWidth));
        controlPoints.push(vec3.fromValues(-1*formWidth,0,-2*formWidth));
        controlPoints.push(vec3.fromValues(+1*formWidth,0,-2*formWidth));
        controlPoints.push(vec3.fromValues(+2*formWidth,0,1*formWidth));

        return controlPoints;
    }

    initializeObject(){
    
        var slideForm = new CubicBezier();
        slideForm.loadControlPoints(this.getFormControlPoints());
        var slideDeltaForm = 0.01;

        var slideSweep = new multipleQuadraticBezier();
        slideSweep.loadControlPoints(this.getRouteControlPoints());
        var slideDeltaSweep = 0.01;

        this.sweptSurface = new SlideSurface(slideForm,slideSweep,slideDeltaForm,slideDeltaSweep);
        this.triangleStripMesh = this.sweptSurface.setupBuffers();

        // add 2 poles
        var poleColor = vec4.fromValues(1.0,1.0,1.0,1.0);
        //var poleColor = vec4.fromValues(0.522,0.369,0.259,1.0);
        var pole1 = new Cube(2,2,1,poleColor,vec2.fromValues(10,2),"texturas/WoodenPlanks05_4K_BaseColor_resultado.jpg");
        pole1.setTranslation(0,-2,0);
        pole1.setScale(1,this.height,1);
        pole1.setTranslation(0, 1/2, 0);
        pole1.setTranslation(this.width,0,0);
        this.addChildren(pole1);
        var pole2 = new Cube(2,2,1,poleColor,vec2.fromValues(10,2),"texturas/WoodenPlanks05_4K_BaseColor_resultado.jpg");
        pole2.setTranslation(0,-2,0);
        pole2.setScale(1,this.height,1);
        pole2.setTranslation(0, 1/2, 0);
        pole2.setTranslation(-this.width,0,0);
        this.addChildren(pole2);
    }
}
