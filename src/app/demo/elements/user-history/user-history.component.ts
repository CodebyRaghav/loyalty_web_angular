import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { UserHistoryService } from 'src/app/services/user-history-service/user-history.service';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-history.component.html',
  styleUrl: './user-history.component.scss'
})
export class UserHistoryComponent implements OnInit {
  ColumnMode = ColumnMode;
  showPopup: boolean = false;
  isFutureDate: boolean = true;
  // selectedRow: any = null;
  datesError: boolean = false;
  searchHistoryList = [];
  tranTypesList = [
    { key: 'earn', label: 'Earn' },
    { key: 'redeem', label: 'Redeem' }
  ];
  sourceList = [
    { key: 'purchase', label: 'Purchase' },
    { key: 'referal', label: 'Referal' },
    { key: 'manual', label: 'Manual' }
  ];
  statusList = [
    { key: 'approved', label: 'Approved' },
    { key: 'pending', label: 'Pending' }
  ];
  sortByList = [{ key: 'date', label: 'Date' }];
  sortDirectionList = [
    { key: 'asc', label: 'Ascending' },
    { key: 'desc', label: 'Descending' }
  ];
  @Input() isMasterUser: boolean = false;
  @Input() userHcode: number = null;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private searchSvc: UserHistoryService,
    private loaderService: LoaderService
  ) {}

  SearchHistoryForm = this.fb.group({
    tran_type: [null],
    reference_id: ['', Validators.maxLength(20)],
    source: [null],
    status: [null],
    date_from: [''],
    date_to: [''],
    sort_by: [null],
    sort_dir: [null],
    limit: [''],
    user_hcode: [null, Validators.max(99999999999)]
  });

  viewSummaryForm = this.fb.group({
    id: [null],
    user_hcode: [''],
    tran_type: [''],
    points: [''],
    source: [''],
    reference_id: [''],
    description: [''],
    created_at: [''],
    expires_at: [''],
    status: [''],
    is_expired: [''],
    reference_amount: ['']
  });

  ngOnInit(): void {
    if (localStorage.getItem('role') == 'user') {
      this.isMasterUser = true;
      let formVal = { user_hcode: localStorage.getItem('hcode') };
      this.getUserHistory(formVal);
    }
    if (this.isMasterUser) {
      let formVal = { user_hcode: this.userHcode };
      // formVal.;
      this.getUserHistory(formVal);
    } else {
      this.getUserHistory(this.SearchHistoryForm.value);
    }
  }

  getUserHistory(formVal: any) {
    this.searchSvc.GetUsersHistory(formVal).subscribe({
      next: (resp) => {
        this.loaderService.hide();
        if (resp.status && resp.data) {
          this.searchHistoryList = resp.data;
        } else {
          this.searchHistoryList = [];
          // this.toastr.error(resp.message, "Error");
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
    let formVal = this.SearchHistoryForm.value;

    if (formVal.date_from && formVal.date_to) {
      const dateFrom = moment(formVal.date_from);
      const dateTo = moment(formVal.date_to);

      if (dateFrom.isBefore(dateTo)) {
        this.datesError = false;
      } else {
        this.datesError = true;
      }
    }

    if (!this.datesError) {
      this.getUserHistory(formVal);
    }
  }

  openPopup(row: any): void {
    // this.selectedRow = row;

    this.viewSummaryForm.patchValue({
      ...row,
      expires_at: moment(row.expires_at).format('YYYY-MM-DD'),
      created_at: moment(row.created_at).format('YYYY-MM-DD')
    });
    console.log('Expires At: ', this.viewSummaryForm.value);
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
    this.viewSummaryForm.reset();
    // this.selectedRow = null;
  }

  onUpdateButton() {
    let formVal = this.viewSummaryForm.value;

    if (!moment(formVal.expires_at).isAfter(moment(), 'day')) {
      this.isFutureDate = false;
    }
    this.viewSummaryForm.markAllAsTouched();
    if (this.viewSummaryForm.valid && this.isFutureDate) {
      this.searchSvc.UpdateExpiry(formVal.id, formVal).subscribe({
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
}
