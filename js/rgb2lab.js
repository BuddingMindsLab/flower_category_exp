/**
 * Converts RGB color to CIE 1931 XYZ color space.
 * https://www.image-engineering.de/library/technotes/958-how-to-convert-between-srgb-and-ciexyz
 * @param  {string} hex
 * @return {number[]}
 * 
 * source : https://stackoverflow.com/questions/15408522/rgb-to-xyz-and-lab-colours-conversion
 * explanation: http://poynton.ca/PDFs/coloureq.pdf
 */

function rgbToXyz(hex) {

    // 1) gamma transfer function (relationship between input image values and displayed intensity)
    const [r, g, b] = hexToRgb(hex).map(_ => _ / 255).map(sRGBtoLinearRGB)

    /* 2) displayed R, G, B to CIE X, Y, Z 
     * 
     * X    | Xr Xg Xb |    R
     * Y  = | Yr Yg Yb | *  G
     * Z    | Zr Zg Zb |    B
     * 
     * matrix values (Xr, Yg, etc.) are CIE values for CRT's RBG channels (not measurable in many cases -> use manufacturer's or standards)
     * In this case they "refer to a D65/2degree standard illuminent" (http://www.easyrgb.com/en/math.php)
    */
    const X =  0.4124 * r + 0.3576 * g + 0.1805 * b
    const Y =  0.2126 * r + 0.7152 * g + 0.0722 * b
    const Z =  0.0193 * r + 0.1192 * g + 0.9505 * b

    // For some reason, X, Y and Z are multiplied by 100.
    return [X, Y, Z].map(_ => _ * 100)
}

function xyzToRgb([X, Y, Z]) {

    [X,Y,Z] = [X, Y, Z].map(_ => _ / 100)

    /* 2) displayed R, G, B to CIE X, Y, Z 
     * 
     * X    | Xr Xg Xb |    R
     * Y  = | Yr Yg Yb | *  G
     * Z    | Zr Zg Zb |    B
     * 
     * matrix values (Xr, Yg, etc.) are CIE values for CRT's RBG channels (not measurable in many cases -> use manufacturer's or standards)
     * In this case they "refer to a D65/2degree standard illuminent" (http://www.easyrgb.com/en/math.php)
    */
    var var_R = X *  3.2406 + Y * -1.5372 + Z * -0.4986
    var var_G = X * -0.9689 + Y *  1.8758 + Z *  0.0415
    var var_B = X *  0.0557 + Y * -0.2040 + Z *  1.0570

    if ( var_R > 0.0031308 ) {
        var_R = 1.055 * ( Math.pow(var_R,(1 / 2.4 )) ) - 0.055;
    } else {
        var_R = 12.92 * var_R;
    }
    if ( var_G > 0.0031308 ){
        var_G = 1.055 * ( Math.pow(var_G,( 1 / 2.4 )) ) - 0.055;
    } else   {
        var_G = 12.92 * var_G;
    }                 
    if ( var_B > 0.0031308 ){
        var_B = 1.055 * ( Math.pow(var_B,( 1 / 2.4 )) ) - 0.055;
    } else {
        var_B = 12.92 * var_B;
    }                    
/* 
    sR = var_R * 255;
    sG = var_G * 255;
    sB = var_B * 255; */
    
    return [var_R, var_G, var_B];
}

/**
 * Undoes gamma-correction from an RGB-encoded color.
 * https://en.wikipedia.org/wiki/SRGB#Specification_of_the_transformation
 * https://stackoverflow.com/questions/596216/formula-to-determine-brightness-of-rgb-color
 * @param  {number}
 * @return {number}
 */
function sRGBtoLinearRGB(color) {
    // Send this function a decimal sRGB gamma encoded color value
    // between 0.0 and 1.0, and it returns a linearized value.
    if (color <= 0.04045) {
        return color / 12.92
    } else {
        return Math.pow((color + 0.055) / 1.055, 2.4)
    }
}

/**
 * Converts hex color to RGB.
 * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 * @param  {string} hex
 * @return {number[]} [rgb]
 */
function hexToRgb(hex) {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (match) {
        match.shift()
        return match.map(_ => parseInt(_, 16))
    }
}

