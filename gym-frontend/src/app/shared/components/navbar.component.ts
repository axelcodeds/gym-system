import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  template: `
    <header
      class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50"
    >
      <nav class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <div class="flex items-center gap-4">
            <button
              type="button"
              class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              (click)="menuToggle.emit()"
              aria-label="Toggle menu"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <a routerLink="/" class="flex items-center gap-2">
              <span
                class="bg-indigo-600 text-white p-2 rounded-lg font-bold text-lg"
                >GYM</span
              >
              <span class="text-xl font-semibold text-gray-900 hidden sm:block"
                >FitLife Gym</span
              >
            </a>
          </div>

          <div class="flex items-center gap-4">
            @if (authService.authenticated()) {
              <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600 hidden sm:block">
                  {{ authService.user()?.firstName }}
                  {{ authService.user()?.lastName }}
                </span>
                <div
                  class="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center"
                >
                  <span class="text-indigo-600 font-medium text-sm">
                    {{ authService.user()?.firstName?.[0]
                    }}{{ authService.user()?.lastName?.[0] }}
                  </span>
                </div>
                <button
                  (click)="authService.logout()"
                  class="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            } @else {
              <a
                routerLink="/login"
                class="text-sm font-medium text-gray-600 hover:text-gray-900"
                >Sign in</a
              >
              <a
                routerLink="/plans"
                class="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
                >Join Now</a
              >
            }
          </div>
        </div>
      </nav>
    </header>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  readonly menuToggle = output<void>();
}
