import { Component, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';
import { DOCUMENT } from '@angular/platform-browser';

declare let jQuery: any;


import { TableComponent } from '../shared/components/table/table.component';


import { Router, ActivatedRoute } from '@angular/router';


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
  selector: 'app-application',
  templateUrl: './application.template.html',
  styleUrls: ['./elements.style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ApplicationComponent {

  @ViewChild(TableComponent)
  private tableComponent: TableComponent;


  searchText: string = '';


  columns: Array<any> = [
    { title: 'Заявитель', name: 'addressOwner', sort: false },
    { title: 'Кошелек для сборя средств', name: 'addressWallet', sort: false },
    { title: 'Сумма', name: 'amount', sort: false },
    { title: 'Описание заявки', name: 'description', sort: false },
    { title: 'Ссылка', name: 'link', sort: false },
    { title: 'Дата заявки', name: 'applySince', sort: false },
    { title: 'Количество голосов', name: 'numberOfVotes', sort: false }
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

  accounts: string[];
  members: any[] = [];
  isLoaded: boolean = false;
  countsView: StatsViewModel[];

  addressWallet: any;
  amountGoal: any;
  descriptionOfCampaign: any;
  linkOfCampaign: any;

  lookTransactionButton: boolean = false;
  transactionLink: string = '';


  private counts: any[] = [];
  private isURLparameters: boolean = false;


  status = '';

  date: any = new Date( Date.now());
  datepickerOpts: any = null;



  constructor(

    private dacoService: DacoService,
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    private route: ActivatedRoute

  ) {
    console.log('Constructor: ' + ' Application');

  }

  async ngOnInit() {

    console.log(this.router.url);
    if (this.route.snapshot.queryParamMap.get('address')) {
      this.isURLparameters = true;
      this.addressWallet = this.route.snapshot.queryParamMap.get('address');
      this.amountGoal = this.route.snapshot.queryParamMap.get('amount');
      this.descriptionOfCampaign = this.route.snapshot.queryParamMap.get('descr');
      this.linkOfCampaign = this.route.snapshot.queryParamMap.get('link');
      this.date = new Date( Date.parse(this.route.snapshot.queryParamMap.get('date')));
    }

    //this.datepickerOpts = {
    //  startDate: Date.now,
    //  autoclose: true,
    //  todayBtn: 'linked',
    //  todayHighlight: true,
    //  assumeNearbyYear: true
    //}
   // this.date = new Date(2016, 5, 10);
    this.datepickerOpts = {
      startDate: new Date(2016, 5, 10),
      autoclose: true,
      todayBtn: 'linked',
      todayHighlight: true,
      assumeNearbyYear: true,
      format: 'D, d MM yyyy',
      hideIcon: false

    }

    if (this.dacoService.web3) {
      await this.dacoService.setupDacoContract();
    }
    else {
      if (this.router.url == '/application')
        this.router.navigate(['/faq']);
      else
        this.router.navigate(['/app/faq']);
    };
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


      this.members = await this.dacoService.getProposals();
      this.tableComponent.refreshData(this.members);
      console.log('Refreshing data');


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }

  async sendData() {

    debugger;
    var result = await this.dacoService.newProposal(this.addressWallet, this.amountGoal, this.descriptionOfCampaign, this.linkOfCampaign, this.date.getTime()/1000);
    this.transactionLink = result.tx;
    this.lookTransactionButton = true;


   

  }

  lookData() {
  
    window.open("https://rinkeby.etherscan.io/tx/" + this.transactionLink, "_blank");
  



  }














}
