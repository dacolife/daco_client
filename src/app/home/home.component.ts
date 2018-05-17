import { Component } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { DacoService } from '../util/daco.sevice';
import { count } from 'rxjs/operator/count';




declare let require: any;

const metacoin_artifacts = require('../../../build/contracts/DACOMain.json');

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
  selector: 'app-home',
  templateUrl: './home.template.html'
})
export class HomeComponent {


  accounts: string[];
  ERC223Coin: any;
  isLoaded: boolean = false;
  countsView: StatsViewModel[] ;

  counts: Counts = new Counts();

  status = '';



  constructor(
    private web3Service: Web3Service
   , private dacoService: DacoService
  ) {
    console.log('Constructor: ' + 'HomeComponent');
    var ewr = metacoin_artifacts;
  }

 async ngOnInit()  {
 
    this.watchAccount();
    await this.dacoService.setupDacoContract();
    await this.refreshData();



   

  }

  watchAccount() {
    this.dacoService.accountsObservable.subscribe((accounts) => {
      console.log("Home watch accounts");
      this.accounts = accounts;
      this.refreshData();

    });
  }


  async  refreshData() {
    console.log('Refreshing data');
    this.counts.Members = await this.dacoService.getNumMembers();
    this.counts.Proposal = await this.dacoService.getNumProposals();
    this.counts.CampaignKnown = await this.dacoService.getNumCampaigns();
    this.counts.CampaignCompleted = await this.dacoService.getNumFinishedCampaigns();

  }









}
