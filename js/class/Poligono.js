'use strict'

export class Poligono{
    constructor(vertici, id) { 
        this.vertici = vertici;
        this.id = id ? id : `r-${Date.now()}`;
    }

    toSVG() {
        let result = '<svg width="100vw" height="100vh" xmlns="http://www.w3.org/2000/svg" version="1.1">';

        let coords = [];

        this.vertici.forEach(element => {
            coords.push(element.x); 
            coords.push(element.y);
        });

        result += `<polygon points="${coords.join()}"/></svg>`; 

        return result;

    }

    perimetro() {
        console.log("perimetro della class Polygon");
        let result = 0;
        let count = this.vertici.length;
        for (let i=0; i < count; i++) {
            result += this.vertici[i].distance(this.vertici[(i+1) % count]);         
        }
        return result;

    }

    name() {
        switch(this.vertici.length) {
            case 3:
                return "Triangolo";
            case 4:
                return "Quadrilatero";
            case 5:
                return "Pentagono";
            case 6:
                return "Esagono";
            case 7:
                return "Ettagono";
            case 8:
                return "Ottagono";
            case 9:
                return "Ennagono";
            case 10:
                return "Decagono";
            case 12:
                return "Dodecagono";
            case 20:
                return "Icosagono";
            default:
                return `Poligono con ${this.vertici.length} lati`;          
                
        }
    }
}