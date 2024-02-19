import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';


interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css'
})
export class MarkersPageComponent  implements OnDestroy {

  @ViewChild('map') divMap?: ElementRef;

  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-68.12550235921583, -16.513778648077405)
  public markers: MarkerAndColor[] = [];

  ngAfterViewInit(): void {

    if (!this.divMap) throw 'El elemento HTML no fue encontrado';
    console.log(this.divMap);

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 12, // starting zoom
    });
    // Forma basica para crear un marcador plano tomando el punto central del mapa
    // const marker = new Marker().setLngLat(this.currentLngLat).addTo(this.map);
    // Forma basica para crear un marcador utilizando html:
    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Diego La Faye'
    // const marker = new Marker({
    //   element: markerHtml,
    // }).setLngLat(this.currentLngLat).addTo(this.map);
    this.mapListeners();
    this.readFromLocalStorage();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }


  createMarker() {
    if (!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color);
  }

  mapListeners() {
    if (!this.map) throw 'No existe el mapa';

    this.map.on('click', (ev) => {


      const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
      const lngLat = ev.lngLat;
      this.addMarker(lngLat, color);

    });
    this.map.on('dragend', (ev) => {


     console.log(ev);


    });
  }


  addMarker(lngLat: LngLat, color: string) {
    if (!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true
    }).setLngLat(lngLat).addTo(this.map);
    this.markers.push({
      color: color,
      marker: marker
    });
    this.saveToLocalStorage();
    marker.on('dragend',()=>{
      //Aqui como se guarda por referencia simplemente se debe llamar la funcion para guardar en localStorage que guarda el marker actualizado
      this.saveToLocalStorage();

    });
  }

  deleteMarker(index:number){
    this.markers[index].marker.remove();
    this.markers.splice(index,1);
    this.saveToLocalStorage();
  }

  flyTo(marker:Marker){

    this.map?.flyTo({
      zoom:14,
      center: marker.getLngLat()
    })
  }


  saveToLocalStorage(){
    const plainMarker:PlainMarker[] = this.markers.map(({color,marker})=>{

      return {
        color,
        lngLat: marker.getLngLat().toArray()
      }
    });

    localStorage.setItem('plainMarkers',JSON.stringify(plainMarker));
  }


  readFromLocalStorage(){
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers:PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach(({color,lngLat})=>{
      //Esta es una desestructuracion del array en donde lng esta tomando la posicion 0 y lat la posicion 2
      const[ lng, lat] = lngLat;
      const coords = new LngLat(lng,lat);

      this.addMarker(coords,color);
    })


  }
}
