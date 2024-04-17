import { Component, OnInit, Renderer2 } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { ViewproductsPage } from '../viewproducts/viewproducts.page';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {  LoadingController,NavController, ToastController , AlertController, ModalController} from '@ionic/angular';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const pdfMake = require('pdfmake/build/pdfmake.js');


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
  cart:any[]=[];
  //Firebase Data

  product: any;
  description: any;
  quantity: any;
  barcode: any;
  currentDate: any;
  currentTime: any;


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loader: LoadingController,
    private Toast: ToastController,
    private renderer: Renderer2,
    private Modal: ModalController
  ) { 
    
  }

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

  async viewImage() {
    const modal = await this.Modal.create({
      component: ViewproductsPage,
      componentProps: {

      },
    });
    return await modal.present();
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

  async submit() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
  
    try {
      const imageUrl = await this.uploadImage(this.previewImage);

      const newItem = {
        product: this.product,
        description: this.description,
        quantity: this.quantity,
        capturedPhotosUrl: imageUrl, // Use imageUrl instead of this.previewImage
        barcode: this.barcode
      }
      this.cart.push(newItem);
  
      const newNoteRef = this.db.collection('Notes').doc();
      await newNoteRef.set({newItem});
  
      this.generateSlip()
      loader.dismiss();
      this.showToast('Uploaded successfully!');
      this.viewImage()
    } catch (error) {
      console.error("error: " + error);
      loader.dismiss();
    }
  }

  async generateSlip() {
    const loader = await this.loader.create({
      message: 'Generating Slip...',
    });
    await loader.present();
  console.log("data",this.cart)
    try {
      // Create a slip document in Firestore
      const slipData = {
        date: new Date(),
        items: this.cart.map(item => ({
          name: item.product,
          quantity: item.quantity,
          description: item.description,
          imageUrl: item.imageUrl,
          // pickersDetails: item.pickersDetails,
          // dateOfPickup: item.dateOfPickup,
          // timeOfPickup: item.timeOfPickup,
          barcode: item.barcode,
          // pickersDetailsEmail:this.pickersDetailsEmail,
          // phone :this.phone,
          // Cumpany:this.Cumpany
        })),
      };
      await this.db.collection('invoice').add(slipData);
      pdfMake.vfs = pdfFonts.pdfMake.vfs;
     // Calculate column widths based on content length


// Define PDF content
// Define PDF content
// Define PDF content
const docDefinition = {
  content: [
    {
      text: 'BEST BRIGHT', // Adding the pickersDetailsPhone name to the header
      style: 'companyName'
    },
    {
      text: 'Invoice',
      style: 'header'
    },
    {
      text: `Date: ${new Date().toLocaleDateString()}`,
      style: 'subheader'
    },
    {
      table: {
        headerRows: 1,
        widths: [ '', '', '', '', '', '' ],
        body: [
          [
            { text: 'Name', style: 'tableHeader' },
            { text: 'Category', style: 'tableHeader' },
            { text: 'Description', style: 'tableHeader' },
            { text: 'Quantity', style: 'tableHeader' },
            { text: 'Picker\'s Details', style: 'tableHeader' },
            { text: 'Barcode', style: 'tableHeader' }
          ],
          ...this.cart.map(item => [
            { text: item.name, alignment: 'left' }, // Align left
          //  { text: item.category, alignment: 'center' }, // Align center
            { text: item.description, alignment: 'left' }, // Align left
            { text: item.quantity.toString(), alignment: 'center' }, // Align center
           // { text: item.pickersDetails, alignment: 'left' }, // Align left
            { text: item.barcode, alignment: 'center' } // Align center
          ])
        ]
      }
    }
  ],
  styles: {
    header: {
      fontSize: 24,
      bold: true,
      margin: [0, 0, 0, 10],
      alignment: 'center',
      color: '#4caf50' // Green color for the header
    },
    subheader: {
      fontSize: 14,
      bold: true,
      margin: [0, 10, 0, 10],
      alignment: 'center'
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: '#37474f', // Dark grey color for the table headers
      alignment: 'center'
    },
    companyName: { // Style for the company name
      fontSize: 28,
      bold: true,
      margin: [0, 0, 0, 20], // Adjust margin to separate company name from header
      alignment: 'center',
      color: '#ff5722' // Deep orange color for the company name
    }
  }
};

    // Generate PDF
    //pdfMake.createPdf(docDefinition).open();
    const pdfDocGenerator = await pdfMake.createPdf(docDefinition);
      // Clear the cart after generating the slip
      pdfDocGenerator.open();
      this.cart = [];
  
      // Show success toast notification
      this.showToast('Slip generated successfully'+ "success");
    } catch (error) {
      console.error('Error generating slip:', error);
      // Handle error
    } finally {
      loader.dismiss();
    }
}
  

  
}
