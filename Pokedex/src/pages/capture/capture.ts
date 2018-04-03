import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';

/**
 * Generated class for the CapturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-capture',
  templateUrl: 'capture.html',
})
export class CapturePage {

  private name: any;
  public sprite: any;
  private randomCatchRate;
  private caughtPokemon = [];
  public base64Image: string;
  public unhideCamera = false;
  public hideCatchButton = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private camera: Camera) {
    this.name = navParams.get('name');
    this.sprite = navParams.get('sprite');

    // We halen alle gevangen pokemon op en stoppen die in een array
    this.storage.get('Caught').then((output) => {
      for (var i = 0; i < output.size; i++) {
        this.caughtPokemon.push(output[i]);
        console.log(output[i]);
      }
    });
  }

  // Functie voor het vangen van een pokemon
  catchPokemon() {
    // De kans van het vangen is 50/50
    this.randomCatchRate = Math.floor((Math.random() * 2) + 1);
    // Succesvol gevangen
    if (this.randomCatchRate == 1) {
      // We checken of de pokemon al gevangen is
      var index = this.caughtPokemon.indexOf(this.name);
      if (index > -1) {
        alert('This pokemon has already been caught!')
      }
      // Als de pokemon nog niet gevangen is dan voegen we die toe aan de storage
      else {
        this.caughtPokemon.push(this.name);
        this.storage.set('Caught', this.caughtPokemon);
        alert('You have caught: ' + this.caughtPokemon + '!');
        this.unhideCamera = true;
      }
    }
    // Niet gevangen
    else {
      alert('Pokemon ' + this.name + ' has not been caught!');
    }
    this.hideCatchButton = true;
  }

  // Functie voor het nemen van een foto
  takePhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 500
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.storage.set(this.name, this.base64Image);
    }, (err) => {
      console.log(err);
    });
  }
}
