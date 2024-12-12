import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,

  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Panggil login service
      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Login successful:', response);

            // Simpan token di localStorage
            this.authService.saveToken(response.token);

            // Cek role pengguna dan redirect ke halaman yang sesuai
            const role = this.authService.getRole();
            if (role === 'admin') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/products']);
            }
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = 'Invalid email or password';
        },
      });
    } else {
      this.errorMessage = 'Please enter valid email and password';
    }
  }
}
