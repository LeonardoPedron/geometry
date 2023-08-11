'use strict'

export class Cerchio{
    constructor(centro, raggio, id) {
        this.centro = centro;
        this.raggio = raggio;

        this.id = 'c-' + Date.now();
    }

    circonferenza() {
        return Math.PI * 2 * this.raggio; // qui mi calcolo la circonferenza 2Pgreco per raggio
    }
    
    area() {
        return Math.PI * Math.pow(this.raggio, 2); // qui mi calcolo l'area Pgreco per raggio al quadrato
    }

    toSVG() {
        let result = `<svg width="100vw" height="100vh" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <circle id="${this.id}" cx="${this.centro.x}" cy="${this.centro.y}" r="${this.raggio}"></circle>
                      </svg>`; 
    
        return result;
    }

    contiene(p) {
        return this.centro.distanza(p) <= raggio;
    }

    nome() {
        return "Cerchio";
    }
}