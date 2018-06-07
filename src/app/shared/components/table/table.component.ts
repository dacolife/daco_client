import {  OnInit, Input } from '@angular/core';





import { Component } from '@angular/core';
import { Web3Service } from '../../../util/web3.service';
import { DacoService } from '../../../util/daco.sevice';
import { count } from 'rxjs/operator/count';

declare let jQuery: any;




declare let require: any;

const metacoin_artifacts = require('../../../../../build/contracts/DACOMain.json');



@Component({
  selector: 'dacotable',
  templateUrl: './table.component.html'
})
export class TableComponent {


   data: Array<any> = [
    {
    "name": "Wing",
    "email": "tellus.eu.augue@arcu.com",
    "regDate": "2016-01-09T14:48:34-08:00",
    "city": "Paglieta",
    "age": 25
  },
    {
      "name": "Whitney",
      "email": "sed.dictum@Donec.org",
      "regDate": "2017-01-23T20:09:52-08:00",
      "city": "Bear",
      "age": 32
    },
    {
      "name": "Oliver",
      "email": "mauris@Craslorem.ca",
      "regDate": "2015-11-19T19:11:33-08:00",
      "city": "Bruderheim",
      "age": 31
    },
    {
      "name": "Vladimir",
      "email": "mi.Aliquam@Phasellus.net",
      "regDate": "2015-11-02T07:59:34-08:00",
      "city": "Andenne",
      "age": 50
    },
    {
      "name": "Maggy",
      "email": "ligula@acorciUt.edu",
      "regDate": "2017-02-25T15:42:17-08:00",
      "city": "HomprŽ",
      "age": 24
     },
     {
       "name": "Wing",
       "email": "tellus.eu.augue@arcu.com",
       "regDate": "2016-01-09T14:48:34-08:00",
       "city": "Paglieta",
       "age": 25
     },
     {
       "name": "Whitney",
       "email": "sed.dictum@Donec.org",
       "regDate": "2017-01-23T20:09:52-08:00",
       "city": "Bear",
       "age": 32
     },
     {
       "name": "Oliver",
       "email": "mauris@Craslorem.ca",
       "regDate": "2015-11-19T19:11:33-08:00",
       "city": "Bruderheim",
       "age": 31
     },
     {
       "name": "Vladimir",
       "email": "mi.Aliquam@Phasellus.net",
       "regDate": "2015-11-02T07:59:34-08:00",
       "city": "Andenne",
       "age": 50
     },
     {
       "name": "Maggy",
       "email": "ligula@acorciUt.edu",
       "regDate": "2017-02-25T15:42:17-08:00",
       "city": "HomprŽ",
       "age": 24
     },
     {
       "name": "Wing",
       "email": "tellus.eu.augue@arcu.com",
       "regDate": "2016-01-09T14:48:34-08:00",
       "city": "Paglieta",
       "age": 25
     },
     {
       "name": "Whitney",
       "email": "sed.dictum@Donec.org",
       "regDate": "2017-01-23T20:09:52-08:00",
       "city": "Bear",
       "age": 32
     },
     {
       "name": "Oliver",
       "email": "mauris@Craslorem.ca",
       "regDate": "2015-11-19T19:11:33-08:00",
       "city": "Bruderheim",
       "age": 31
     },
     {
       "name": "Vladimir",
       "email": "mi.Aliquam@Phasellus.net",
       "regDate": "2015-11-02T07:59:34-08:00",
       "city": "Andenne",
       "age": 50
     },
     {
       "name": "Maggy",
       "email": "ligula@acorciUt.edu",
       "regDate": "2017-02-25T15:42:17-08:00",
       "city": "HomprŽ",
       "age": 24
     },
     {
       "name": "Wing",
       "email": "tellus.eu.augue@arcu.com",
       "regDate": "2016-01-09T14:48:34-08:00",
       "city": "Paglieta",
       "age": 25
     },
     {
       "name": "Whitney",
       "email": "sed.dictum@Donec.org",
       "regDate": "2017-01-23T20:09:52-08:00",
       "city": "Bear",
       "age": 32
     },
     {
       "name": "Oliver",
       "email": "mauris@Craslorem.ca",
       "regDate": "2015-11-19T19:11:33-08:00",
       "city": "Bruderheim",
       "age": 31
     },
     {
       "name": "Vladimir",
       "email": "mi.Aliquam@Phasellus.net",
       "regDate": "2015-11-02T07:59:34-08:00",
       "city": "Andenne",
       "age": 50
     },
     {
       "name": "Maggy",
       "email": "ligula@acorciUt.edu",
       "regDate": "2017-02-25T15:42:17-08:00",
       "city": "HomprŽ",
       "age": 24
     }
   ];

  @Input() ng2TableData: Array<any>;
  @Input() columns: Array<any> ;




  searchText: string = '';



  rows: Array<any> = [];

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

  //ng2TableData: Array<any> ;



  accounts: string[];
  ERC223Coin: any;

  isLoaded: boolean = false;
  


  private counts: any[] = [];


  status = '';



  constructor(
    private web3Service: Web3Service
    , private dacoService: DacoService
  ) {
    console.log('Constructor: ' + 'TableComponent');
    var ewr = metacoin_artifacts;
  }

   ngOnInit()  {

    //this.watchAccount();
    //await this.dacoService.setupDacoContract();
    //await this.refreshData();
 

    const searchInput = jQuery('#table-search-input, #search-countries');
    searchInput
      .focus((e) => {
        jQuery(e.target).closest('.input-group').addClass('focus');
      })
      .focusout((e) => {
        jQuery(e.target).closest('.input-group').removeClass('focus');
      });

    //count



  }

  watchAccount() {
    //this.dacoService.seriveceObservable.subscribe((test) => {
    //  //this.accounts = accounts;
    //  //this.model.account = accounts[0];
    //  this.refreshData();
    //  this.isLoaded = true;

    //});
  }


  public refreshData(members: any[]) {


    try {


      //this.tableData = await this.dacoService.getMembers();
      //console.log('Refreshing data');
      //this.ng2TableData = this.tableData;
      this.ng2TableData = members;
      this.onChangeTable(this.config);



    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }


  
  changePage(page: any, data: Array<any> = this.ng2TableData): Array<any> {
    const start = (page.page - 1) * page.itemsPerPage;
    const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }

  changeSort(data: any, config: any): any {
    if (!config.sorting) {
      return data;
    }

    const columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;

    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
      }
    }

    if (!columnName) {
      return data;
    }

    // simple sorting
    return data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });
  }

  changeFilter(data: any, config: any): any {
    if (!config.filtering) {
      return data;
    }

    const filteredData: Array<any> = data.filter((item: any) =>
      item[config.filtering.columnName].match(this.config.filtering.filterString));

    return filteredData;
  }

  onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.itemsPerPage }): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }
    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
    }

    const filteredData = this.changeFilter(this.ng2TableData, this.config);
    const sortedData = this.changeSort(filteredData, this.config);
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
    this.length = sortedData.length;
  }






}


