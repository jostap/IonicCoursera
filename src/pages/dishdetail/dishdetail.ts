import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../comment/comment';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;
  comment: Comment;
  favs: number[] = new Array();

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private favoriteservice: FavoriteProvider,
    private storage: Storage) {

      this.dish = navParams.get('dish');
      this.favorite = this.favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;

      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating);
      this.avgstars = (total / this.numcomments).toFixed(2);

      storage.get('favorites').then(favorites => {
        if(favorites) {
          console.log(favorites);
          this.favs = favorites;
        }
        else
          console.log('HEJ');
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favs.push(this.dish.id);
    this.storage.set('favorites', this.favs);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);

    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as a favorite successfully',
      position: 'middle',
      duration: 3000
    }).present();
  }

  selectActions() {
    console.log('Select Actions clicked');
    let actionShet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add To Favorites',
          //role: 'destructive',
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            console.log('Add Comment clicked');
            this.openAddComment();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Select Actions cancelled');
          }
        }
      ]
    });

    actionShet.present();
  }

  openAddComment() {
    let modalAddComment = this.modalCtrl.create(CommentPage);
    modalAddComment.present();
    modalAddComment.onDidDismiss(inputComment => { this.comment = inputComment;
      if(this.comment.author != ''){
        var date = new Date();
        this.comment.date = date.toISOString();
        this.dish.comments.push(this.comment);
      }      
    });
  }

}
