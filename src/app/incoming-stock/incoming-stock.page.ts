import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-incoming-stock',
  templateUrl: './incoming-stock.page.html',
  styleUrls: ['./incoming-stock.page.scss'],
})
export class IncomingStockPage implements OnInit {

  product: any;
  description: any;
  quantity: any;
  docData: any;

  tables$: any;
  data: any;
  previewImage: string = '';
  capturedPhotos: any[] = [];
  dbPhotos: any[] =[];

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private route: ActivatedRoute,
    private loader: LoadingController,
    private Toast: ToastController,
  ) { 
    this.getAllDocuments();
    this.getPassedData();

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

  getAllDocuments() {
    this.db.collection('Notes').valueChanges().subscribe((data: any[]) => {
      this.tables$ = data;
      this.tables$.forEach((table: { capturedPhotosUrl: any; }) => {
        const imageUrl = table.capturedPhotosUrl; // Assuming 'capturedPhotosUrl' is where you store the image URL in Firestore
        if (imageUrl) {
          // If the image URL exists, add it to capturedPhotos array
          this.capturedPhotos.push(imageUrl);
        }
      });
    });
  }

  checkIfDocumentExist = false;

  getOneDocumentData() {
    if (this.product) {
      this.db
        .collection('Notes', (ref) =>
          ref.where('product', '==', this.product)
        )
        .valueChanges()
        .subscribe((data: any[]) => {
          if (data && data.length > 0) {
            this.checkIfDocumentExist = true;
            const docData = data[0];
            this.quantity = docData.quantity;
            this.capturedPhotos = []; // Clear the capturedPhotos array before populating
            this.dbPhotos = [];


            if (docData.capturedPhotosUrl && docData.capturedPhotosUrl.length > 0) {
              // Set dbPhotos directly to the single image URL
              this.dbPhotos.push(docData.capturedPhotosUrl);
              console.log(docData);
            }
          }
        });
    }
  }

  getPassedData() {
    this.route.queryParams.subscribe((params: Params) => {
      if (params && params['product']) {
        this.product = params['product'];
        this.getOneDocumentData();
      }
    });
  }

  async Update() {
    const loader = await this.loader.create({
      message: 'Updating...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
  
    // Check if this.product and this.quantity are defined and not null/undefined
    if (!this.product ||
      !this.quantity ||
      typeof this.product !== 'string' ||
      typeof this.quantity !== 'string' ||
      this.product.trim() === '' ||
      this.quantity.trim() === '') {
    }
  
    try {
      // Fetch the document that matches the product value
      const querySnapshot = await this.db.collection('Notes').ref.where('product', '==', this.product).get();
  
      if (querySnapshot.empty) {
        this.showToast('No document found with the specified product');
        loader.dismiss();
        return;
      }
  
      // Update the first matching document found (assuming there's only one match)
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update({
        product: this.product,
        quantity: this.quantity,
      });
  
      loader.dismiss();
      this.showToast('Updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
      loader.dismiss();
    }
  }
  
  

}
