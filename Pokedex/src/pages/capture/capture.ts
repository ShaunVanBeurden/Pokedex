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
  private sprite: any;
  private randomCatchRate;
  private caughtPokemon = [];
  private base64Image: string;
  private unhideCamera = false;
  private hideCatchButton = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private camera: Camera) {
    this.name = navParams.get('name');
    this.sprite = navParams.get('sprite');

    this.storage.get('Caught').then((output) => {
      for (var i = 0; i < output.size; i++) {
        this.caughtPokemon.push(output[i]);
        console.log(output[i]);
      }
      //console.log(output);
    });
  }

  catchPokemon() {
    this.randomCatchRate = Math.floor((Math.random() * 2) + 1);
      if (this.randomCatchRate == 1) {
        var index = this.caughtPokemon.indexOf(this.name);
        if (index > -1) {
          alert('This pokemon has already been caught!')
        } else {
          this.caughtPokemon.push(this.name);
          this.storage.set('Caught', this.caughtPokemon);
          alert('You have caught: ' + this.caughtPokemon + '!');
          this.unhideCamera = true;
        }
      } else {
        alert('Pokemon ' + this.name + ' has not been caught!');
      }
    this.hideCatchButton = true;
  }

  takePhoto() {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 500,
      targetHeight: 500
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
    }, (err) => {
      console.log(err);
    });
  }
}
