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

  //model = {
  //  amount: 5,
  //  receiver: '',
  //  balance: 0,
  //  account: '',
  //  decimals: 0
  //};

  counts: Counts = new Counts();

  status = '';



  constructor(
    private web3Service: Web3Service
   , private dacoService: DacoService
  ) {
    console.log('Constructor: ' + 'HomeComponent');
    var ewr = metacoin_artifacts;
  }

  ngOnInit(): void {
    //console.log('OnInit: ' + this);
    //console.log(this);
    this.watchAccount();
    this.web3Service.artifactsToContract(metacoin_artifacts)
      .then((MetaCoinAbstraction) => {
        this.ERC223Coin = MetaCoinAbstraction;
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
    console.log('Refreshing data');

    try {


      //const deployedMetaCoin = await this.ERC223Coin.deployed();
      //console.log(deployedMetaCoin);
      //console.log('Account', this.model.account);
      //const metaCoinBalance = await deployedMetaCoin.numCampaigns.call();

      //dacoMainService.numMembers(function (error, data) {//узнать число участников
      //  $scope.counts.members = +data;
      //  $scope.$apply()
      //});

      //dacoMainService.numProposals(function (error, data) {//кол-во предложений
      //  $scope.counts.proposal = +data;
      //  $scope.$apply()
      //});

      //dacoMainService.numCampaigns(function (error, data) {//кол-во предложений
      //  $scope.counts.campaignKnown = +data;
      //  $scope.$apply()
      //});

      //dacoMainService.numFinishedCampaigns(function (error, data) {//кол-во завершенных кампаний
      //  $scope.counts.campaignCompleted = +data;
      //  $scope.$apply()
      //});

      const members = await this.dacoService.getNumMembers()
      this.counts.Members = members.c[0];
      this.counts.Proposal = await this.dacoService.getNumProposals();
      this.counts.CampaignKnown = await this.dacoService.getNumCampaigns();
      this.counts.CampaignCompleted = await this.dacoService.getNumFinishedCampaigns();
     // this.model.campaignKnown = metaCoinBalance;
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







}
