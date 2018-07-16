import { Injectable } from '@angular/core';
//import * as contract from 'truffle-contract';
import { Subject } from 'rxjs/Rx';
declare let require: any;

import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import { OnInit, Output, EventEmitter } from '@angular/core';



import { Web3Service } from './web3.service';
const daco_artifacts = require('../../../build/contracts/DACOMain.json');






declare let window: any;

@Injectable()
export class DacoService {

  private web3: any;
  public test: any = null;
  private accounts: string[];
  public ready = false;
  public DacoInstance: any;
  public accountsObservable = new Subject<string[]>();
  public seriveceObservable = new Subject<string>();
  public deployedDaco = null;

  public isLoaded: boolean = false;




  model = {
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    decimals: 0
  };
  status = '';




  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + 'Daco');
    //this.setupDacoContract();
    //var ewr = daco_artifacts;
    this.web3 = web3Service.web3;
    // alert(1);
    this.setupDacoContract();
    this.watchAccount();

  };

  public tDaco: any;

  public async ttt() {
    console.log("run ttt");
    return this.pF().then((r) => {
        console.log("set tDaco");
        this.tDaco = r;
    });
  }

  private pF() {
      console.log("run pF");
      return new Promise((resolve, reject) => {
          console.log("run setTimeout");
          setTimeout(() => {
            console.log("run resolve");
            resolve(77);
          }, 10000);
      })
  }



  public async setupDacoContract() {

   // this.deployedDaco = await this.web3Service.DacoInstance.deployed().than(() => resul);
    return this.web3Service.DacoInstance.deployed()
      .then((DacoAbstraction) => {
        this.deployedDaco = DacoAbstraction;
      });
    // this.metaCoinInstance = await this.web3Service.MetaCoin.deployed();
    //this.deployedDaco = await this.DacoInstance.deployed();
    //this.seriveceObservable.next('6666');


    //this.isLoaded = true;





    //.then((DacoAbstraction) => {
    //  this.DacoContract = DacoAbstraction;

    //});
    //this.DacoContract = contract(daco_artifacts);
    //this.deployedDaco = await this.DacoContract.deployed();

    //this.web3Service.deployed()
    //  .then((DacoAbstraction) => {
    //    this.DacoContract = DacoAbstraction;
    //  });

    //this.seriveceObservable.next('6666');
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
     
      this.accounts = accounts;
      console.log("watch account. daco service");
       this.accountsObservable.next(accounts);
      //this.setupDacoContract();

    });
  }


  async refreshData() {
    console.log('Refreshing data');

    try {

      //const metaCoinBalance = await this.deployedDaco.numCampaigns.call();
      // this.model.balance = metaCoinBalance;
    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }


  //.numMembers();
  //e.numProposals();
  //ervice.numCampaigns();
  //acoService.numFinishedCampaigns();

  //balanceOf
  async getNumMembers() {

    try {


      var num = await this.deployedDaco.numMembers();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return num;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }

  }

  async getNumProposals() {

    try {


      var num = await this.deployedDaco.numProposals();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return num;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getNumCampaigns() {

    try {


      var num = await this.deployedDaco.numCampaigns();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return num;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getNumFinishedCampaigns() {

    try {

      var num = await this.deployedDaco.numFinishedCampaigns();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return num;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }


  async getMembers() {

    try {



      var numMembers = await this.getNumMembers();//узнать число участников
      var members: any[] = [];
      for (var i = 0; i < numMembers.c[0]; i++) {
        var address = await this.deployedDaco.membersAddr(i); //узнать адрес по номеру участника

        var data = await this.deployedDaco.getMember(address); //узнать инфу участника по адресу
        var member = await this.getMember(address); {//узнать инфу участника по адресу

          members.push(member);


        };
      }
      return members;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }



  async getProposals() {

    try {


      var numProposals = await this.deployedDaco.numProposals();//узнать число участников
      var items: any[] = [];
      for (var i = 0; i < numProposals.c[0]; i++) {
        var hash = await this.deployedDaco.proposalsHash(i); //узнать адрес по номеру участника


        var dat = await this.deployedDaco.getCampaignCommonInfo(hash); //узнать инфу участника по адресу
        var data = await this.deployedDaco.getCampaignProposalInfo(hash); //узнать инфу участника по адресу



        items.push({
          addressOwner: dat[3],
          addressWallet: dat[4],
          amount: this.web3.utils.fromWei(dat[5].toFixed(), "ether"),
          //amount: dat[5].c[0]/10000,
          description: dat[6],
          link: data[1] ? data[1].slice(0, 4) == "http" ? data[1] : "http://" + data[1] : data[1],
          // link: data[1].indexOf("http://")<0||data[1].indexOf("https://")<0 ? data[1] : "http://"+data[1] ,
          applySince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
          endDate: new Date(dat[4].c[0] * 1000).toLocaleString("ru"),
          applySinceForCompare: +data[4].c[0],
          numberOfVotes: data[3].c[0],
          number: i,
          hash: hash

        });


      };

      return items;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getProposalInfo(hash) {

    try {

        var dat = await this.deployedDaco.getCampaignCommonInfo(hash); //узнать инфу участника по адресу
        var data = await this.deployedDaco.getCampaignProposalInfo(hash); //узнать инфу участника по адресу


      //will be changed to typescript objects
      var item = {

          addressOwner: dat[3],
          //addressWallet: dat[4],
          amount: this.web3.utils.fromWei(dat[5].toFixed(), "ether"),
          description: dat[6],
          link: data[1] ? data[1].slice(0, 4) == "http" ? data[1] : "http://" + data[1] : data[1],
          // link: data[1].indexOf("http://")<0||data[1].indexOf("https://")<0 ? data[1] : "http://"+data[1] ,
          applySince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
          endDate: new Date(dat[4].c[0] * 1000).toLocaleString("ru"),
          applySinceForCompare: +data[4].c[0],
          numberOfVotes: data[3].c[0],
          hash: hash

        };

      return item;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getСampaignKnown() {

    try {

      //dacoMainService.numCampaigns(function (error, data) {//кол-во предложений
      //  $scope.countsCampaign = data.c[0];
      //  for (var i = 0; i < $scope.countsCampaign; i++) {
      //    (function (i) {
      //      dacoMainService.campaignsAddr(i, function (error, data) {//адрес заявки/кашелька из порядкового номера
      //        var datta = data;
      //        dacoMainService.getCampaignCommonInfo(datta, function (error, data) {//инфа общая
      //          var dat = data;
      //          dacoMainService.getCampaignActiveInfo(datta, function (error, data) {//инфа заявки
      //            $scope.items.push({
      //              addressOwner: dat[3],
      //              addressWallet: dat[4],
      //              amount: dat[5].c[0],
      //              description: dat[6],
      //              number: i,
      //              link: data[1] ? data[1].slice(0, 4) == "http" ? data[1] : "http://" + data[1] : data[1],
      //              // link: data[1].indexOf("http://")<0||data[1].indexOf("https://")<0 ? data[1] : "http://"+data[1] ,
      //              proposalSince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
      //              proposalSinceForCompare: +data[4].c[0],
      //              campaignSince: data[5].c[0] ? new Date(data[5].c[0] * 1000).toLocaleString("ru") : "Неизвестна"
      //            });

      //            function compareDate(dateA, dateB) {
      //              return dateA.proposalSinceForCompare - dateB.proposalSinceForCompare;
      //            }
      //            $scope.items.sort(compareDate);
      //            $scope.$apply();
      //          });
      //          $scope.$apply();
      //        });
      //      });
      //    })(i);
      //  }
      //});



      var numProposals = await this.deployedDaco.numCampaigns();//узнать число участников
      var items: any[] = [];
      for (var i = 0; i < numProposals.c[0]; i++) {
        var hash = await this.deployedDaco.campaignsHash(i); //узнать адрес по номеру участника


        var dat = await this.deployedDaco.getCampaignCommonInfo(hash); //узнать инфу участника по адресу
        var data = await this.deployedDaco.getCampaignActiveInfo(hash); //узнать инфу участника по адресу



        items.push({
          addressOwner: dat[3],
          addressWallet: dat[4],
          //amount: dat[5].c[0],
          amount: this.web3.utils.fromWei(dat[5].toFixed(), "ether"),
          description: dat[6],
          number: i,
          link: data[1] ? data[1].slice(0, 4) == "http" ? data[1] : "http://" + data[1] : data[1],
          // link: data[1].indexOf("http://")<0||data[1].indexOf("https://")<0 ? data[1] : "http://"+data[1] ,
          proposalSince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
          proposalSinceForCompare: +data[4].c[0],
          endDate: new Date(dat[4].c[0] * 1000).toLocaleString("ru"),
          campaignSince: data[5].c[0] ? new Date(data[5].c[0] * 1000).toLocaleString("ru") : "Неизвестна",
          donationContract: data[6],
          hash: hash
        });
      };

      return items;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getСampaignKnownInfo(hash) {

    try {

  
      

      var dat = await this.deployedDaco.getCampaignCommonInfo(hash); //узнать инфу участника по адресу
      var data = await this.deployedDaco.getCampaignActiveInfo(hash); //узнать инфу участника по адресу



      var  item={
          addressOwner: dat[3],
          //addressWallet: dat[4],
          //amount: dat[5].c[0],
          amount: this.web3.utils.fromWei(dat[5].toFixed(), "ether"),
          description: dat[6],
          link: data[1] ? data[1].slice(0, 4) == "http" ? data[1] : "http://" + data[1] : data[1],
          // link: data[1].indexOf("http://")<0||data[1].indexOf("https://")<0 ? data[1] : "http://"+data[1] ,
          proposalSince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
          proposalSinceForCompare: +data[4].c[0],
          endDate: new Date(dat[4].c[0] * 1000).toLocaleString("ru"),
          campaignSince: data[5].c[0] ? new Date(data[5].c[0] * 1000).toLocaleString("ru") : "Неизвестна"
        };
    

      return item;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }


  async getСampaignCompleted() {

    try {

      //dacoMainService.numCampaigns(function (error, data) {//кол-во предложений
      //  $scope.countsCampaign = data.c[0];
      //  for (var i = 0; i < $scope.countsCampaign; i++) {
      //    (function (i) {
      //      dacoMainService.campaignsAddr(i, function (error, data) {//адрес заявки/кашелька из порядкового номера
      //        var datta = data;
      //        dacoMainService.getCampaignCommonInfo(datta, function (error, data) {//инфа общая
      //          var dat = data;
      //          dacoMainService.getCampaignActiveInfo(datta, function (error, data) {//инфа заявки
      //            $scope.items.push({
      //              addressOwner: dat[3],
      //              addressWallet: dat[4],
      //              amount: dat[5].c[0],
      //              description: dat[6],
      //              number: i,
      //              link: data[1] ? data[1].slice(0, 4) == "http" ? data[1] : "http://" + data[1] : data[1],
      //              // link: data[1].indexOf("http://")<0||data[1].indexOf("https://")<0 ? data[1] : "http://"+data[1] ,
      //              proposalSince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
      //              proposalSinceForCompare: +data[4].c[0],
      //              campaignSince: data[5].c[0] ? new Date(data[5].c[0] * 1000).toLocaleString("ru") : "Неизвестна"
      //            });

      //            function compareDate(dateA, dateB) {
      //              return dateA.proposalSinceForCompare - dateB.proposalSinceForCompare;
      //            }
      //            $scope.items.sort(compareDate);
      //            $scope.$apply();
      //          });
      //          $scope.$apply();
      //        });
      //      });
      //    })(i);
      //  }
      //});



      var numProposals = await this.deployedDaco.numFinishedCampaigns();//узнать число участников
      var items: any[] = [];
      for (var i = 0; i < numProposals.c[0]; i++) {
        var address = await this.deployedDaco.finishedCampaignsAddr(i); //узнать адрес по номеру участника


        var dat = await this.deployedDaco.getCampaignCommonInfo(address); //узнать инфу участника по адресу
        var data = await this.deployedDaco.getCampaignFinishedInfo(address); //узнать инфу участника по адресу



        items.push({
          addressOwner: dat[3],
          addressWallet: dat[4],
          //amount: dat[5].c[0],
          amount: this.web3.utils.fromWei(dat[5].toFixed(), "ether"),
          description: dat[6],
          number: +i,
          link: data[0] ? data[0].slice(0, 4) == "http" ? data[0] : "http://" + data[0] : data[0],
          // link: data[0].indexOf("http://")<0||data[0].indexOf("https://")<0 ?  data[0] :"http://"+data[0],
          campaignSince: data[2].c[0] ? new Date(data[2].c[0] * 1000).toLocaleString("ru") : "Неизвестна",
          campaignUntil: data[3].c[0] ? new Date(data[3].c[0] * 1000).toLocaleString("ru") : "Неизвестна",
          finishedAmount: data[4].c[0] ? data[4].c[0] : "Неизвестно",
          report: data[5],
          donationContract: data[6]
        });
      };

      return items;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async newProposal(addressWallet, amountGoal, descriptionOfCampaign, linkOfCampaign,time) {

    try {

      //only for testing just 1 wallet and amount
      var wallets = [];
      wallets.push(addressWallet);
      //wallets.push(addressWallet);
      var amounts = [];
      var saf = this.web3.utils.toWei(amountGoal, 'ether').toString();
      debugger;
      amounts.push(saf);
      //amounts.push(amountGoal + 1);
      var enddate = 1526710599;
      // debugger;
      if (this.accounts[0])
      var items = await this.deployedDaco.newProposal(wallets, amounts, time, descriptionOfCampaign, linkOfCampaign, { from: this.accounts[0] });


      return items;


    } catch (e) {
      console.log(e);

    }


  }



  async getMember  (address) {

    try {






      var data = await this.deployedDaco.getMember(address); //узнать инфу участника по адресу
      //debugger;
      var member = {
        status: data[0] ? "Может голосовать" : "Не голосует",
        address: address,
        isMember: data[1],
        name: data[2],
        link: data[3] ? data[3].slice(0, 4) == "http" ? data[3] : "http://" + data[3] : data[3],
        // link: data[3].indexOf("http://")<0||data[3].indexOf("https://")<0 ? data[3] : "http://"+data[3]  ,
        memberSince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
        memberSince1: +data[4].c[0],
        campaignNew: data[5].c[0],
        campaignCompleted: data[6].c[0]
      };

      return member;


    } catch (e) {
      console.log(e);

    }


  }


}
