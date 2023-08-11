'use strict'
import { Punto } from './class/Punto.js';
import { Rettangolo } from './class/Rettangolo.js'
import { Cerchio } from './class/Cerchio.js'
import { Poligono } from './class/Poligono.js'

let icone = {
  'successo': 'success',
  'errore': 'error',
  'attenzione': 'warning',
  'info': 'info',
  'domanda': 'question'
}
let dati = [];
let vertici = [];

//#region Funzioni PopUp Message

  /**
   * 
   * @param {String} title Titolo opzionale del messaggio
   * @param {String} text Testo opzionale del messaggio 
   * @param {String} icon Icona da visualizzare 
   * @param {String} confirmButtonText Testo del bottone di conferma
   */
  const message = (title = '', text = '', icon, confirmButtonText = 'OK') => {
    Swal.fire({
      title: `${title}`,
      text: `${text}`,
      icon: `${icon}`,
      confirmButtonText: `${confirmButtonText}`
    });
  }

  /**
   * 
   * @param {String} title Titolo opzionale del messaggio
   * @param {String} text Testo opzionale del messaggio 
   * @param {String} icon Icona da visualizzare 
   * @param {String} confirmButtonText Testo del bottone di conferma
   * @param {String} cancelButtonText Testo del bottone di cancellazione operazione
   * @param {Boolean} reverseButtons Valore di deafault è ```true``` e inverte la sequenza dei due pulsanti
   * @param {Object} isConfirmed Oggetto JSON per la conferma del messaggio con chiavi ```{title: ,text: ,icon: }```
   * @param {Object} isNotConfirmed Oggetto JSON per la cancellazione del messaggio con chiavi ```{title: ,text: ,icon: }```
   * @param {Function} callback Funzione da eseguire nel caso ci fosse la conferma
   */
  const option_message = (title = '', text = '', icon, confirmButtonText = 'Sì', cancelButtonText = 'No', reverseButtons = true, isConfirmed, isNotConfirmed, callback) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ms-2 me-2',
        cancelButton: 'btn btn-danger ms-2 me-2'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: `${title}`,
      text: `${text}`,
      icon: `${icon}`,
      showCancelButton: true,
      confirmButtonText: `${confirmButtonText}`,
      cancelButtonText: `${cancelButtonText}`,
      reverseButtons: reverseButtons
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          `${isConfirmed['title']}`,
          `${isConfirmed['text']}`,
          `${isConfirmed['icon']}`,
        );

        callback();
        
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          `${isNotConfirmed['title']}`,
          `${isNotConfirmed['text']}`,
          `${isNotConfirmed['icon']}`,
        )
      }
    });
  }
//#endregion

//#region Funzioni Disegno

  /**
   * Disegno un punto nella pagina in base alle cooridinate passate
   * @param {int} x 
   * @param {int} y 
   */
  const disegna_punto = (x = 0, y = 0) => {
    let p = new Punto(x, y);

    document.querySelector('#canva-box').appendChild(p.disegna());

   // dati.push(p);
    vertici.push(p);
  }

  /**
   * Disegna un rettangolo dati due punti o l'oggeti di tipo Rettangolo
   * @param {int} x 
   * @param {int} y 
   * @param {object} oggetto 
   */
  const disegna_rettangolo = (x = 0, y = 0, oggetto = '') =>{
    //1.Controllo se mi è stato passato un oggetto alla funzione
    if(!oggetto) disegna_punto(x, y);

    //2.Se mi è stato passato un oggetto lo utilizzo per disegnare
    if(oggetto) {
      //2.1 Genero i punti per disegnare un rettangolo e li inserisco nella variabile
      let punti = [
        new Punto(oggetto['origine']['x'], oggetto['origine']['y']),
        new Punto(oggetto['origine']['x'] + oggetto['base'], oggetto['origine']['y'] + oggetto['altezza'])
      ];

      //2.2 Associo alla variabile rettangolo un nuovo oggetto di tipo Rettangolo
      let rettangolo = new Rettangolo( punti, oggetto['id']);

      //2.3 Inserisco il rettangolo e lo disegno all'interno della pagina
      document.querySelector('#canva-box').innerHTML += rettangolo.toSVG(); 
      dati.push(rettangolo);   
      vertici = [];     
      
      visualizzaInTabella(rettangolo);
    }

    if(vertici.length === 2){
      let rettangolo = new Rettangolo(vertici);

      document.querySelector('#canva-box').innerHTML += rettangolo.toSVG();
      dati.push(rettangolo);
      console.log(vertici);
      vertici.forEach(p => document.querySelector(`#${p['id']}`).remove() );

      vertici = [];

      visualizzaInTabella(rettangolo);
    }
    
  }

  const disegna_cerchio = (x = 0, y = 0, oggetto = '') => {
    if(!oggetto) disegna_punto(x, y);

    if(oggetto) {
      let cerchio = new Cerchio( new Punto(oggetto['centro']['x'], oggetto['centro']['y']), oggetto['raggio']);

      document.querySelector('#canva-box').innerHTML += cerchio.toSVG();
      dati.push(cerchio);   
      vertici = [];   
      
      visualizzaInTabella(cerchio);
    }

    if(vertici.length === 2){
      let cerchio = new Cerchio( new Punto(0,0), 0);

      cerchio.centro.x = vertici[0].x;
      cerchio.centro.y = vertici[0].y;

      cerchio.raggio = cerchio.centro.distanza(vertici[1]);

      document.querySelector("#canva-box").innerHTML += cerchio.toSVG();

      vertici.forEach(p => document.querySelector(`#${p['id']}`).hidden = true );
      dati.push(cerchio);

      vertici = [];

      visualizzaInTabella(cerchio);
    }
  }

  const disegna_poligono = (x = 0, y = 0, oggetto = '') => {
    if(!oggetto) disegna_punto(x, y);

    if(!vicinoPuntoIniziale){
      punto(x,y);
    }else if(vicinoPuntoIniziale){
        let poligono = new Poligono(vertici);

        document.querySelector("#canva").innerHTML += poligono.toSVG(poligono);
        document.body.classList.remove('cursor');

        vicinoPuntoIniziale = !vicinoPuntoIniziale;

        dati.push(poligono);

        punti = [];
    }
  }
