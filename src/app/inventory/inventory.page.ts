import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  tables$: any;
  data: any;
  previewImage: string = '';
  capturedPhotos: any[] = [];
  product: any;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private navCtrl: NavController
  ) { 
    this.getAllDocuments();
  }

  ngOnInit() {

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


  navigateToNewPage(product: string) {
    this.navCtrl.navigateForward('/incoming-stock', {
      queryParams: { product }
    });
  }

}
