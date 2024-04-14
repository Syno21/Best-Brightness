import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.page.html',
  styleUrls: ['./analytics.page.scss'],
})
export class AnalyticsPage implements OnInit {


  tables$: any;
  data: any;
  previewImage: string = '';
  capturedPhotos: any[] = [];
  product: any;
  datas$: any;

  constructor(
    private db: AngularFirestore,
    private storage: AngularFireStorage,
    private navCtrl: NavController
  ) { 
    this.getAllDocuments();
    this.getAllDocuments2();
  }

  ngOnInit() {

  }

  calculateProgressWidth(quantity: number): string {
    const maxQuantity = 400;
    const progressPercentage = (quantity / maxQuantity) * 100;
    return `--progress-percentage: ${(100 - progressPercentage) / 100};`;
  }

  calculateProgressPercentage(quantity: number): number {
    const maxQuantity = 400;
    const percentage = Math.min(quantity / maxQuantity, 1);
    return percentage;
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

  getAllDocuments2() {
    this.db.collection('Shop').valueChanges().subscribe((data: any[]) => {
      this.datas$ = data;
      this.datas$.forEach((datas: { capturedPhotosUrl: any; }) => {
        const imageUrl = datas.capturedPhotosUrl; // Assuming 'capturedPhotosUrl' is where you store the image URL in Firestore
        if (imageUrl) {
          // If the image URL exists, add it to capturedPhotos array
          this.capturedPhotos.push(imageUrl);
        }
      });
    });
  }

  

}
