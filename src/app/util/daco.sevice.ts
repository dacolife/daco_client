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
  private accounts: string[];
  public ready = false;
  public DacoInstance: any;
  public accountsObservable = new Subject<string[]>();
  public seriveceObservable = new Subject<string>();
  private deployedDaco = null;

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
    // alert(1);
    this.watchAccount();
   
  };



  public async setupDacoContract() {

    this.deployedDaco = await this.web3Service.DacoInstance.deployed();
   // this.metaCoinInstance = await this.web3Service.MetaCoin.deployed();
    //this.deployedDaco = await this.DacoInstance.deployed();
    this.seriveceObservable.next('6666');


    this.isLoaded = true;

  


   
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
  
      // this.accountsObservable.next(accounts);
      this.setupDacoContract();
     
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


      var metaCoinBalance = await this.deployedDaco.numMembers.call();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return metaCoinBalance;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }

  }

  async getNumProposals() {

    try {


      var metaCoinBalance = await this.deployedDaco.numProposals.call();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return metaCoinBalance;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getNumCampaigns() {

    try {


      var metaCoinBalance = await this.deployedDaco.numCampaigns.call();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return metaCoinBalance;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }

  async getNumFinishedCampaigns() {

    try {

      var metaCoinBalance = await this.deployedDaco.numFinishedCampaigns.call();
      // const decimals = await deployedMetaCoin.decimals.call();
      //console.log('Found balance: ' + metaCoinBalance);
      //this.model.balance = metaCoinBalance;
      return metaCoinBalance;

    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }


  async getMembers() {

    try {



      var numMembers = await this.deployedDaco.numMembers();//узнать число участников
     var  members: any[] = []; 
      for (var i = 0; i < numMembers.c[0]; i++) {
        var address = await this.deployedDaco.membersAddr(i); //узнать адрес по номеру участника
 
        var data = await this.deployedDaco.getMember(address); //узнать инфу участника по адресу
        //this.deployedDaco.getMember(address, function (error, data) {//узнать инфу участника по адресу
        
        members.push({
          status: data[0] ? "Может голосовать" : "Не голосует",
          name: data[2],
          link: data[3] ? data[3].slice(0, 4) == "http" ? data[3] : "http://" + data[3] : data[3],
          // link: data[3].indexOf("http://")<0||data[3].indexOf("https://")<0 ? data[3] : "http://"+data[3]  ,
          memmberSince: new Date(data[4].c[0] * 1000).toLocaleString("ru"),
          memmberSince1: +data[4].c[0],
          campaignNew: data[5].c[0],
          campaignCompleted: data[6].c[0]
        });

      
      };

      return members;


    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }


  }



}
