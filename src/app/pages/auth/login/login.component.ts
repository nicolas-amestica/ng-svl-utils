import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  hide = true;
  private isValidEmail = /\S+@\S+\.\S+/;
  private subscription: Subscription = new Subscription();

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.pattern(this.isValidEmail)]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor( private authService: AuthService,
               private fb: FormBuilder,
               private router: Router ) { }

  ngOnInit(): void {

    // const userData = {
    //   username: "niamesvi3@gmail.com",
    //   password: "123456"
    // }

    // this.authService.login(userData).subscribe((res) => console.log( 'Login' ));

  }

  ngOnDestroy(): void {

    this.subscription.unsubscribe();

  }

  onLogin(): void {

    // Se envia si es valido el formulario.
    if (this.loginForm.invalid) {
      return;
    }

    const formValue = this.loginForm.value;

    this.subscription.add(
      this.authService.login(formValue).subscribe( (res) => {
        if (res) {
          this.router.navigate([''])
        }
      })
    );
  }

  getErrorMessage(field: string): string {

    let message = '';

    if (this.loginForm.get(field)?.errors?.required) {
      message = 'Debe ingresar un valor.';
    } else if (this.loginForm.get(field)?.hasError('pattern')) {
      message = 'No es un email válido.';
    } else if (this.loginForm.get(field)?.hasError('minlength')) {
      const minLength = this.loginForm.get(field)?.errors?.minlength.requiredLength;
      message = `El largo del campo debe ser mayor a ${minLength} carácteres.`;
    }

    return message;

  }

  isValidField(field: string): boolean {

    let valida = false;

    if ((this.loginForm.get(field)?.touched || this.loginForm.get(field)?.dirty) && !this.loginForm.get(field)?.valid) {
      valida = true;
    }

    return valida;

  }

}
