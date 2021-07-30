function SlideControls(){

    let sliderValue = 5;
        
    document.getElementById( "slide6" ).onchange = function(){
        sliderValue = parseInt(this.value, 10);
    };

    this.update=function(){

        slide.setNumLevels(sliderValue);
    }        
}