//#endregion

//#region Funzioni Gestione
  // FUNZIONE IN FASE DI TEST ANCORA DA PENSARLA BENE NON UTILIZZARE AL MOMENTO
  const trovaOggetto = (idOggetto) => {
    let oggetto;

    dati.forEach( (el, idx) => {
      console.log(idOggetto)
      console.log(el['id'])
      if(idOggetto === el['id']) oggetto = el;
    });

    return oggetto;
  }

  const selezione = (oggetto) => {
    let { id } = oggetto;

    document.querySelector(`#${id.split('_')[1]}`).classList.add('selezione')
    
  }
//#endregion

//#region Funzioni Tabella



/**
 * Inserisco una nuova riga nella tabella ogni volta che viene disegnata una figura
 * @param {object} oggeto 
 */

const visualizzaInTabella = (oggetto) => {
  //1.Seleziono il body della mia tabella
  let tabella = document.querySelector('#table-body');

  //2.Configuro la riga da inserire nella tabella 
  let riga = `<tr id="riga_${oggetto['id']}">
                <th scope="row">
                    <input id="selezione_${oggetto['id']}" class="form-check-input" type="checkbox" value="" >
                </th>
                <td>${oggetto.nome()}</td>
                <td>IMMAGINE FITTIZIA</td>
                <td>
                    <div class="btn btn-danger" id="cancella_${oggetto['id']}" >
                        <i id="cancella_${oggetto['id']}" class="fa-solid fa-trash-can"></i>
                    </div>
                </td>
                <td>
                    <div class="btn btn-info" id="info_${oggetto['id']}" data-bs-toggle="modal" data-bs-target="#info">
                        <i id="info_${oggetto['id']}" class="fa-regular fa-circle-question"></i>
                    </div>
                </td>
              </tr>`  

  //3.Ignetto la riga creata nella tabella 
  tabella.insertAdjacentHTML('beforeend', riga);    
 // tabella.innerHTML += riga;

  document.querySelector(`#selezione_${oggetto['id']}`)?.addEventListener('change', ({target}) => {
    console.log('CHANGE');

    if(target['checked']) selezione(target);
    else document.querySelector(`#${target['id'].split('_')[1]}`).classList.remove('selezione');
  });

  document.querySelector(`#cancella_${oggetto['id']}`)?.addEventListener('click', ({ target }) => {
    let { id } = target;
    let checked = document.querySelector(`#selezione_${target['id'].split('_')[1]}`).checked;

    if(!checked) return message('Selezionare prima la riga', '', icone['errore']);

    selezione(target);
    
    let isConfirmed = {
      'title': 'Salvataggio eseguito',
      'text': '',
      'icon': icone['successo']
    };
    
    let isNotConfirmed = {
      'title': 'Operazione annullata',
      'text': 'Il salvataggio non è stato eseguito',
      'icon': icone['errore']
    };

    const callback = () => {
      document.querySelector(`#${id.split('_')[1]}`).remove();
      document.querySelector(`#riga_${id.split('_')[1]}`).remove();

      // Da fare eliminare la figura anche dall'array dati e localStorage
    }

    return option_message(   'Sicuro di eliminare ?'
                            ,'La figura selezionata verrà cancellata definitivamente'
                            ,icone['errore']
                            ,'Si, sono sicuro'
                            ,'No, non voglio'
                            ,false
                            ,isConfirmed
                            ,isNotConfirmed
                            ,() => callback());
  });

  document.querySelector(`#info_${oggetto['id']}`)?.addEventListener('click', ({ target }) => {
    let { id } = target;

    if(id.split('_')[0] !== 'info'){
      document.querySelector('.btn-close').click()
      return
    }
     

    console.log('INFO');

    let oggetto = trovaOggetto(id.split('_')[1]);

    document.querySelector('#info-nome').textContent = oggetto.nome();
    document.querySelector('#info-id').textContent = oggetto['id'];
    document.querySelector('#info-area').textContent = oggetto.area();

    
  });

}

