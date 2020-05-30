import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', loadChildren: () => import('./home-page/home-page.module').then(mod => mod.HomePageModule) },
  { path: 'daily/:equitySymbol', loadChildren: () => import('./equity-page/equity-page.module').then(mod => mod.EquityPageModule) },
  { path: '**', loadChildren: () => import('./page-not-found/page-not-found.module').then(mod => mod.PageNotFoundModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
