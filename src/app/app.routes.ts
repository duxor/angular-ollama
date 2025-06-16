import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  loadComponent: () => import('./features/chat/pages/chat-page/chat-page').then(m => m.ChatPage)
}];