//#endregion

const dizionario_figure = {
  'rettangolo': disegna_rettangolo,
  'cerchio': disegna_cerchio
}

document.addEventListener('DOMContentLoaded', event => {
  let canva = document.querySelector('#canva-box');

  //#region Gestione Disegno
    canva?.addEventListener('click', ({ target, clientX, clientY }) => {
      let scelta = document.querySelector('#opzioni').value;
      if(dizionario_figure.hasOwnProperty(scelta)) dizionario_figure[scelta](clientX, clientY);
      else message('Oggetto in elaborazione','','info');
    });
  //#endregion

  //#region Bottoni Impostazioni
    document.querySelector('#salva')?.addEventListener('click', event => {
      //1.Controllo se ci sono gia dei dati salvati
      //  Nel caso ci siano visualizzo un messaggio per avvisare l'utente 
      //  che i precedenti salvataggi saranno sovrascritti
      if(localStorage.getItem('figure')) {

        let isConfirmed = {
          'title': 'Salvataggio eseguito',
          'text': '',
          'icon': icone['successo']
        };
        
        let isNotConfirmed = {
          'title': 'Operazione annullata',
          'text': 'Il salvataggio non è stato eseguito',
          'icon': icone['errore']
        };

        return option_message(   'Sei sicuro ?'
                                ,'I dati salavati in precedenza saranno sovrascritti'
                                ,icone['attenzione']
                                ,'Si, voglio sovrascrivere'
                                ,'No, non voglio'
                                ,false
                                ,isConfirmed
                                ,isNotConfirmed
                                ,() => localStorage.setItem('figure', JSON.stringify(dati)));
      }

      //2.Controllo se ci sono dati da slavare altrimenti mando messaggio a schermo 
      if(dati.length === 0) return message('Nessun dato da salvare','',icone['info']);
      //3.Salvo i dati nel localStorage 'figure' nel caso non ci fossero dati in precedenza
      localStorage.setItem('figure', JSON.stringify(dati));
      message('Salvataggio eseguito','',icone['successo']);
    });

    document.querySelector('#elimina')?.addEventListener('click', event => {
      if(dati.length === 0) return message('Nessun dato da eliminare','',icone['info']);

      let isConfirmed = {
        'title': 'Disegni eliminati',
        'text': '',
        'icon': icone['successo']
      };

      let isNotConfirmed = {
        'title': 'Operazione annullata',
        'text': "L'eliminazione dei disegni non è stato seguito",
        'icon': icone['errore']
      };

      //1.Elimino a schermo tutte le figure e svuoto la variabile locale dati[] chidendo prima conferma all'utente
      option_message(   'Sei sicuro ?'
                        ,'Tutti i dati a schermo saranno eliminati'
                        ,icone['attenzione']
                        ,'Si, elimina'
                        ,'No, annulla'
                        ,false
                        ,isConfirmed
                        ,isNotConfirmed
                        ,() => {
                          canva.innerHTML = '';
                          dati = [];
                          vertici = [];
                          document.querySelector('#table-body').innerHTML = '';
                        });
     
      
    });

    document.querySelector('#importa')?.addEventListener('click', event => {
      //1.Controllo che esista un localStorage con chiave 'figure'
      //  Nel caso non esista visualizzo a schermo un messaggio di errore e esco dall'evento

      if(!localStorage.getItem('figure') || localStorage.getItem('figure') === '[]') 
        return message('ATTENZIONE','Nessun dato salvato da importare', icone['attenzione']);
      if(dati.length > 0) 
        return message('IMPOSSIBILE IMPORTARE','Esistono gia dati a schermo', icone['attenzione']);
        
      //2.Estraggo i dati salvati dal localStorage
      let dati_salvati = JSON.parse(localStorage.getItem('figure'));
      let dizionario = {
        'r': disegna_rettangolo,
        'c': disegna_cerchio
      }

      dati_salvati.forEach( el => {
        let id = el['id'].split('-')[0];
        
        if(dizionario[id])  dizionario[id](el['x'], el['y'], el);
      });

    });

    document.querySelector('#reset')?.addEventListener('click', event => {
      //1.Se non esitono dati memorizzati o disegnati non eseguio la procedura di reset
      if(!localStorage.getItem('figure')) return message('ATTENZIONE', 'Non ci sono dati salavati per eseguire questa procedura', icone['attenzione'])
      
      //2.Mando a schermo un messaggio di conferma del reset

      let isConfirmed = {
        'title': 'Reset eseguito',
        'text': '',
        'icon': icone['successo']
      };

      let isNotConfirmed = {
        'title': 'Operazione annullata',
        'text': "Il reset della memoria non è stata annullata",
        'icon': icone['errore']
      };

      
      option_message(   'Sei sicuro ?'
                        ,'Tutti i dati salvati in memoria saranno cancellati'
                        ,icone['attenzione']
                        ,'Si'
                        ,'No, annulla'
                        ,false
                        ,isConfirmed
                        ,isNotConfirmed
                        ,() => localStorage.clear());
    });
  //#endregion
});