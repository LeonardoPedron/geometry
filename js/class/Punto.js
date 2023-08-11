'use strict'

export class Punto{
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id ? id : `p-${Date.now()}`;
    }

    disegna(){
        let punto = document.createElement('div');

        punto.classList.add('punto');
        punto.id = this.id;
        punto.style.top = `${this.y}px`;
        punto.style.left = `${this.x}px`;

        return punto;
    }

    distanza(point) {
        return Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2));
    }

    toString() {
        return `( ${this.x}, ${this.y} )`;
    }
}