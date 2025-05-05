import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { MasterUserService } from 'src/app/services/master-user-service/master-user.service';
import * as moment from 'moment';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-transaction',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, NgbDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule],
  templateUrl: './add-transaction.component.html',
  styleUrl: './add-transaction.component.scss'
})
export class AddTransactionComponent implements OnInit {
  isFutureDate: boolean = true;
 @Input() userHcode: number = null; 
 @Output() addTxnModalCloseEvent = new EventEmitter<void>();
  constructor(private fb: FormBuilder, private addTxnSvc: MasterUserService, private toastr: ToastrService, private loaderService: LoaderService) { }
  newTransactionForm = this.fb.group({
    user_hcode: [this.userHcode, [Validators.required, Validators.max(99999999999), Validators.min(0)]],
    tran_type: ["", [Validators.required]],
    points: [0, [Validators.required, Validators.max(99999999999), Validators.min(0)]],
    source: ["", [Validators.required]],
    reference_id: ["", [Validators.required, Validators.maxLength(20)]],
    description: ["", [Validators.required]],
    expires_at: ["", [Validators.required]],
    status: ["", [Validators.required]],
    reference_amount: [0, [Validators.required, Validators.max(99999999999), Validators.min(0)]],
  })

  ngOnInit(): void {
    this.newTransactionForm.patchValue({
      user_hcode : this.userHcode
    });
    
  }
 
  tranTypesList = [
    { key: "earn", label: "Earn" },
    { key: "redeem", label: "Redeem" }
  ];
 
  sourceList = [
    { key: "purchase", label: "Purchase" },
    { key: "referal", label: "Referal" },
    { key: "manual", label: "Manual" }
  ];
 
  statusList = [
    { key: "approved", label: "Approved" },
    { key: "pending", label: "Pending" },
    { key: "reversal", label: "Reversal" }
  ];
 
 
  onSubmitTransactionForm(): void {
    let formVal = this.newTransactionForm.value;
    if(!moment(formVal.expires_at).isAfter(moment(), 'day')){
    
            this.isFutureDate = false;
          }
    this.newTransactionForm.markAllAsTouched();
    if (this.newTransactionForm.valid && this.isFutureDate) {
      // console.log("Form submitted:", this.newTransactionForm.value);
      this.addTxnSvc.AddTransaction(formVal).subscribe({
        next: (resp)=>{
          this.loaderService.hide();
          if(resp.status){
            this.addTxnModalCloseEvent.emit();
            this.toastr.success(resp.message, "Success");
          }else{
            this.toastr.error(resp.message, "Error");
          }
        },
        error: (err)=>{
          this.loaderService.hide();
          this.toastr.error(err.error.message, "Error");
        }
      })
    }
  }
}
 
