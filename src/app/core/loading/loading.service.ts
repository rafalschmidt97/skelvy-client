import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly renderer: Renderer2;

  constructor(
    @Inject(DOCUMENT) private readonly document,
    private readonly loadingController: LoadingController,
    rendererFactory: RendererFactory2,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  async show() {
    const loading = await this.loadingController.create();
    await loading.present();
    return loading;
  }

  lock() {
    this.renderer.addClass(this.document.body, 'locked');
  }

  unlock() {
    this.renderer.removeClass(this.document.body, 'locked');
  }
}
