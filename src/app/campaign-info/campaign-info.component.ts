import { Component, ViewChild } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';
import { Router, ActivatedRoute, Params } from '@angular/router';

declare let jQuery: any;


import { TableComponent } from '../shared/components/table/table.component';









@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html'
})
export class CampaignInfoComponent {

  @ViewChild(TableComponent)
  private tableComponent: TableComponent;


  searchText: string = '';


  columns: Array<any> = [
    //{ title: 'Заявитель', name: 'addressOwner', sort: false,type:'link' },
    //{ title: 'Кошелек для сборя средств', name: 'addressWallet', sort: false },
    { title: 'Сумма', name: 'amount', sort: false, type: 'text' },
    { title: 'Описание кампании', name: 'description', sort: false, type: 'text'},
    { title: 'Ссылка', name: 'link', sort: false,type: 'descriptionlink' },
    { title: 'Дата кампании', name: 'campaignSince', sort: false, type: 'text'},
    { title: 'Дата закрытия', name: 'campaignUntil', sort: false, type: 'text'},
    { title: 'Всего собрано', name: 'finishedAmount', sort: false, type: 'text'},
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
  campaignInfo: any;



  private counts: any[] = [];


  status = '';



  constructor(

    private dacoService: DacoService
    , private route: ActivatedRoute
  ) {
    console.log('Constructor: ' + 'ProposalComponent');

  }

  async ngOnInit() {

    //addressOwner:
    //addressWallet:
    //amount: this.w
    //description: d
    //link: data[1]
    //// link: data[
    //applySince: ne
    //endDate: new D
    //applySinceForC
    //numberOfVotes:
    //hash: hash
    await this.dacoService.setupDacoContract();
   
    // get param
    let param1 = this.route.snapshot.queryParams["hash"];
    let param2 = this.route.snapshot.queryParams["type"];

    switch (param2) {
      case 'proposal': {
        this.campaignInfo = await this.dacoService.getProposalInfo(param1);
        break;
      }
      case 'known': {
        this.campaignInfo = await this.dacoService.getСampaignKnownInfo(param1);
        //statements; 
        break;
      }
      case 'completed': {
        //statements; 
        break;
      }
 
    } 

  
    console.log(param1);



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


      this.members = await this.dacoService.getСampaignCompleted();
      this.tableComponent.refreshData(this.members);
      console.log('Refreshing data');


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }













}
