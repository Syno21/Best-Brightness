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
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    if (this.password !== this.confirmpassword) {
      console.error('Passwords do not match');
      return;
    }

    const userData = {
      firstname: this.firstname,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
    };

    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then((userCredential) => {
        if (userCredential.user) {
          this.db.collection('Users').add(userData)
            .then(() => {
              console.log('User data added successfully');
            })
            .catch((error) => {
              console.error('Error adding user data:', error);
            });
        } else {
          console.error('User credential is missing');
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      });
  }


  Login() {
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
                  const id = doc.id;
                  console.log(id);
                  const userData = doc.data();
                });
                console.log("logger!!");
                this.Nav.navigateForward("/home");
              })
              .catch((error: any) => {
                console.error('Error fetching user data:', error);
              });
          } else {
            console.error('User email not found in userCredential');
          }
        } else {
          console.error('User credential is missing');
        }
      })
      .catch((error: any) => {
        console.error('Error signing in:', error);
      });
  }
  

  

}