/**
 * Converts CIE 1931 XYZ colors to CIE L*a*b*.
 * The conversion formula comes from <http://www.easyrgb.com/en/math.php>.
 * https://github.com/cangoektas/xyz-to-lab/blob/master/src/index.js
 * @param   {number[]} color The CIE 1931 XYZ color to convert which refers to
 *                           the D65/2° standard illuminant.
 * @returns {number[]}       The color in the CIE L*a*b* color space.
 */
// X, Y, Z of a "D65" light source.
// "D65" is a standard 6500K Daylight light source.
// https://en.wikipedia.org/wiki/Illuminant_D65
var D65_vals = [95.047, 100, 108.883] // Xn, Yn, Zn (dependent on white point of system)
function xyzToLab([x, y, z]) {

  /*        t^(1/3) if t > 0.008856
  * f(t) = 
  *         7.787*t + 16/116 if t <= 0.008856
  */

  // f(x), f(y), f(z)
  [x, y, z] = [x, y, z].map((v, i) => {
    v = v / D65_vals[i]
    return v > 0.008856 ? Math.pow(v, 1 / 3) : v * 7.787 + 16 / 116
  })

  // luminance = 116(y)^(1/3)   
  const l = 116 * y - 16

  // a = 500(f(x) - f(y))
  const a = 500 * (x - y)

  // b = 200(f(y) - f(z))
  const b = 200 * (y - z)

  return [l, a, b]
}

function labToXyz([l, a, b]) {
    var var_Y = ( l + 16 ) / 116;
    var var_X = a / 500 + var_Y;
    var var_Z = var_Y - b / 200;

    if ( Math.pow(var_Y,3)  > 0.008856 ){
        var_Y = Math.pow(var_Y,3)
    } else {
        var_Y = ( var_Y - 16 / 116 ) / 7.787
    }                      
    if ( Math.pow(var_X,3)  > 0.008856 ) {
        var_X = Math.pow(var_X,3)
    } else   {
        var_X = ( var_X - 16 / 116 ) / 7.787
    }                    
    if ( Math.pow(var_Z,3)  > 0.008856 ) {
        var_Z = Math.pow(var_Z,3)
    } else   {
        var_Z = ( var_Z - 16 / 116 ) / 7.787
    }                    

    const X = var_X * D65_vals[0]
    const Y = var_Y * D65_vals[1]
    const Z = var_Z * D65_vals[2]

    return [X, Y, Z];
}

// compute colour difference between two L*a*b* colour points
// formula from http://www.easyrgb.com/en/math.php and http://poynton.ca/PDFs/coloureq.pdf
function deltaELab94([l1, a1, b1], [l2, a2, b2]) {

    // delta E* = [ (delta L*)^2 + (delta a*)^2 + (delta b*)^2]^(1/2)
    const delta_e = Math.sqrt( Math.pow(l1-l2, 2) + Math.pow(a1-a2, 2) + Math.pow(b1-b2, 2))

    return delta_e
}

