'use strict'

import { Punto } from './Punto.js';

export class Rettangolo{
    constructor(vertici, id) {
        this.base = Math.abs(vertici[0].x - vertici[1].x);
        this.altezza = Math.abs(vertici[0].y - vertici[1].y);
        this.origine = new Punto( Math.min(vertici[0].x, vertici[1].x), Math.min(vertici[0].y, vertici[1].y) );
        this.id = id ? id : `r-${Date.now()}`;
    }
    
    perimetro() {
        return this.base * 2 + this.altezza * 2;
    }
    
    area() {
        return this.base * this.altezza; 
    }

    toSVG() {
    
        let result = `<svg width="100vw" height="100vh" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <rect id="${this.id}" width="${this.base}" height="${this.altezza}" x="${this.origine.x}" y="${this.origine.y}"></rect>
                      </svg>`;
    
        return result;
    }

    contiene(p) {
        return p.x >= this.origine.x && p.x <= this.origine.x + this.base && p.y >= this.origine.y && p.y <= this.origine.y + this.altezza;
    }

    nome() {
        return "Rettangolo";
    }
}