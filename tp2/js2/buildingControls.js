function BuildingControls(){

    let slider1Value = 8;
    let slider2Value = 8;
    let slider3Value = 5;
    let slider4Value = 5;
    let slider5Value = 10;
        
    document.getElementById( "slide1" ).onchange = function(){
        slider1Value = parseInt(this.value, 10);
    };

    document.getElementById( "slide2" ).onchange = function(){
        slider2Value = parseInt(this.value, 10);
    };

    document.getElementById( "slide3" ).onchange = function(){
        slider3Value = parseInt(this.value, 10);
    };

    document.getElementById( "slide4" ).onchange = function(){
        slider4Value = parseInt(this.value, 10);
    };

    document.getElementById( "slide5" ).onchange = function(){
        slider5Value = parseInt(this.value, 10);
    };

    this.update=function(){

        building.setNumWindowsA(slider1Value);
        building.setNumWindowsB(slider2Value);
        building.setNumFloorsFirstSection(slider3Value);
        building.setNumFloorsSecondSection(slider4Value);
        building.setNumColumns(slider5Value);
    }        
}
