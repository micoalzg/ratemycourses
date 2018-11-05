import { LoginService } from './../_services/login.service';
import { UsersService } from './../_services/users.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { RegisterComponent } from './register/register.component';
import { EditUserComponent } from '../admin-dashboard/edit-user/edit-user.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  addressForm = this.fb.group({
    
    // [ <defualtValue>, validators.requred -> required form (can put other type of validator: ie min char, max char, etc)]
    username: [null, Validators.required],
    password: [null, Validators.required],
  });

  constructor(
    // Dependency injection; <variable>: <bound to this>,
    // Now when we want to want to access methods,such from <bound to this, we do:
    //       this.<variable>.<method> ie this.fb.<method>

    // -> multiple components can access 1 component.
    private fb: FormBuilder,
    private userService: UsersService,
    private loginService: LoginService,
    private registerDialog: MatDialog,
    public dialogRef: MatDialogRef<EditUserComponent>,
  ) { }

  onSubmit() {
    const result = this.userService.verifyLogin(
      this.addressForm.controls.username.value,
      this.addressForm.controls.password.value);
    this.loginService.login(result.valid);
    if (result.valid) {
      this.loginService.inSession(result.foundUser);
      this.dialogRef.close({ user: result.foundUser });
    } else {
      console.log('Invalid login');
    }
    console.log(result);
  }

  register() {
    // opens register component w/ width 500px
    const registerDialogRef = this.registerDialog.open(RegisterComponent, {
      width: '500px',
    });
    registerDialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
