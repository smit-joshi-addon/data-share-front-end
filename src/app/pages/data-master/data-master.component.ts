// data-master.component.ts
import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DataMaster, RequestType } from '../../model/data-master.model';
import { DataMasterService } from '../../service/data-master/data-master.service';
import { Business } from '../../model/business.model';
import { BusinessService } from '../../service/business/business.service';
import { TokenCellComponent } from './token-cell/token-cell.component';
import { DataDetailService } from '../../service/data-detail/data-detail.service';
import { DataDetailDTO } from '../../model/data-detail.model';


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

  masterSettings = {
    actions: {
      add: false,
      delete: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    columns: {
      sharingId: {
        title: 'ID',
        type: 'number',
      },
      businessId: {
        title: 'Business',
        type: 'number',
        valuePrepareFunction: (businessId) => this.businesses.filter(business => business.businessId === businessId)[0].name
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

  detailSettings = {
    actions: false,
    columns: {
      detailId: {
        title: 'Detail ID',
        type: 'number',
      },
      masterId: {
        title: 'Master ID',
        type: 'number',
      },
      secret: {
        title: 'Secret',
        type: 'custom',
        renderComponent: TokenCellComponent, // Use the custom cell component
      },
      validTill: {
        title: 'Valid Till',
        type: 'string', // You might want to format this in your template
      },
      createdAt: {
        title: 'Created At',
        type: 'string', // You might want to format this in your template
      },
      createdById: {
        title: 'Created By ID',
        type: 'string',
      },
      createdByName: {
        title: 'Created By Name',
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
    },
  };

  masterSource: LocalDataSource = new LocalDataSource();

  detailSource: LocalDataSource = new LocalDataSource();

  newMaster: DataMaster = {
    businessId: 1,
    status: true,
    type: RequestType.PULL,
  };

  constructor(
    private dataMasterService: DataMasterService,
    private businessService: BusinessService,
    private dataDetailService: DataDetailService
  ) { }

  ngOnInit(): void {
    this.loadDataMasters();
    this.loadBusinesses();
    this.loadDataDetails();
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

  loadDataDetails(): void {
    this.dataDetailService.getAllDataDetails().subscribe(
      (data: DataDetailDTO[]) => {
        this.detailSource.load(data);
      },
      error => {
        console.error('Error fetching data details', error);
      }
    );
  }

  loadDataMasters(): void {
    this.dataMasterService.getMasterRecords().subscribe(
      (data: DataMaster[]) => {
        this.masterSource.load(data);
      },
      (error) => console.error('Error loading data masters', error)
    );
  }

  onEditConfirm(event): void {
    this.dataMasterService.updateMasterRecord(event.data.sharingId, event.newData).subscribe(
      (data: DataMaster) => {
        event.confirm.resolve(data);
        this.loadDataMasters(); // Refresh the table data
        this.loadDataDetails(); // Refresh the table data
      },
      (error) => {
        console.error('Error updating data master', error);
        event.confirm.reject();
      }
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
        this.loadDataDetails(); // Refresh the table data
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
