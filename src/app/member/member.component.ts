import { Component } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';
import { tableData } from './tables-dynamic.data';
declare let jQuery: any;




declare let require: any;


export class StatsViewModel {

  public number: number = 0;
  public colour: string = 'primary';
  public type: string = 'fa-bell-o';
  public comments: string = 'Delegates';


}


export class Counts {

  public Members: number = 0;
  public Proposal: number = 0;
  public CampaignKnown: number = 0;
  public CampaignCompleted: number = 0;
  public CampaignAll: number = 0;

}


@Component({
  selector: 'app-member',
  templateUrl: './member.template.html'
})
export class MemberComponent {

  searchText: string = '';


  rows: Array<any> = [];
  columns: Array<any> = [
    { title: 'Делегат', name: 'name', link: 'link', sort: false, type: 'memberLink'},
    { title: 'Адрес кошелька', address: 'address', sort: false, type: 'addressLink'},
    { title: 'Дата регистрации', name: 'memberSince', sort: false, type: 'text' },
    { title: 'Верифицировано', name: 'campaignCompleted', sort: false, type: 'text' },
    { title: 'Завершено', name: 'campaignNew', sort: false, type: 'text'}
  ];

  page: number = 1;
  itemsPerPage: number = 10;
  maxSize: number = 5;
  numPages: number = 1;
  length: number = 0;

  config: any = {
    paging: true,
    sorting: { columns: this.columns },
    //filtering: { filterString: '', columnName: 'status' }
  };

  ng2TableData: Array<any> = tableData;



  accounts: string[];
  ERC223Coin: any;
  members: any[] = [];
  isLoaded: boolean = false;
  countsView: StatsViewModel[];

  //model = {
  //  amount: 5,
  //  receiver: '',
  //  balance: 0,
  //  account: '',
  //  decimals: 0
  //};

  private counts: any[] = [];


  status = '';



  constructor(
   private dacoService: DacoService
  ) {
    console.log('Constructor: ' + 'MemberComponent');
    
  }

  async ngOnInit()  {

    // console.log("START TEST");
    // await this.dacoService.ttt();
    // console.log("AFTER await", this.dacoService.tDaco);


    //console.log('OnInit: ' + this);
    //console.log(this);
    await this.dacoService.setupDacoContract();
    await this.refreshData();
    this.watchAccount();
    //this.web3Service.artifactsToContract(metacoin_artifacts)
    //  .then((MetaCoinAbstraction) => {
    //    this.ERC223Coin = MetaCoinAbstraction;
    //  });

    // this.refreshData();

    //if (this.dacoService.isLoaded)
    //  this.refreshData();
    //else {
  
    //  this.dacoService.seriveceObservable.subscribe((test) => {
    //    alert(test);
    //    this.refreshData();
    //  });
    //  this.dacoService.setupDacoContract();

   // }

    const searchInput = jQuery('#table-search-input, #search-countries');
    searchInput
      .focus((e) => {
        jQuery(e.target).closest('.input-group').addClass('focus');
      })
      .focusout((e) => {
        jQuery(e.target).closest('.input-group').removeClass('focus');
      });

    //count



  }

  watchAccount() {
    this.dacoService.accountsObservable.subscribe((accounts) => {
      this.accounts = accounts;
      //this.model.account = accounts[0];
      this.refreshData();
      this.isLoaded = true;

    });
  }


  async  refreshData() {
   

    try {


      this.members = await this.dacoService.getMembers();
      console.log('Refreshing data', this.members);
      this.ng2TableData = this.members;
      this.onChangeTable(this.config);


      
    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }


  //setStatus(status) {
  //    this.status = status;
  //}

  //async sendCoin() {
  //    if (!this.ERC223Coin) {
  //        this.setStatus('Metacoin is not loaded, unable to send transaction');
  //        return;
  //    }

  //    const amount = this.model.amount;
  //    const receiver = this.model.receiver;

  //    console.log('Sending coins' + amount + ' to ' + receiver);

  //    this.setStatus('Initiating transaction... (please wait)');
  //    try {
  //        const deployedMetaCoin = await this.ERC223Coin.deployed();
  //        const transaction = await deployedMetaCoin.sendCoin.sendTransaction(receiver, amount, { from: this.model.account });

  //        if (!transaction) {
  //            this.setStatus('Transaction failed!');
  //        } else {
  //            this.setStatus('Transaction complete!');
  //        }
  //    } catch (e) {
  //        console.log(e);
  //        this.setStatus('Error sending coin; see log.');
  //    }
  //}

  changePage(page: any, data: Array<any> = this.ng2TableData): Array<any> {
    const start = (page.page - 1) * page.itemsPerPage;
    const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    const columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  changeFilter(data: any, config: any): any {
    if (!config.filtering) {
      return data;
    }

    const filteredData: Array<any> = data.filter((item: any) =>
      item[config.filtering.columnName].match(this.config.filtering.filterString));

    return filteredData;
  }

  onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    const filteredData = this.changeFilter(this.ng2TableData, this.config);
    const sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }






}
