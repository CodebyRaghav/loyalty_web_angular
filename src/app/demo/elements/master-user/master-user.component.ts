import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { MasterUserService } from 'src/app/services/master-user-service/master-user.service';
import { AddTransactionComponent } from '../add-Transaction/add-transaction/add-transaction.component';
import { UserHistoryComponent } from '../user-history/user-history.component';

@Component({
  selector: 'app-master-user',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, FormsModule, ReactiveFormsModule, UserHistoryComponent, AddTransactionComponent],
  templateUrl: './master-user.component.html',
  styleUrl: './master-user.component.scss'
})
export class MasterUserComponent implements OnInit {
  ColumnMode = ColumnMode;
  showPopup: boolean = false;
  showViewHistoryModal = false;
  showAddTransactionModal = false;
  userHcode: number;

  // selectedRow: any = null;
  searchHistoryList = [];
  statusList = [
    { key: 'active', label: 'Active' },
    { key: 'inactive', label: 'Inactive' }
  ];
  tierList = [];
  // bothFieldsError: boolean = false;
  datesError: boolean = false;

  constructor(
    private fb: FormBuilder,

    private masterUserSvc: MasterUserService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  filterUsersForm = this.fb.group({
    status: [''],
    current_tier_name: [''],
    date_from: [''],
    date_to: [''],
    username: ['']
  });

  editUserForm = this.fb.group({
    id: [0],
    current_tier_name: [''],
    status: [''],
    // add_points: [0, [Validators.min(0), Validators.max(99999999999)]],
    // deduct_points: [0, [Validators.min(0), Validators.max(99999999999)]],
    user_hcode: [null]
  });

  ngOnInit(): void {
    this.getTierList();
    this.getHistoryList(this.filterUsersForm.value);
  }

  getTierList() {
    this.masterUserSvc.GetTiersList().subscribe({
      next: (resp) => {
        this.loaderService.hide();
        this.tierList = resp.data;
        console.log('Tier List: ', this.tierList);
      },
      error: (err) => {
        this.loaderService.hide();
        this.toastr.error(err.error.message, 'Error');
      }
    });
  }

  getHistoryList(formVal: any) {
    this.masterUserSvc.GetUserList(formVal).subscribe({
      next: (resp) => {
        this.loaderService.hide();
        if (resp.status && resp.data) {
          this.searchHistoryList = resp.data;
        } else {
          this.searchHistoryList = [];
          this.toastr.error(resp.message, 'Error');
        }
      },
      error: (err) => {
        this.loaderService.hide();
        // console.log("Error: ", err);
        this.searchHistoryList = [];
        this.toastr.error(err.error.message, 'Error');
      }
    });
  }

  onSearchButton() {
    this.filterUsersForm.markAllAsTouched();
    if (this.filterUsersForm.value.date_from && this.filterUsersForm.value.date_to) {
      const fromDate = moment(this.filterUsersForm.value.date_from);
      const toDate = moment(this.filterUsersForm.value.date_to);

      if (fromDate.isBefore(toDate)) {
        this.datesError = false;
      } else {
        this.datesError = true;
      }
    }
    if (this.filterUsersForm.valid && !this.datesError) {
      this.getHistoryList(this.filterUsersForm.value);
    }
  }

  openPopup(row: any): void {
    // this.selectedRow = row;
    this.getTierList();
    this.editUserForm.patchValue({
      id: row.id,
      current_tier_name: row.current_tier_name,
      status: row.status,
      user_hcode: row.user_hcode
    });
    console.log('Edit form: ', this.editUserForm.value);
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.showAddTransactionModal = false;
    this.showViewHistoryModal = false;
    this.editUserForm.reset({
      id: 0,
      current_tier_name: '',
      status: ''
      // add_points: 0,
      // deduct_points: 0
    });
    // this.selectedRow = null;
  }

  onSubmitEditForm(): void {
    this.editUserForm.markAllAsTouched();
    let formVal = this.editUserForm.value;
    // if (formVal.add_points != null && formVal.deduct_points != null) {
    //   this.bothFieldsError = true;
    // } else {
    //   this.bothFieldsError = false;
    // }
    if (this.editUserForm.valid) {
      this.masterUserSvc.UpdateUserInfo(formVal).subscribe({
        next: (resp) => {
          this.loaderService.hide();
          if (resp.status) {
            this.toastr.success(resp.message, 'Success');
            this.closePopup();
          } else {
            this.toastr.error(resp.message, 'Error');
          }
        },
        error: (err) => {
          this.loaderService.hide();
          this.toastr.error(err.error.message, 'Error');
        }
      });
    }
  }

  openAddTransactionModal(row: any) {
    this.userHcode = row.user_hcode;
    this.showAddTransactionModal = true;
  }

  openViewHistoryModal(row: any) {
    // this.selectedRow = row;
    this.userHcode = row.user_hcode;
    console.log('user HCODE', this.userHcode);
    if (this.userHcode) {
      this.showViewHistoryModal = true;
    }
  }
}
