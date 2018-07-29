import { Injectable, OnInit, Output, EventEmitter } from '@angular/core';


//import { default as Web3 } from 'web3';
declare let require: any;
const Web3 = require('web3');
const contract = require('truffle-contract');

import { WindowRefService } from './window-ref.service';

//declare let require: any;
//import daco_artifacts from '../../../build/contracts/DACOMain.json';
const daco_artifacts = require('../../../build/contracts/DACOMain.json');

//import metacoin_artifacts from '../../build/contracts/MetaCoin.json';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class Web3Service {

  private _web3: any;
  private accounts: any[];
  public DacoInstance: any;

  public accountsObservable = new Subject<string[]>();

  constructor(private windowRef: WindowRefService) {
    this.setupMetacoinContract();
    this.refreshAccounts();
  }

  private setupMetamaskWeb3() {
    if (!this.windowRef.nativeWindow) {
      //throw new Error('Can not get the window');
      return;
    }
    if (!this.windowRef.nativeWindow.web3) {
      //this.router.navigate(['../faq']);
      //throw new Error('Not a metamask browser');
      return;
    }
    this._web3 = new Web3(this.windowRef.nativeWindow.web3.currentProvider);
  }


  get web3(): any {
    return this._web3;
  }

  private setupMetacoinContract() {
    this.setupMetamaskWeb3();
    if (!this._web3)
      return;
    this.DacoInstance = contract(daco_artifacts);
    this.DacoInstance.setProvider(this._web3.currentProvider);
  }

  private refreshAccounts() {
    if (!this._web3)
      return;
    this._web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert(`There was an error fetching your accounts.`);
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length == 0) {
        alert(`Couldn't get any accounts! Make sure your Ethereum client is configured correctly.`);
        return;
      }

      if (!this.accounts || this.accounts.length != accs.length || this.accounts[0] != accs[0]) {
        console.log(`Observed new accounts`);
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }
    });
  }
}
