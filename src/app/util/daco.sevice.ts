import { Injectable } from '@angular/core';
//import * as contract from 'truffle-contract';
import { Subject } from 'rxjs/Rx';
declare let require: any;

import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract';

import {  OnInit, Output, EventEmitter } from '@angular/core';



import { Web3Service } from './web3.service';
const daco_artifacts = require('../../../build/contracts/DACOMain.json');





declare let window: any;

@Injectable()
export class DacoService {

  private web3: any;
  private accounts: string[];
  public ready = false;
  public DacoContract: any;
  public accountsObservable = new Subject<string[]>();
  private deployedDaco = null;

  isLoaded: boolean = false;


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
    this.setupDacoContract();
    var ewr = daco_artifacts;
   // alert(1);

    };



  private async setupDacoContract() {

    this.watchAccount();
    this.DacoContract = await this.web3Service.artifactsToContract(daco_artifacts);
    this.deployedDaco = await this.DacoContract.deployed();
      //.then((DacoAbstraction) => {
      //  this.DacoContract = DacoAbstraction;

      //});
    //this.DacoContract = contract(daco_artifacts);
    //this.deployedDaco = await this.DacoContract.deployed();

    //this.web3Service.deployed()
    //  .then((DacoAbstraction) => {
    //    this.DacoContract = DacoAbstraction;
    //  });
    //alert(1);
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      this.accountsObservable.next(accounts);
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


}
