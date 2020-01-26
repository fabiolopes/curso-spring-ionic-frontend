import { Injectable } from "@angular/core";
import { LoadingController } from "ionic-angular";

@Injectable()
export class LoadingService {

    constructor(public loadingCtrl: LoadingController){}

    presentLoading() {
        let loader = this.loadingCtrl.create({
          content: "Aguarde..."
        });
        loader.present();
        return loader;
      }

}