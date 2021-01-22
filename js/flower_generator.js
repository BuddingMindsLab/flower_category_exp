// taken from https://github.com/macklab/macklab.github.io/blob/master/flowers/js/flower_generator.js

/* paper.view.viewSize.width = 400;
paper.view.viewSize.height = 400; */
paper.view.autoUpdate = true;

//context = canvas.getContext('2d');
//window.globals = {};
//var scope = this;
globals.center = [paper.view.viewSize.width/2, paper.view.viewSize.height/2];

function drawFlower1(petalColor,petalShape,circleShape) {

    //scope.activate();
    project.activeLayer.removeChildren();

    var xoff = globals.center[0];
    var yoff = globals.center[1];
    var width = xoff*2;
    var height = yoff*2;

    ringShape = 4.5;
    circleColor = 4.5;
    petal_shape_max = 19;
    color_max = 360;

    // calculate color (lab -> rgb space). Shift according to exp type center value
    petalColor = parseInt(petalColor);
    if (petalColor != -1) {
        switch(globals.exp) {
            case "A":
              petalColor -= 15;
              break;
            case "B":
              petalColor += 75;
              break;
            case "C":
              petalColor += 165;
              break;
            case "D":
              petalColor += 255;
              break;
            default:
              break;
        }                  
        if (petalColor <= 0) {
            petalColor  += 360;
        } else if (petalColor  > 360) {
            petalColor  -= 360;
        }
    }
    var rgb_color = xyzToRgb(labToXyz(angle2Lab(petalColor)));

    // gray square
    new Path.Rectangle({
        center: [xoff,yoff],
        size: [width, height],
        fillColor: new Color(0.8, 0.8, 0.8,1),
    });

    pcolor = petalColor;
    petalRatio = petalShape/petal_shape_max;
    npetals = Math.round(3+petalRatio*petal_shape_max);

    // larger petals
    // petal size (according to window)
    petalSize1 = [width*0.45, width*(0.31-0.23*petalRatio)];
    petalLength1 = width*0.25;

    //petalSize1 = [100,62-46*petalRatio]; 
    for (var x=0;x<npetals;x++){
        var ang = x*(360/npetals)+30+(6*0.1-3);
        var cx = xoff+petalLength1*Math.cos(ang*Math.PI/180);
        var cy = yoff+petalLength1*Math.sin(ang*Math.PI/180);
        var petal = new Path.Ellipse({
            center: [cx,cy],
            size: petalSize1,
            fillColor: 'red',
            rotation: ang,
            shadowColor: new Color(0.9,0.9,0.9),
            shadowBlur: 8,
            shadowOffset: new Point(0, 0)
        });
        if (pcolor == -1){
            petal.fillColor.saturation = 0;
            petal.fillColor.brightness = 10;
        } else {
            petal.fillColor.red = rgb_color[0];
            petal.fillColor.green = rgb_color[1];
            petal.fillColor.blue = rgb_color[2];
        }
        new Path.Ellipse({
            center: [cx,cy],
            size: [petalSize1[0]*0.80,3],
            fillColor: new Color(1,1,1,0.3),
            rotation: ang,
        });
    }

    // smaller petals
    //petalSize2 = [width*0.375, width*0.062+width*0.018*petalShape];
    var petalRatio2 = (petal_shape_max+1-petalShape)/petal_shape_max;
    petalSize2 = [width*0.35, width*(0.28-0.23*petalRatio2)];
    petalLength2 = width*0.25;

    //nspetals = Math.round(5+petal_shape_max-petalShape);
    var nspetals = Math.round(3+petalRatio2*petal_shape_max);
    for (var x=0;x<nspetals;x++){
        var ang = x*(360/nspetals)+30+(6*1-3);
        var cx = xoff+petalLength2*Math.cos(ang*Math.PI/180);
        var cy = yoff+petalLength2*Math.sin(ang*Math.PI/180);
        var petal = new Path.Ellipse({
            center: [cx,cy],
            size: petalSize2,
            fillColor: 'red',
            rotation: ang,
            shadowColor: new Color(0.1,0.1,0.1),
            shadowBlur: 8,
            shadowOffset: new Point(0, 0)
        });
        if (pcolor == -1){
            petal.fillColor.saturation = 0;
            petal.fillColor.brightness = 50;
        } else {
            petal.fillColor.red = rgb_color[0];
            petal.fillColor.green = rgb_color[1];
            petal.fillColor.blue = rgb_color[2];
        }
        new Path.Ellipse({
            center: [cx,cy],
            size: [petalSize2[0]*0.80,2],
            fillColor: new Color(1,1,1,0.3),
            rotation: ang,
        });
    }

    // inner ring
    var ringRatio = ringShape/9;
    var nring = Math.round(15+30*ringRatio);

    var ringSize = [width*0.175,width*0.075-width*0.06*ringRatio];
    var ringRad = width*0.075;
    //var ringSize = [35,15-12*ringRatio];
    var rcolor = new Color(225/255,229/255,20/255,0.95);
    for (var x=0;x<nring;x++){
        var ang = x*(360/nring);
        var cx = xoff+ringRad*Math.cos(ang*Math.PI/180)+(1*0.5-0.5);
        var cy = yoff+ringRad*Math.sin(ang*Math.PI/180)+(1*0.5-0.5);
        var ring = new Path.Ellipse({
            center: [cx,cy],
            size: ringSize,
            fillColor: rcolor,
            rotation: ang
        });
    }

    // inner circle
    var circleSize = width*0.0165 + width*0.108*circleShape/13;
    //var circleSize = 3.3 + 21.7*circleShape/13;

    var circleRatio = circleColor/13;
    var icircle = new Path();
    icircle.fillColor = new Color(104/255,50/255,14/255);
    icircle.fillColor.hue += circleRatio*35;
    for (var x=0;x<100;x++){
        var ang = x*(360/60);
        var cx = xoff+circleSize*Math.cos(ang*Math.PI/180)+(1*0.5-0.5);
        var cy = yoff+circleSize*Math.sin(ang*Math.PI/180)+(1*0.5-0.5);
        icircle.add(new Point(cx,cy));
    }
    icircle.closePath();
    icircle.shadowColor = new Color(0.1,0.1,0.1);
    icircle.shadowBlur = 5;
    icircle.shadowOffset = new Point(0,0);
    for (var xr=1;xr<=16;xr=xr+3){
        var ndots = 30-25*(16-xr)/16;
        var rangbeg = Math.PI*0.5;
        for (var x=1;x<ndots+1;x++){
            rang = rangbeg+x*2*Math.PI/ndots+0.1*0.5;
            rrad = xr/200*width+0.1*0.5;
            var cx = xoff+rrad*Math.cos(rang);
            var cy = yoff+rrad*Math.sin(rang);
            var spot = new Path.Ellipse({
                center: [cx,cy],
                size: [0.015*width,0.015*width],
                fillColor: icircle.fillColor
            });
            spot.fillColor.hue += 5*0.5-2.5;
            spot.fillColor.brightness += 0.3-0.15*0.1;//(1-(rrad/15));
            spot.fillColor.alpha = 0.2;
        }
    }

    paper.view.draw();

}

