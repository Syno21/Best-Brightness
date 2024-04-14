import { Component, OnInit, Renderer2 } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
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
  barcode: any;


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loader: LoadingController,
    private Toast: ToastController,
    private renderer: Renderer2,
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
        barcode: this.barcode
      });
  
      loader.dismiss();
      this.showToast('Uploaded successfully!');
    } catch (error) {
      console.error("error: " + error);
      loader.dismiss();
    }
  }

  async closeScanner(){
    const result = await BarcodeScanner.stopScan(); // start scanning and wait for a result
    // if the result has content
  
    
    this.showCard();
    window.document.querySelector('ion-app')?.classList.remove('cameraView');
    document.querySelector('body')?.classList.remove('scanner-active');
  }

  hideCard() {
    const cardElement = document.getElementById('container');
    if (cardElement) {
      this.renderer.setStyle(cardElement, 'display', 'none'); // Use Renderer2's setStyle()
    }
  }
showCard() {
    const cardElement = document.getElementById('container');
    if (cardElement) {
      this.renderer.setStyle(cardElement, 'display', 'contents'); // Use Renderer2's setStyle()
    }
  }
  async scanBarcode() {
 
    window.document.querySelector('ion-app')?.classList.add('cameraView');
    this.hideCard();
    document.querySelector('body')?.classList.add('scanner-active');
    await BarcodeScanner.checkPermission({ force: true });
    // make background of WebView transparent
    // note: if you are using ionic this might not be enough, check below
    //BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    // if the result has content
    if (result.hasContent) {
      this.barcode = result.content;
      console.log(result.content);
      
      this.showCard();
      
      const querySnapshot = await this.db
      .collection('Notes')
      .ref.where('barcode', '==', result.content)
      .limit(1)
      .get();
      window.document.querySelector('ion-app')?.classList.remove('cameraView');
      document.querySelector('body')?.classList.remove('scanner-active');
    if (!querySnapshot.empty) {
      // If a product with the same barcode is found, populate the input fields
      
      const productData:any = querySnapshot.docs[0].data();
      this.product = productData.name;
      this.description = productData.description;
   
      // You can similarly populate other input fields here
    } else {
      this.showToast('Product not found' + 'warning');
    }// log the raw scanned content
      window.document.querySelector('ion-app')?.classList.remove('cameraView');
    }
  }


  

  
}
