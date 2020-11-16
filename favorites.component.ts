import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Stock } from '../Models/Stock';
import { AccountService } from '../Services/account.service';
import { AlphaVantageService } from '../Services/alpha-vantage.service';
import { FavoritesStorageService } from '../Services/favorites-storage.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {

  stocks: Stock[] = [];
  textColor: string;

  constructor(
    private serv: AlphaVantageService,
    private favServ: FavoritesStorageService,
    private toastr: ToastrService,
    private accServ: AccountService
   ) {

  }

  ngOnInit(): void {
    this.loadFavorites();
  }

  async loadFavorites() {
    let currentFavs = await this.favServ.getAllFavorites(this.accServ.getUserAccount().email);
    for(let i = 0; i < currentFavs.length; i++) {
      this.retrieveStock(currentFavs[i]);
    }
  }

  refreshData() {
    let copy: Stock[] = this.stocks;
    this.stocks = [];
    for (var i = 0; i < copy.length; i++) {
      let stock: Stock = copy[i];
      this.retrieveStock(stock.symbol);
    }
  }

  retrieveStock(symbol: string) {
    this.serv.getStocks(symbol).subscribe(
      (response) => {
        let data = response['Global Quote'];
        let change = data['09. change'];
        let newStock = new Stock(
          data['01. symbol'],
          data['02. open'],
          data['03. high'],
          data['04. low'],
          data['05. price'],
          data['06. volume'],
          data['07. latest trading day'],
          data['08. previous close'],
          change,
          data['10. change percent']
        );
        this.stocks.push(newStock);
      },
      (error) => console.log(error)
    );
  }

  deleteFavorite(stock: Stock) {
    if(confirm("Delete " + stock.symbol + " from favorites?")) {
      this.stocks.splice(this.stocks.indexOf(stock), 1);
      this.favServ.deleteFavorite(stock.symbol, this.accServ.getUserAccount().email);
      this.toastr.info(stock.symbol + " deleted from favorites");
    }

  }

  getTextColor(index: number): string {
    let stock = this.stocks[index];
    if (parseFloat(stock.change) < 0) {
      return 'red';
    } else {
      return 'green';
    }
  }
}