function download_img(petalColor,petalShape,circleShape,name){
    drawFlower1(petalColor,petalShape,circleShape);
    var link = document.createElement('a');
    link.href = paper.view.element.toDataURL();
    link.download = name;
    link.click();
}

function onResize(event) {
    globals.center = [paper.view.viewSize.width/2, paper.view.viewSize.height/2];
    drawFlower1(globals.x1,globals.x2,globals.x3);
}


// flower_set helper function (jump certain amount in Lab space)
function c_jump(cur_colour, lab_jump_size) {
    var new_colour = cur_colour; // new colour angle
    var cur_colour_lab = angle2Lab(cur_colour); // old colour L*a*b*      
    var new_colour_lab = cur_colour_lab; // new colour L*a*b*

    delta = deltaELab00(cur_colour_lab, new_colour_lab); // old-new 

    // increase colour angle until reach proper jump size in lab space
    while (delta<lab_jump_size) {
        new_colour += 1;
        new_colour_lab = angle2Lab(new_colour);
        delta = Math.round(deltaELab00(new_colour_lab, cur_colour_lab));
    }

    if (new_colour > 360) {
        new_colour = new_colour - 360;
    }
    return new_colour;
}

// create a set of flower images (48), 2 of each colour. Takes start colour (0, 60, 120, etc.)
function flower_set(startColour){
    
    var colour_size = 30; // degrees between colour sections
    var lab_jump_size = 20; // constant perceptual jump size in Lab space between colour sections
    var num_col = 12; // number of colour sections

    // list of colour centroids (e.g. 0, 30, 60)
    var colour_centroids = []
    for (var i=0; i<num_col; i++){
        colour_centroids.push((startColour+i*colour_size)%360);
    }
    //alert(colour_centroids);
    
    // create list of flower colours
    var cur_colour = startColour;
    var colours = [];   
    for (var c = 0; c<num_col; c++) {

        var shades = []

        // if at start colour, choose random starting point
        if (cur_colour == startColour) {
            var new_colour = Math.round(Math.random()*(colour_size) + colour_centroids[c]-(colour_size/2));
            if (new_colour < 0) {
                new_colour += 360;
            }
            shades.push(new_colour);
            //alert(colour_centroids[c]+"f f "+new_colour);
        }

        // if further down colour wheel, take a measured jump between previous and current colour
        else {

            var new_colour = c_jump(cur_colour, lab_jump_size);
                    
            var counter = 0;
            var c_min = (colour_centroids[c]-(colour_size/2));
            if (c_min < 0) { c_min += 360; }
            var c_max = (colour_centroids[c]+(colour_size/2));
            
            // if new colour is beyond limits of its colour section, must adjust previous colour
            if (colour_centroids[c] == 0) {
                while ((new_colour < c_min && new_colour > c_max) && counter < 20){
                    colours[colours.length-1].pop(); // get rid of last colour
                    cur_colour = colour_centroids[c-1]-counter;
                    colours[colours.length-1].push(cur_colour);

                    new_colour = c_jump(cur_colour, lab_jump_size);
                    //alert("shades "+shades+" colour "+new_colour);
                    counter++;
                }
                if (new_colour < c_min && new_colour > c_max){
                    alert("failed: "+colour_centroids[c]+" - "+new_colour);
                    return 0;
                }
            } else {
            while (((new_colour > c_max) || (new_colour < c_min)) && counter < 20){
                colours[colours.length-1].pop(); // get rid of last colour
                cur_colour = colour_centroids[c-1]-counter;
                colours[colours.length-1].push(cur_colour);

                new_colour = c_jump(cur_colour, lab_jump_size);
                //alert("shades "+shades+" colour "+new_colour);
                counter++;
            }
            if ((new_colour > c_max) || (new_colour < c_min)){
                alert("failed: "+colour_centroids[c]+" - "+new_colour);
                return 0;
                }
            }

            if (new_colour < 0) {
                new_colour += 360;
            }
            
            shades.push(new_colour);
            //alert(colour_centroids[c]+"f later "+new_colour);
        }

        // 3 additional shades for the colour
        for (var s = 0; s<3; s++) {
            var new_colour = Math.round(Math.random()*(colour_size) + colour_centroids[c]-(colour_size/2));

            var prev_colour_lab = angle2Lab(shades[s]); // prev colour L*a*b*      
            var new_colour_lab = angle2Lab(new_colour); // new colour L*a*b*

            delta = deltaELab00(prev_colour_lab, new_colour_lab); // old-new 

            // take less than jump size between previous and new shade
            while (delta>=(lab_jump_size/2)) {
                new_colour = Math.round(Math.random()*(colour_size) + colour_centroids[c]-(colour_size/2));
                new_colour_lab = angle2Lab(new_colour);
                delta = Math.round(deltaELab00(new_colour_lab, prev_colour_lab));
            }

            if (new_colour < 0) {
                new_colour += 360;
            }
      
            shades.push(new_colour);
            //alert(colour_centroids[c]+" shade "+new_colour);
        }

        cur_colour = shades[shades.length-1];
        //alert("shades"+shades);
        colours.push(shades);
        

    }
    //alert("colours"+colours);

    var shapes = [];
    var dev_max = 3;
    var dev_min = 1;
    var centA = 5;
    var centB = 15;
    for (var c = 0; c < num_col; c++) {
        var devA = (Math.random()*(dev_max-dev_min) + dev_min);
        var devB = (Math.random()*(dev_max-dev_min) + dev_min);
        shapes.push([(centA-devA).toFixed(1), (centA+devA).toFixed(1), (centB-devB).toFixed(1), (centB+devB).toFixed(1)]);
    }
    //alert("shapes"+shapes);

    //alert("hello");
    
    var file_header = ['order', 'name', 'colour', 'shade', 'category', 'shape'];
    var file_data = [];

    // counterbalance create trial (left or right of centroid)
    var start = [];
    var order = [];
    for (var c = 0; c < num_col/2; c++) {
        start.push(0)
    }
    for (var c = 0; c < num_col/2; c++) {
        start.push(1)
    }
    for (var c = 0; c < num_col; c++) {
        var randomIndex = Math.floor(Math.random()*(start.length-c));
        var s = start.splice(randomIndex, 1)[0];
        order.push(s);
    }

    var counter = 1;
    for (var c = 0; c < num_col; c++) {
        alert(c); 
        for (var x = 0; x < 4; x++){

            if (x==0) {

                // colour start trial is to the left of its category centroid
                if (order[c]==0) {
                    var idx = Math.random() < 0.5 ? 0 : 2;
                    var s = shapes[c].splice(idx, 1)[0];

                // colour start trial is to the right of its category centroid
                } else {
                    var idx = Math.random() < 0.5 ? 1 : 3;
                    var s = shapes[c].splice(idx, 1)[0];
                }

            // put rest of flower shapes for this colour in random order
            } else {
                var randomIndex = Math.floor(Math.random()*(4-x));
                var s = shapes[c].splice(randomIndex, 1)[0];
            }
            
            download_img(colours[c][x], s, 9, 'flower'+counter+'.png');

            // store file data
            var category = 'A';
            if (s > (centA+dev_max)) { 
                category = 'B'; 
            }
            file_data.push([counter.toString(), 'flower'+counter+'.png', colour_centroids[c].toString(), colours[c][x].toString(), category, s]);

            counter++;
        }  
    }
    //alert("bye");
    return [file_header, file_data];
}

