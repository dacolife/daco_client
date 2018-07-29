import { OnInit, Input, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Routes, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';





import { Component } from '@angular/core';
import { Web3Service } from '../../../util/web3.service';
import { DacoService } from '../../../util/daco.sevice';
import { count } from 'rxjs/operator/count';
import { debug } from 'util';

declare let jQuery: any;




declare let require: any;

const metacoin_artifacts = require('../../../../../build/contracts/DACOMain.json');



@Component({
  selector: 'dacotable',
  templateUrl: './table.component.html'
})
export class TableComponent {



  router: Router;
  location: Location;
  $el: any;

  @Input() ng2TableData: Array<any>;
  @Input() columns: Array<any>;




  searchText: string = '';



  rows: Array<any> = [];

  page: number = 1;
  itemsPerPage: number = 10;
  maxSize: number = 5;
  numPages: number = 1;
  length: number = 0;
  account: any = null;
  test: any = null;

  config: any = {
    paging: true,
    sorting: { columns: this.columns },
    //filtering: { filterString: '', columnName: 'status' }
  };

  //ng2TableData: Array<any> ;



  accounts: string[];
  ERC223Coin: any;

  isLoaded: boolean = false;
  isMember: boolean = false;



  private counts: any[] = [];


  status = '';



  constructor(
    private web3Service: Web3Service
    , private dacoService: DacoService,
    router: Router, //location: Location,
    el: ElementRef
  ) {
    console.log('Constructor: ' + 'TableComponent');
    var ewr = metacoin_artifacts;
    this.$el = jQuery(el.nativeElement);
    this.router = router;
   // this.location = location;
  }

  async ngOnInit() {

    if (this.dacoService.web3) {
      this.dacoService.setupDacoContract();
      await this.dacoService.test;
      var members = await this.dacoService.getMembers();
      //debugger;
      this.watchAccount();
    }



    const searchInput = jQuery('#table-search-input, #search-countries');
    searchInput
      .focus((e) => {
        jQuery(e.target).closest('.input-group').addClass('focus');
      })
      .focusout((e) => {
        jQuery(e.target).closest('.input-group').removeClass('focus');
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.changeActiveNavigationItem(this.location);
      }
    });
  }

  changeActiveNavigationItem(location): void {
    //const $newActiveLink = this.$el.find('a[href="#' + location.path().split('?')[0] + '"]');

    //// collapse .collapse only if new and old active links belong to different .collapse
    //if (!$newActiveLink.is('.active > .collapse > li > a')) {
    //  this.$el.find('.active .active').closest('.collapse').collapse('hide');
    //}
    //this.$el.find('.sidebar-nav .active').removeClass('active');

    //$newActiveLink.closest('li').addClass('active')
    //  .parents('li').addClass('active');

    //// uncollapse parent
    //$newActiveLink.closest('.collapse').addClass('in').css('height', '')
    //  .siblings('a[data-toggle=collapse]').removeClass('collapsed');
  }

   watchAccount() {

    //var member = await this.dacoService.getMember(this.account);
    this.dacoService.accountsObservable.subscribe(async (accounts) => {

      let result = await this.dacoService.test;
      debugger;
  
      this.account = accounts[0];
      this.refresh(this.account);
      this.isLoaded = true;
     // this.refreshData();

    });
  }



  public async refresh(address) {


    try {


      var member = await this.dacoService.getMember(address);
      //console.log('Refreshing data');
      //this.ng2TableData = this.tableData;
      this.isMember = member.isMember;
      debugger;
      this.onChangeTable(this.config);



    } catch (e) {
      console.log(e);
      //this.setStatus('Error getting balance; see log.');
    }
  }


  public refreshData(items: any[]) {


    try {


      //this.tableData = await this.dacoService.getMembers();
      //console.log('Refreshing data');
      //this.ng2TableData = this.tableData;
      this.ng2TableData = items;
      
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


