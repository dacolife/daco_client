import { Component, ViewChild } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';

declare let jQuery: any;


import { TableComponent } from '../shared/components/table/table.component';









@Component({
  selector: 'app-campaign-known',
  templateUrl: './campaign-known.template.html'
})
export class CampaignKnownComponent {

  @ViewChild(TableComponent)
  private tableComponent: TableComponent;


  searchText: string = '';


  columns: Array<any> = [
    { title: 'Заявитель', name: 'addressOwner', sort: false },
    //{ title: 'Кошелек для сборя средств', name: 'addressWallet', sort: false },
    { title: 'Сумма', name: 'amount', sort: false },
    { title: 'Описание кампании', name: 'description', sort: false },
    { title: 'Ссылка', name: 'link', sort: false },
    { title: 'Дата заявки', name: 'proposalSince', sort: false },
    { title: 'Дата кампании', name: 'campaignSince', sort: false },
    { title: 'Дата окончания', name: 'endDate', sort: false }
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


  private counts: any[] = [];


  status = '';



  constructor(

    private dacoService: DacoService
  ) {
    console.log('Constructor: ' + 'ProposalComponent');

  }

  async ngOnInit() {

    await this.dacoService.setupDacoContract();
    await this.refreshData();


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


      this.members = await this.dacoService.getСampaignKnown();
      this.tableComponent.refreshData(this.members);
      console.log('Refreshing data');


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }













}
