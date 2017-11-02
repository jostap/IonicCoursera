import { Component, OnInit, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ItemSliding, ToastController,
        LoadingController, AlertController } from 'ionic-angular';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { Dish } from '../../shared/dish';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the FavoritesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage implements OnInit {

  favorites: Dish[];
  errMess: string;
  favs: number[] = new Array();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private favoriteservice: FavoriteProvider,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    @Inject('BaseURL') private BaseURL,
    private storage: Storage) {

      storage.get('favorites').then(favorites => {
        if (favorites) {
          for (let fav of favorites){
            console.log('FAV: ' + fav);
            this.favoriteservice.addFavorite(fav);
            this.favs.push(fav);
          }
        }
        else
          console.log('Favorites undefinied');
        
       
    });
  }

  ngOnInit() {
    this.favoriteservice.getFavorites()
      .subscribe(favorites => this.favorites = favorites,
      errmess => this.errMess = errmess);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  deleteFavorite(item: ItemSliding, id: number) {
    console.log('delete', id);
    var index = this.favs.indexOf(id, 0);
    if (index > -1) {
       this.favs.splice(index, 1);
    }
    //this.favs.splice(id, 1);
    this.storage.set('favorites', this.favs);
    let alert = this.alertCtrl.create({
      title: 'Confirm Title',
      message: 'Do you want to delete Favorite ' + id,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Deleting . . .'
            });
        
            let toast = this.toastCtrl.create({
              message: 'Dish ' + id + ' deleted successfully',
              duration: 3000
            });
        
            loading.present();
            this.favoriteservice.deleteFavorite(id)
              .subscribe(favorites => { this.favorites = favorites; loading.dismiss(); toast.present(); },
                errmess => { this.errMess = errmess; loading.dismiss(); });
          }
        }
      ]
    });

    alert.present();
    item.close();
  }

}
