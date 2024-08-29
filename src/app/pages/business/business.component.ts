import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BusinessService } from '../../service/business/business.service';
import { Business } from '../../model/business.model';

@Component({
  selector: 'ngx-business',
  styleUrls: ['./business.component.scss'],
  templateUrl: './business.component.html',
})
export class BusinessComponent implements OnInit {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      businessId: {
        title: 'ID',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  business: Business = {
    businessId: 0,
    name: '',
    username: '',
    password: ''
  };

  constructor(private businessService: BusinessService) { }

  ngOnInit(): void {
    this.loadBusinesses();
  }

  loadBusinesses(): void {
    this.businessService.getBusinesses().subscribe(
      (data: Business[]) => {
        this.source.load(data);
      },
      error => console.error('Error loading businesses', error)
    );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.businessService.deleteBusiness(event.data.businessId).subscribe(
        () => {
          event.confirm.resolve();
          this.loadBusinesses(); // Refresh the table data
        },
        error => {
          console.error('Error deleting business', error);
          event.confirm.reject();
        }
      );
    } else {
      event.confirm.reject();
    }
  }

  onEditConfirm(event): void {
    console.log(event.newData);
    this.businessService.updateBusiness(event.data.businessId, event.newData).subscribe(
      (data: Business) => {
        event.confirm.resolve(data);
        this.loadBusinesses(); // Refresh the table data
      },
      error => {
        console.error('Error updating business', error);
        event.confirm.reject();
      }
    );
  }

  addBusiness(): void {
    this.businessService.addBusiness(this.business).subscribe(
      (data: Business) => {
        this.loadBusinesses(); // Refresh the table data
        this.resetForm(); // Clear the form
      },
      error => {
        console.error('Error creating business', error);
      }
    );
  }

  resetForm(): void {
    this.business = {
      businessId: 0,
      name: '',
      username: '',
      password: ''
    };
  }
}
