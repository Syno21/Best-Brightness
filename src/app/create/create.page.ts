import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';
import emailjs from 'emailjs-com';

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
    private auth: AngularFireAuth
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
      const userData = {
        firstname: this.firstname,
        lastname: this.lastname,
        email: this.username,
        password: this.password,
        Status: 'driver',
      };
    
      this.auth.createUserWithEmailAndPassword(this.username, this.password)
        .then((userCredential) => {
          if (userCredential.user) {
            this.db.collection('Users').add(userData)
              .then(() => {
                this.showToast('Successfully Registered');
              })
              .catch((error) => {
                this.showToast('An Error occurred!! Please try again');
              });
          } else {
            this.showToast('User credential is missing');
          }
        })
        .catch((error) => {
          this.showToast('Error Signing up');
        });

      const emailParams = {
        name: this.firstname,
        surname: this.lastname,
        email_to: this.username,
        from_email: 'thandekan736@gmail.com',
        subject: 'Interview Invitation from MUTInnovation Lab',
        message: 'You are invited for an interview on ' 
      };
  
      await emailjs.send('interviewEmailsAD', 'template_7x4kjte', emailParams, 'TrFF8ofl4gbJlOhzB');

      console.log('Email successfully sent');
  
      loader.dismiss();
      this.showToast('Uploaded successfully!');
    } catch (error) {
      console.error("error: " + error);
      loader.dismiss();
    }
  }

}
