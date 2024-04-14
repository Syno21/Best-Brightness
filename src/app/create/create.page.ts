import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  previewImage: string = '';
  capturedPhotos: any[] = [];
  imageUrls: any = [];
  url: any;

  //Firebase Data
  lastname: any;
  firstname: any;
  username: any;
  password: any;
  confirm_password: any;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loader: LoadingController,
    private Toast: ToastController,
  ) { }

  ngOnInit() {
  }

  async showToast(message: string) {
    const toast = await this.Toast.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  async submit() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
  
    try {
      const newNoteRef = this.db.collection('Users').doc();
      await newNoteRef.set({
        firstname: this.firstname,
        lastname: this.lastname,
        username: this.username,
        password: this.password,
        confirm_password: this.confirm_password, // Use imageUrl instead of this.previewImage
        Status: 'Driver'
      });
  
      loader.dismiss();
      this.showToast('Uploaded successfully!');
    } catch (error) {
      console.error("error: " + error);
      loader.dismiss();
    }
  }

}
