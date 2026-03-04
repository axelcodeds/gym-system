import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside
      class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300"
      [class.translate-x-0]="isOpen()"
      [class.-translate-x-full]="!isOpen()"
      [class.lg:translate-x-0]="true"
    >
      <nav class="p-4 space-y-1">
        @for (item of items(); track item.route) {
          <a
            [routerLink]="item.route"
            routerLinkActive="bg-indigo-50 text-indigo-600 border-indigo-600"
            [routerLinkActiveOptions]="{ exact: item.route === '/admin' || item.route === '/member' }"
            class="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors border-l-4 border-transparent"
          >
            <span [innerHTML]="item.icon" class="w-5 h-5"></span>
            <span class="font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly items = input<NavItem[]>([]);
  readonly isOpen = input<boolean>(false);
}
