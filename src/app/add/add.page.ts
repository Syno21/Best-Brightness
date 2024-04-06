import { Component, OnInit } from '@angular/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  previewImage: string = '';
  capturedPhotos: any[] = [];
  imageUrls: any = [];
  url: any;

  //Firebase Data

  product: any;
  description: any;
  quantity: any;


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

  async takePhoto() {
    const image: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 90,
    });

    this.previewImage = `data:image/jpeg;base64,${image.base64String}`;
  }

  async uploadImage(file: string) {
    const fileName = Date.now().toString();
    const filePath = `images/${fileName}`;
    const fileRef = this.storage.ref(filePath);

    const uploadTask = fileRef.putString(file, 'data_url', {
      contentType: 'image/jpeg',
    });
    const snapshot = await uploadTask;

    return snapshot.ref.getDownloadURL();
  }

  async submit() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
  
    try {
      const imageUrl = await this.uploadImage(this.previewImage);
  
      const newNoteRef = this.db.collection('Notes').doc();
      await newNoteRef.set({
        product: this.product,
        description: this.description,
        quantity: this.quantity,
        capturedPhotosUrl: imageUrl, // Use imageUrl instead of this.previewImage
      });
  
      loader.dismiss();
      this.showToast('Uploaded successfully!');
    } catch (error) {
      console.error("error: " + error);
      loader.dismiss();
    }
  }
  

  
}
