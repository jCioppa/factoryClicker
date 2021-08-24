import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RjuneGameComponent } from './rjune-game/rjune-game.component';

const route = (path: string, component: any) => ({ path, component });
const routes: Routes = [route('rjune', RjuneGameComponent)];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