//Function returns CIE-H° value from CIELab hue (a, b)
function cieLab2Hue( a, b ){
    var bias = 0;
    if ( a >= 0 && b == 0 ){
            return 0;
    }
    if ( a <  0 && b == 0 ){
            return 180;
    }
    if ( a == 0 && b >  0 ){
            return 90;
    }
    if ( a == 0 && b <  0 ) {
            return 270;
    }
    if ( a >  0 && b >  0 ){
            bias = 0;
    }
    if ( a <  0 ) {
          bias = 180;
    }
    if ( a >  0 && b <  0 ) {
          bias = 360;
    }
    return ( radToDeg( Math.atan( b / a ) ) + bias )
 }

 function deltaELab00([l1, a1, b1], [l2, a2, b2]) {
    var WHTL = 1;
    var WHTC = 1;
    var WHTH = 1;

    var xC1 = Math.sqrt( a1*a1 + b1*b1 );
    var xC2 = Math.sqrt( a2*a2 + b2*b2 );
    var xCX = (xC1+xC2)/2;
    var xGX = 0.5*(1 - Math.sqrt( Math.pow(xCX,7)/(Math.pow(xCX,7) + Math.pow(25,7)) ) );
    var xNN = (1+xGX)*a1;
    xC1 = Math.sqrt(xNN*xNN + b1*b1);
    var xH1 = cieLab2Hue(xNN, b1);
    xNN = (1+xGX)*a2;
    xC2 = Math.sqrt(xNN*xNN + b2*b2);
    var xH2 = cieLab2Hue(xNN, b2);
    var xDL = l2 - l1;
    var xDC = xC2 - xC1;
    if ( ( xC1 * xC2 ) == 0 ) {
        var xDH = 0
    }
    else {
        xNN = Math.round(xH2 - xH1, 12);
        if ( Math.abs(xNN) <= 180 ) {
            var xDH = xH2 - xH1;
        }
        else {
            if ( xNN > 180 ) {
                var xDH = xH2 - xH1 - 360;
            } else  {
                var xDH = xH2 - xH1 + 360;
            }           
        }
    }
    
    xDH = 2*Math.sqrt(xC1*xC2) * Math.sin(deg2Rad(xDH/2));
    var xLX = (l1 + l2)/2;
    var xCY = (xC1 + xC2)/2;
    if ((xC1*xC2) == 0) {
        var xHX = xH1 + xH2;
    }
    else {
        xNN = Math.abs(Math.round(xH1 - xH2, 12));
        if ( xNN >  180 ) {
            if ((xH2 + xH1) <  360 ){
                var xHX = xH1 + xH2 + 360;
            } 
            else{
                var xHX = xH1 + xH2 - 360;
            }                        
        }
        else {
            var xHX = xH1 + xH2;
        }
        xHX = xHX/2;
        
    }
    
    var xTX = 1 - 0.17 * Math.cos(deg2Rad(xHX - 30)) + 0.24 * Math.cos( deg2Rad( 2 * xHX ) ) + 0.32 * Math.cos( deg2Rad( 3 * xHX + 6 ) ) - 0.20 * Math.cos( deg2Rad( 4 * xHX - 63 ) );
    var xPH = 30 * Math.exp(-((xHX-275)/25)*((xHX-275)/25));
    var xRC = 2 * Math.sqrt( Math.pow(xCY,7 ) / ( Math.pow(xCY,7) + Math.pow(25,7) ) )
    var xSL = 1 + ( ( 0.015 * ( ( xLX - 50 ) * ( xLX - 50 ) ) )/ Math.sqrt( 20 + ( ( xLX - 50 ) * ( xLX - 50 ) ) ) );
    var xSC = 1 + 0.045 * xCY
    var xSH = 1 + 0.015 * xCY * xTX
    var xRT = - Math.sin( deg2Rad( 2 * xPH ) ) * xRC
    xDL = xDL / ( WHTL * xSL )
    xDC = xDC / ( WHTC * xSC )
    xDH = xDH / ( WHTH * xSH )
    var deltE00 = Math.sqrt( Math.pow(xDL,2) + Math.pow(xDC,2) + Math.pow(xDH,2) + xRT*xDC*xDH);
    
    return deltE00;
}

function radToDeg(radians) {
    return radians * (180 / Math.PI)
}

function deg2Rad(degrees) {
    return degrees * Math.PI / 180
}

function angle2Lab(angle) {
    var a_val = 80*Math.cos(angle*Math.PI/180);
    var b_val = 80*Math.sin(angle*Math.PI/180);
    var l_val = 60;
    return [l_val, a_val, b_val]
}
function main(){

/*     var petalColor1 = 61;
    colour1 = angle2Lab(petalColor1);
    
    var petalColor2 = petalColor1;
    colour2 = colour1;

    delta = deltaELab00(colour1, colour2);
    while (delta<20) {
        petalColor2 += 1;
        colour2 = angle2Lab(petalColor2);
        delta = Math.round(deltaELab00(colour1, colour2));
    }
    alert(colour1+" ("+petalColor1+") vs. "+colour2+"("+petalColor2+") = "+delta);

    colour1 = [60,79.80512402078594,5.580517899530024];
    colour2 = [60,65.53216354311934,45.886114908083684];
    alert(deltaELab00(colour1, colour2)); */
}
//main()