function export_csv(arrayHeader, arrayData, delimiter, fileName){
    var header = arrayHeader.join(delimiter) + '\n';
    var csv = header;
    for (var i=0; i< arrayData.length; i++) {
        csv += arrayData[i].join(delimiter)+"\n";
    }

    var csvData = new Blob([csv], { type: 'text/csv' });  
    var csvUrl = URL.createObjectURL(csvData);

    var hiddenElement = document.createElement('a');
    hiddenElement.href = csvUrl;
    hiddenElement.target = '_blank';
    hiddenElement.download = fileName + '.csv';
    hiddenElement.click();
}

// create colour wheel flowers
function flower_wheel(){
/*     for (var i= 0; i<360; i+=30){
        download_img(i, 10, 9, 'flower_wheel'+i+'.png');
        alert(i);
    } */
    var shapes = [1, 2, 5, 8, 10, 12, 15, 18, 19];
    for (var i = 0; i<shapes.length; i++){
        download_img(210, shapes[i], 9, 'flower_shape'+shapes[i]+'.png');
        alert(i);
    }
}

// shape from 360 scale to actual flower shape scale
function deg2shape(petalShape){
    var petal_shape_max = 19;
    var color_max = 360;
    return Math.round(( (petalShape - 1) / (color_max - 1) ) * (petal_shape_max - 1) + 1);
}

drawFlower1(globals.x1,globals.x2,globals.x3);
globals.drawFlower1 = drawFlower1;
globals.download_img = download_img;
globals.flower_set = flower_set;
globals.export_csv = export_csv;
globals.deg2shape = deg2shape;
globals.flower_wheel = flower_wheel;



