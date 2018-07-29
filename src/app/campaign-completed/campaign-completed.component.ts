import { Component, ViewChild } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';

declare let jQuery: any;


import { TableComponent } from '../shared/components/table/table.component';









@Component({
  selector: 'app-campaign-completed',
  templateUrl: './campaign-completed.component.html'
})
export class CampaignCompletedComponent {

  @ViewChild(TableComponent)
  private tableComponent: TableComponent;


  searchText: string = '';


  columns: Array<any> = [
    { title: 'Amount ETH', name: 'amount', sort: false, type: 'text' },
    { title: 'Description', name: 'description', sort: false, type: 'text'},
    { title: 'Link', name: 'link', sort: false,type: 'descriptionlink' },
    { title: 'Date', name: 'campaignSince', sort: false, type: 'text'},
    { title: 'Finish date', name: 'campaignUntil', sort: false, type: 'text'},
    { title: 'Report', name: 'report', sort: false, type: 'descriptionlink'}
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
  items: any[] = [];
  isLoaded: boolean = false;


  private counts: any[] = [];


  status = '';



  constructor(

    private dacoService: DacoService
  ) {
    console.log('Constructor: ' + 'ProposalComponent');

  }

  async ngOnInit() {

    if (this.dacoService.web3) {
      await this.dacoService.setupDacoContract();
      await this.dacoService.test;
      await this.refreshData();
      this.watchAccount();
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


      this.items = await this.dacoService.getСampaignCompleted();
      console.log('Refreshing data items=', this.items);
      this.tableComponent.refreshData(this.items);


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }













}
