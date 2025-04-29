import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ToastrService } from 'ngx-toastr';
import { UserHistoryService } from 'src/app/services/user-history-service/user-history.service';

@Component({
  selector: 'app-user-history',
  standalone: true,
  imports: [NgxDatatableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-history.component.html',
  styleUrl: './user-history.component.scss'
})
export class UserHistoryComponent {
  ColumnMode = ColumnMode;
  showPopup: boolean = false;
  selectedRow: any = null;
  searchHistoryList = [];
  tranTypesList = [{key: "earn", label:"Earn"}, {key: "redeem", label: "Redeem"}];
  sourceList = [{key: "purchase", label: "Purchase"}, {key: "referal", label: "Referal"}, {key: "manual", label: "Manual"}];
  statusList = [{key: "approved", label: "Approved"}, {key :"pending", label: "Pending"}, {key: "reversal", label: "Reversal"}];
  sortByList = [{key: "date", label: "Date"}];
  sortDirectionList = [{key: "asc", label: "Ascending"}, {key: "desc", label: "Descending"}]


  constructor(private fb: FormBuilder, private toastr: ToastrService, private searchSvc: UserHistoryService) { }
  
    SearchHistoryForm = this.fb.group({
      tran_type: [null],
      referenceId:  [0],
      source: [null],
      status: [null], 
      date_from: [''],
      date_to: [''],
      sort_by: [null],
      sort_dir: [null],
      limit: [''],
      user_hcode: [0]
  
    });

    viewSummaryForm = this.fb.group({
      id: [""],
      user_hcode: [""],
      tran_type: [""],
      points: [""],
      source: [""],
      reference_id: [""],
      description: [""],
      created_at: [""],
      expires_at: [""],
      status: [""],
      is_expired: [""],
      reference_amount: [""]
    })

    onSearchButton(){
      let formVal = this.SearchHistoryForm.value;
      this.searchSvc.GetUsersHistory(formVal).subscribe({
        next: (resp) => {
          if(resp.status){
            this.searchHistoryList = resp.data;
          }
        }
      })
    }

    openPopup(row: any): void {
      this.selectedRow = row;
      this.showPopup = true;
    }
     
    closePopup(): void {
      this.showPopup = false;
      this.selectedRow = null;
    }

}
