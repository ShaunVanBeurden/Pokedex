import {Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {GoogleMapsEvent} from "@ionic-native/google-maps";
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";

declare var google: any;
declare var infowindow: any

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement;
  private map: any;
  private locations = [
    [51.688518, 5.286638],
    [51.691160, 5.284152],
    [51.695136, 5.293801],
    [51.686440, 5.294215],
    [51.696040, 5.29743],
    [51.693016, 5.301171],
    [51.691440, 5.304048],
    [51.689540, 5.287863],
    [51.697901, 5.300416],
    [51.686415, 5.304548],
  ];
  private randomPokemon;
  private sprite: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private pokedexprovider : PokedexproviderProvider) {

    this.randomPokemon = Math.floor((Math.random() * 803) + 1);
    pokedexprovider.pokemon = this.randomPokemon

    pokedexprovider.getPokemonDetails()
      .subscribe(result => {
        this.sprite = result['sprites']['front_default'];
      });
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then((resp) => {

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      // Add a maker
      for (var i = 0; i < this.locations.length; i++) {
        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.locations[i][0], this.locations[i][1]),
          title:"Hello World!",
          visible: true,
          icon: this.sprite
        });
        marker.setMap(this.map);
        marker.setIcon(this.sprite);
      }

      /*for (i = 0; i < this.locations.length; i++) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(this.locations[i][1], this.locations[i][2]),
          visible: true,
          map: this.map
        });

        google.maps.event.addListener(marker, 'click', (function (marker, i) {
          return function () {
            infowindow.setContent(this.locations[i][0]);
            infowindow.open(this.map, marker);
          }
        })(marker, i));
      }*/

    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}
