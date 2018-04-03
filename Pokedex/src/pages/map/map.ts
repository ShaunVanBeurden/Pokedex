import {Component, ViewChild } from '@angular/core';
import {IonicPage, NavController, NavParams, ModalController} from 'ionic-angular';
import {Geolocation} from "@ionic-native/geolocation";
import {PokedexproviderProvider} from "../../providers/pokedexprovider/pokedexprovider";

declare var google: any;

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


  constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, private pokedexprovider : PokedexproviderProvider, public modalCtrl: ModalController) {
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
      let infoWindow = new google.maps.InfoWindow();

      for (let location in this.locations) {

        this.randomPokemon = Math.floor((Math.random() * 803) + 1);
        this.pokedexprovider.pokemon = this.randomPokemon;

        // Add a marker
        let getPokemonReq = this.pokedexprovider.getPokemonDetails();
        let getPokemonSub = getPokemonReq.subscribe(result => {

            var marker = new google.maps.Marker({
              position: new google.maps.LatLng(this.locations[location][0], this.locations[location][1]),
              title: "Hello World!",
              visible: true,
              icon: result['sprites']['front_default']
            });
            marker.setMap(this.map);
            google.maps.event.addListener(marker, 'click', (function (marker, location) {
              return function () {
                //if else functie om te kijken of je dichtbij genoeg staat bij een pokemon
                if (this.getDistanceFromLatLonInKm(resp.coords.latitude, resp.coords.longitude, this.locations[location][0], this.locations[location][1]) > 5.50) {
                  alert('Je bent niet dichtbij genoeg!')
                } else {
                  let profileModal = this.modalCtrl.create('CapturePage', { name: result['name'], sprite: result['sprites']['front_default'] });
                  profileModal.present();
                }
              }
            })(marker, location).bind(this));

        }, () => {
          getPokemonSub.unsubscribe()
        });
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  // Afstand in km berekenen met coordinaten volgens de Haversine formula
  getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Straal van de aarde in km
    var dLat = this.deg2rad(lat2-lat1);
    var dLon = this.deg2rad(lon2-lon1);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Afstand in km
    return d;
  }

  // Graden omzetten naar straal
  deg2rad(deg) {
    return deg * (Math.PI/180)
  }
}
