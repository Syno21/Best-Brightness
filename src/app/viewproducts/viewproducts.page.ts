import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NavController } from '@ionic/angular';

@Pipe({
  name: 'calculateProgressOffset'
})
export class CalculateProgressOffsetPipe implements PipeTransform {
  circumference = 2 * Math.PI * 52; // Circumference of the circle

  transform(quantity: number): number {
    const maxQuantity = 400;
    const progressPercentage = (quantity / maxQuantity) * 100;
    const offset = this.circumference - (progressPercentage / 100) * this.circumference;
    return offset;
  }
}

@Component({
  selector: 'app-viewproducts',
  templateUrl: './viewproducts.page.html',
  styleUrls: ['./viewproducts.page.scss'],
})
export class ViewproductsPage implements OnInit {

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
    return `meter-1: ${(100 - progressPercentage) / 100};`;
  }

  calculateProgressPercentage(quantity: number): number {
    const maxQuantity = 400;
    const percentage = quantity / maxQuantity;
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
