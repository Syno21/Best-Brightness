import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.page.html',
  styleUrls: ['./deliveries.page.scss'],
})
export class DeliveriesPage implements OnInit {

  product: any[] = [];
  quantity: any;
  description: any;

  tables$: any;
  data: any;
  previewImage: string = '';
  capturedPhotos: any[] = [];
  selectedProduct: any;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private nav: NavController,
    private loader: LoadingController,
    private Toast: ToastController
  ) { 
    this.getAllDocuments();
  }

  ngOnInit() {
  }

  getAllDocuments() {
    this.db.collection('Notes').valueChanges().subscribe((data: any[]) => {
      this.tables$ = data;
      this.tables$.forEach((table: { product: any; }) => {
      });
    });
  }

  updateQuantity() {
    if (this.selectedProduct) {
      // Find the selected product in the tables$ array
      const selected = this.tables$.find((table: { product: any; }) => table.product === this.selectedProduct);
      // Update the quantity based on the selected product's quantity
      this.quantity = selected ? selected.quantity : '';
    } else {
      this.quantity = ''; // Reset quantity if no product is selected
    }
  }
  
  async submit() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();

    if (!this.quantity ) {
      this.showToast('insert values');
      loader.dismiss();
      return;
    }
  
    try {
      // Fetch the current quantity for the selected product from Firebase
      const currentQuantitySnapshot = await this.db.collection('Notes').ref.where('product', '==', this.product).get();
      const currentQuantity = currentQuantitySnapshot.docs.length > 0 ? (currentQuantitySnapshot.docs[0].data() as any).quantity || 0 : 0; // Use type assertion here
  
      const newTotalQuantity = currentQuantity + this.quantity;
  
      const noteId = currentQuantitySnapshot.docs.length > 0 ? currentQuantitySnapshot.docs[0].id : null;
  
      if (noteId) {
        await this.db.collection('Notes').doc(noteId).update({
          product: this.product,
          quantity: newTotalQuantity,
        });
      } else {
        // Create a new note if it doesn't exist
        this.showToast("item does not exist");
      }
  
      loader.dismiss();
      this.showToast('Updated successfully!');
    } catch (error) {
      console.error("Error: " + error);
      loader.dismiss();
    }
  }

  async move() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
  
    try {
      // Fetch the current quantity for the selected product from Firebase Notes
      const currentNotesSnapshot = await this.db.collection('Notes').ref.where('product', '==', this.product).get();
      const currentNotesQuantity = currentNotesSnapshot.docs.length > 0 ? (currentNotesSnapshot.docs[0].data() as any).quantity || 0 : 0; // Use type assertion here
  
      const newNotesTotalQuantity = currentNotesQuantity - this.quantity;
  
      const noteId = currentNotesSnapshot.docs.length > 0 ? currentNotesSnapshot.docs[0].id : null;
  
      if (noteId) {
        await this.db.collection('Notes').doc(noteId).update({
          quantity: newNotesTotalQuantity,
        });
      }
  
      // Check if the product already exists in Shop collection
      const existingShopSnapshot = await this.db.collection('Shop').ref.where('product', '==', this.product).get();
      const existingShopDoc = existingShopSnapshot.docs.length > 0 ? existingShopSnapshot.docs[0] : null;
  
      if (existingShopDoc) {
        // Update the existing document in Shop collection
        const existingShopQuantity = (existingShopDoc.data() as any).quantity || 0; // Use type assertion here
        const newShopTotalQuantity = existingShopQuantity + this.quantity;
  
        await existingShopDoc.ref.update({
          quantity: newShopTotalQuantity,
        });
      } else {
        // Create a new document in Shop collection
        await this.db.collection('Shop').add({
          product: this.product,
          quantity: this.quantity,
        });
      }
  
      loader.dismiss();
      this.showToast('Items moved successfully to Shop.');
    } catch (error) {
      console.error("Error: " + error);
      loader.dismiss();
    }
  }
  
  

  goToAddNewStock(){
    this.nav.navigateForward("/add");
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
  
  async showToast(message: string) {
    const toast = await this.Toast.create({
      message: message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

}
