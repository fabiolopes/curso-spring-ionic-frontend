import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';
import { LoadingService } from '../../services/loading.service';

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  itens: ProdutoDTO[] = [];
  page: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService,
    public loadingService: LoadingService) {
  }

  ionViewDidLoad() {
    this.loadData();
  };

  loadData(){
    let categoria_id = this.navParams.get('categoria_id');
    let loader = this.loadingService.presentLoading();
    this.produtoService.findByCategoria(categoria_id, this.page, 10)
    .subscribe(response => {
      let start = this.itens.length;
      this.itens = this.itens.concat(response['content']);
      let end = this.itens.length-1;
      loader.dismiss();
      console.log(this.page);
      console.log(this.itens);
      this.loadImageUrls(start, end);
    },
    error =>{
      loader.dismiss();
    });
  }

  loadImageUrls(start: number, end: number) {
    for (let i = start; i <= end; i++) {
      let item = this.itens[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`
        },
        error=>{});
    }
  }

  showDetail(produto_id: string) {
    this.navCtrl.push('ProdutoDetailPage', {produto_id: produto_id});
  }

  doRefresh(refresher) {
    this.page = 0;
    this.itens = [];
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;

    setTimeout(() => {
      infiniteScroll.complete();
    }, 1000);this.loadData();
  }

}
