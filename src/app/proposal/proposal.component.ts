import { Component, ViewChild } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';
import { tableData } from './tables-dynamic.data';
declare let jQuery: any;


import { TableComponent } from '../shared/components/table/table.component';



export class StatsViewModel {

  public number: number = 0;
  public colour: string = 'primary';
  public type: string = 'fa-bell-o';
  public comments: string = 'Delegates';


}


export class Counts {

  public items: number = 0;
  public Proposal: number = 0;
  public CampaignKnown: number = 0;
  public CampaignCompleted: number = 0;
  public CampaignAll: number = 0;

}




@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.template.html'
})
export class ProposalComponent {

  @ViewChild(TableComponent)
  private tableComponent: TableComponent;


  searchText: string = '';


  columns: Array<any> = [
    { title: 'Amount ETH', name: 'amount', sort: false, type: 'text'},
    { title: 'Description', name: 'description', sort: false, type: 'infolink'},
    { title: 'Link', name: 'link', sort: false, type: 'descriptionlink' },
    { title: 'Application date', name: 'applySince', sort: false, type: 'text' },
    { title: 'Finish date', name: 'endDate', sort: false, type: 'text'}
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
  countsView: StatsViewModel[];


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

      await this.refreshData();
      this.watchAccount();
    };
    //await this.refreshData();


  }

  watchAccount() {
    this.dacoService.accountsObservable.subscribe(async (accounts) => {
      this.accounts = accounts;
      //await this.dacoService.test;
      //var member = await this.dacoService.getMember(this.accounts[0]);
      //var isMember =

        
      var member = await this.dacoService.getMember(accounts[0]);
      //console.log('Refreshing data');
      //this.ng2TableData = this.tableData;
      var isMember = member.isMember;

      if (isMember) {
        this.columns.push({ title: 'Vote', name: 'vote', sort: false, type: 'vote'});
      }

      //this.model.account = accounts[0];
      this.refreshData();
      this.isLoaded = true;

    });
  }


  async  refreshData() {


    try {
      this.items = await this.dacoService.getProposals();
      console.log('Refreshing data items=', this.items);
      this.tableComponent.refreshData(this.items);
    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }













}
