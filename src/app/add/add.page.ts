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
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';


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
  driver: any;
  category: any;

  tables$: any;


  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private loader: LoadingController,
    private Toast: ToastController,
    private renderer: Renderer2,
    private Modal: ModalController
  ) { 
    this.getAllDocuments();
  }

  ngOnInit() {
  }

  departmentOptions = [
    { value: 'Cleaning detegents', text: 'Cleaning detegents' },
    { value: 'Plastic', text: 'Plastic' },
    { value: 'Cleaning equipments', text: 'Cleaning equipments' },

  ];

  getAllDocuments() {
    this.db.collection('Users').valueChanges().subscribe((data: any[]) => {
      this.tables$ = data;
      this.tables$.forEach((table: { product: any; }) => {
      });
    });
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
        barcode: this.barcode,
        driver: this.driver
      }
      this.cart.push(newItem);
  
      const newNoteRef = this.db.collection('Notes').doc();
      await newNoteRef.set({product: this.product,
        description: this.description,
        quantity: this.quantity,
        capturedPhotosUrl: imageUrl, // Use imageUrl instead of this.previewImage
        barcode: this.barcode,
        driver: this.driver,
        category: this.category});
        
        this.clear()
      loader.dismiss();
      this.showToast('Uploaded successfully!');
    } catch (error) {
      console.error("error: " + error);
      loader.dismiss();
    }
  }

  clear(){
    this.product = '',
    this.description = '',
    this.quantity = '',
    this.capturedPhotos = [0]
  }


  addItem(){
    const newItem = {
      product: this.product,
      description: this.description,
      quantity: this.quantity,
      barcode: this.barcode,
      driver: this.driver,
      category: this.category
    }

    this.cart.push(newItem);
    console.log(this.cart)
  }



  async generateSlip() {
    if ( !this.cart.length) {
    this.showToast("cart ampty" + "warning");
      // If cart is null or empty, return or perform desired action
      return;
    }
    // If cart is not empty, proceed with further actions
    const loader = await this.loader.create({
        message: 'Generating Slip...',
    });
    await loader.present();
    console.log('data', this.cart);
    try {
        // Create a slip document in Firestore
        const slipData = {
            date: new Date().toLocaleDateString(),
            driver: this.cart[0].driver,
                    items: this.cart.map(item => ({
                      product: item.product,
                      quantity: item.quantity,
                      description: item.description,
                      pickers_Name: item.driver,
                      barcode: item.barcode,
                      category: this.category
            })),
            
        };
        console.log('slipData:', slipData); // Log slipData to check its structure
  
  await this.db.collection('invoice').add(slipData);
        pdfMake.vfs = pdfFonts.pdfMake.vfs;
  
        // Define PDF content
        const docDefinition = {
          content: [
              {
                  text: 'BEST BRIGHT', // Adding the pickersDetailsPhone name to the header
                  style: 'companyName',
              },
              {
                  text: 'Invoice',
                  style: 'header',
              },
              {
                  text: `Date: ${new Date().toLocaleDateString()}`,
                  style: 'subheader',
              },
              {
                  text: ` ${slipData.driver}`,
                  style: 'subheader',
              },
              // Use an unordered list for the items
              {
                  ul: slipData.items.map((item: any) => `${item.product} x ${item.quantity} - ${item.description} - ${item.category} - (${item.barcode})`),
                  style: 'listItem',
              },
          ],
          styles: {
              header: {
                  fontSize: 24,
                  bold: true,
                  margin: [0, 0, 0, 10],
                  alignment: 'center',
                  color: '#4caf50', // Green color for the header
              },
              subheader: {
                  fontSize: 14,
                  bold: true,
                  margin: [0, 10, 0, 10],
                  alignment: 'center',
              },
              listItem: {
                  fontSize: 12,
                  margin: [0, 5, 0, 5],
              },
              companyName: {
                  // Style for the company name
                  fontSize: 28,
                  bold: true,
                  margin: [0, 0, 0, 20], // Adjust margin to separate company name from header
                  alignment: 'center',
                  color: '#ff5722', // Deep orange color for the company name
              },
          },
      };
  
  
        const pdfDoc = await pdfMake.createPdf(docDefinition);
        // Generate the PDF as base64 data
        pdfDoc.getBase64(async (data: any) => {
            // Save the PDF file locally on the device
            try {
                // Generate a random file name for the PDF
                const fileName =  `images/${Date.now()}_shop.pdf.pdf`;
  
                // Write the PDF data to the device's data directory
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: data,
                    directory: Directory.Documents,
                    recursive: true
                });
  
                console.log('PDF File created at: ', result.uri);
  
                // Define options for opening the PDF file
                const options: FileOpenerOptions = {
                    filePath: `${result.uri}`,
                    contentType: 'application/pdf', // Mime type of the file
                    openWithDefault: true, // Open with the default application
                };
                loader.dismiss();
                // Use FileOpener to open the PDF file
                await FileOpener.open(options);
                this.cart=[];
            } catch (error) {
                loader.dismiss();
                console.error('Error saving or opening PDF:', error);
                // Handle error
            }
        });
  
        alert('done');
    } catch (error) {
        loader.dismiss();
        console.error('Error generating slip:', error);
        // Handle error
    }
  }
  

  
}
