import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { Mapper } from '../mapping/mapper';
import User, { UserType } from '../../../../backend/src/models/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  constructor(private builder: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router) {
      sessionStorage.clear();

  }
  result: any;

  loginform = this.builder.group({
    email: this.builder.control('', Validators.required),
    password: this.builder.control('', Validators.required)
  });

  proceedlogin() {
    if (this.loginform.valid) {
      this.service.getUserByLogin(this.loginform.value.email!, this.loginform.value.password!)
        .subscribe((response: any) => {
          try {
            const mappedResponse = Mapper.MapperUserResponse(response);
            sessionStorage.setItem('login', mappedResponse.login);
            sessionStorage.setItem('role', mappedResponse.type.toString());

            if (mappedResponse.type == 0) {
              this.router.navigate(['/dashboard']);
            } else if (mappedResponse.type == 1) {
              this.router.navigate(['/shop']); 
            } else {
              this.router.navigate(['/']);
              this.toastr.error('Tipo de usuário desconhecido');
            }

          } catch (error:any) {
            this.toastr.error(error.message || 'Erro desconhecido');
          }
        });
    } else {
      this.toastr.warning('Por favor, insira dados válidos.');
    }
  }
}