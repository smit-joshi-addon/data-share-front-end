// data-master.component.ts
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DataMaster, RequestType } from '../../model/data-master.model';
import { DataMasterService } from '../../service/data-master/data-master.service';
import { Business } from '../../model/business.model';
import { BusinessService } from '../../service/business/business.service';
import { TokenCellComponent } from './token-cell/token-cell.component';


@Component({
  selector: 'ngx-data-master',
  styleUrls: ['./data-master.component.scss'],
  templateUrl: './data-master.component.html',
})
export class DataMasterComponent implements OnInit {
  starRate = 2;
  heartRate = 4;
  radioGroupValue = 'true'; // Default value for status
  requestTypeValue = RequestType.PULL; // Default value for request type
  requestType = RequestType;
  businesses: Business[] = [];

  settings = {
    actions: false,
    columns: {
      sharingId: {
        title: 'ID',
        type: 'number',
      },
      businessId: {
        title: 'Business ID',
        type: 'number',
      },
      secret: {
        title: 'Secret',
        type: 'custom',
        renderComponent: TokenCellComponent, // Use the custom cell component
      },
      createdById: {
        title: 'Created By ID',
        type: 'string',
      },
      createdByIp: {
        title: 'Created By IP',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'boolean',
      },
      createdAt: {
        title: 'Created At',
        type: 'string',
        valuePrepareFunction: (date) => new Date(date).toLocaleString(),
      },
      updatedAt: {
        title: 'Updated At',
        type: 'string',
        valuePrepareFunction: (date) => new Date(date).toLocaleString(),
      },
      type: {
        title: 'Request Type',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  newMaster: DataMaster = {
    businessId: 1,
    status: true,
    type: RequestType.PULL,
  };

  constructor(
    private dataMasterService: DataMasterService,
    private businessService: BusinessService
  ) { }

  ngOnInit(): void {
    this.loadDataMasters();
    this.loadBusinesses();
  }

  loadBusinesses(): void {
    this.businessService.getBusinesses().subscribe(
      (data: Business[]) => {
        console.log(data);
        this.businesses = data;
      },
      (error) => console.error('Error loading businesses', error)
    );
  }

  loadDataMasters(): void {
    this.dataMasterService.getMasterRecords().subscribe(
      (data: DataMaster[]) => {
        this.source.load(data);
      },
      (error) => console.error('Error loading data masters', error)
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.dataMasterService.deleteMasterRecord(event.data.sharingId).subscribe(
        () => {
          event.confirm.resolve();
          this.loadDataMasters(); // Refresh the table data
        },
        (error) => {
          console.error('Error deleting data master', error);
          event.confirm.reject();
        }
      );
    } else {
      event.confirm.reject();
    }
  }

  onAddMaster(): void {
    this.newMaster.createdAt = new Date().toISOString();
    this.newMaster.updatedAt = new Date().toISOString();

    this.dataMasterService.addMasterRecord(this.newMaster).subscribe(
      (data: DataMaster) => {
        this.loadDataMasters(); // Refresh the table data
        this.resetForm(); // Clear the form
      },
      (error) => console.error('Error creating data master', error)
    );
  }

  resetForm(): void {
    this.newMaster = {
      businessId: 1,
      secret: '',
      createdById: '',
      createdByIp: '',
      status: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: RequestType.PULL,
    };
  }
}
