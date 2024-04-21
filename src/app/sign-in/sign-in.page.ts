import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {

  firstname: any ;
  lastname: any ;
  email: any ;
  password: any ;
  confirmpassword: any ;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private Nav: NavController,
    private loader: LoadingController,
    private Toast: ToastController
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

  async onSubmit() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();
    // Validate text fields for empty values
    if (!this.firstname || !this.lastname || !this.email || !this.password || !this.confirmpassword) {
      this.showToast('Please fill in all fields');
      loader.dismiss();
      return;
    }
  
    // Validate password for strong criteria
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!strongPasswordRegex.test(this.password)) {
      this.showToast('Password must be at least 8 characters long and contain one uppercase letter, one number, and one symbol.');
      loader.dismiss();
      return;
    }
  
    // Check if password and confirm password match
    if (this.password !== this.confirmpassword) {
      this.showToast('Passwords do not match');
      loader.dismiss();
      return;
    }
  
    // Proceed with user creation and data addition
    const userData = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      Status: 'Admin',
    };
  
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        if (userCredential.user) {
          this.db.collection('Users').add(userData)
            .then(() => {
              this.showToast('Successfully Registered');
              loader.dismiss();
            })
            .catch((error) => {
              this.showToast('An Error occurred!! Please try again');
              loader.dismiss();
            });
        } else {
          this.showToast('User credential is missing');
          loader.dismiss();
        }
        loader.dismiss();
      })
      .catch((error) => {
        this.showToast('Error Signing up');
        loader.dismiss();
      });
  }
  


  async Login() {
    const loader = await this.loader.create({
      message: 'Submitting...',
      cssClass: 'custom-loader-class'
    });
    await loader.present();

    this.auth.signInWithEmailAndPassword(this.email, this.password)
  .then((userCredential) => {
    if (userCredential) {
      const email = userCredential.user?.email; // Extract email from userCredential

      if (email) {
        this.db.collection('Users', ref => ref.where('email', '==', email))
          .get()
          .toPromise()
          .then((querySnapshot: any) => {
            querySnapshot.forEach((doc: any) => {
              const userData = doc.data();
              const status = userData.status; // Get the status field from userData
              console.log(status);

              if (status === 'driver') {
                this.Nav.navigateForward("/home");
              } else {
                this.Nav.navigateForward("/analytics");
              }
            });
          })
          .catch((error: any) => {
            this.showToast('Error fetching user data: ' + error);
            loader.dismiss();
          });
      } else {
        this.showToast('User email not found in userCredential');
        loader.dismiss();
      }
    } else {
      this.showToast('User credential is missing');
      loader.dismiss();
    }
    loader.dismiss();
  })
  .catch((error: any) => {
    this.showToast('Error signing in');
    loader.dismiss();
  });

  }
  

  

}
