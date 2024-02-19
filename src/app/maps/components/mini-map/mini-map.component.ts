import { Component, Input, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';
@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css'
})
export class MiniMapComponent  implements AfterViewInit{

  @Input() lngLat?:[number,number];
  @ViewChild('map') divMap?: ElementRef;

  public map?: Map;

  ngAfterViewInit(): void {
    if (!this.divMap?.nativeElement) throw 'El elemento mapa no fue encontrado';
    if (!this.lngLat) throw 'lngLat cant be null';
    console.log(this.divMap);

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 14, // starting zoom
      interactive:false
    });
     new Marker().setLngLat(this.lngLat).addTo(this.map);

  }

}


