import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { UiSwitchModule } from 'ngx-ui-switch';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { TiersService } from 'src/app/services/tiers-service/tiers.service';

@Component({
  selector: 'app-tiers',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxDatatableModule,
    UiSwitchModule,
    ToastrModule
  ],
  templateUrl: './tiers.component.html',
  styleUrl: './tiers.component.scss'
})
export default class TiersComponent implements OnInit {
  
  constructor(private fb: FormBuilder, private tierSvc: TiersService, private toastr: ToastrService, private loaderService: LoaderService) { }
  
  ngOnInit(): void {
    this.getTiersList();
  }

  showPopup = false;
  editIndex: number | null = null;
  editSequence: number;
  uniqueSequenceError: boolean = false;

  ColumnMode = ColumnMode;
  tierDataList: {
    tier_name: string;
    rental_qual: number;
    rental_earn_pts_val: number;
    access_earn_pts_val: number;
    upgrades: string;
    rental_redeem_pts_val: number;
    access_redeem_pts_val: number;
    notable_perks: number;
    perks_pts_val: number;
    sequence: number;
    status: number;
    default_loyalty: number;
  }[] = [];


  getTiersList(){
    this.tierSvc.GetTierList().subscribe({
      next: (resp)=>{
        this.loaderService.hide();
          console.log("Response: ", resp);
          if(resp.status == 'success'){
            this.tierDataList = resp.data;
          }else{
            this.toastr.error(resp.message, 'Error');
          }
      },
      error: (err)=>{
        this.loaderService.hide();
        this.toastr.error(err.error.message, "Error");
      }
    })
  }



  tierDataForm = this.fb.group({
    id:  [0],
    tier_name: ['', [Validators.required, Validators.maxLength(40)]],
    rental_qual: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$'), Validators.max(99999999999)]], 
    rental_earn_pts_val: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$'), Validators.max(99999999999)]],
    access_earn_pts_val: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$'), Validators.max(99999999999)]],
    upgrades: ['', [Validators.maxLength(250)]],
    rental_redeem_pts_val: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$'), Validators.max(99999999999)]],
    access_redeem_pts_val: [0, [Validators.required, Validators.min(0), Validators.pattern('^[0-9]*$'), Validators.max(99999999999)]],
    notable_perks: [1, [ Validators.min(0), Validators.max(99999999999)]],
    perks_pts_val: [0, [ Validators.min(0), Validators.max(99999999999)]],
    sequence: [1, [Validators.required, Validators.min(1), Validators.max(99999999999)]],
    status: [0, [Validators.required]],
    default_loyalty: [0, [Validators.required]],

  });

  onStatusSwitch(event:boolean){
    this.tierDataForm.patchValue({
      status: event? 1: 0
    })
  }

  onDefaultLoyaltySwitch(event:boolean){
    this.tierDataForm.patchValue({
      default_loyalty: event ? 1 : 0
    });
  }

  onTierModalClose() {
    this.showPopup = false;
    this.tierDataForm.patchValue({
      id :  0,
      tier_name: '',
      rental_qual: 0, 
      rental_earn_pts_val: 0,
      access_earn_pts_val: 0,
      upgrades: '',
      rental_redeem_pts_val: 0,
      access_redeem_pts_val: 0,
      notable_perks: 0,
      perks_pts_val: 0,
      sequence: 1,
      status: 0,
      default_loyalty: 0,
    });
  }

  onSubmit() {
    this.tierDataForm.markAllAsTouched();
    const formVal = this.tierDataForm.value;

    for(const element of this.tierDataList){
      if(Number(element.sequence) === Number(formVal.sequence) &&
      Number(this.editSequence) != Number(formVal.sequence)){
        this.uniqueSequenceError = true;
        return;
      }else{
        this.uniqueSequenceError = false;
      }
    }

    if (this.tierDataForm.valid && !this.uniqueSequenceError){
      if(formVal.id > 0){
        this.tierSvc.UpdateTier(formVal.id, formVal).subscribe({
          next: (resp)=>{
            this.loaderService.hide();
            // console.log("Response", resp);
            this.toastr.success(resp.message, "Success");
            this.onTierModalClose();
            this.getTiersList();
          },
          error: (err) =>{
            this.loaderService.hide();
            // console.log("Error", err);
            this.toastr.error(err.error.message, "Error");
          }
        })
      }else{
        
        this.tierSvc.CreateTier(formVal).subscribe({
          next: (resp)=>{
            this.loaderService.hide();
            // console.log("Response", resp);
            if(resp.status == 'success'){
              this.toastr.success(resp.message, "Success");
              this.onTierModalClose();
              this.getTiersList();
            }else{
              this.toastr.error(resp.message, "Error");
            } 
          },
          error: (err) =>{
            this.loaderService.hide();
            // console.log("Error", err);
            this.toastr.error(err.error.message, "Error");
          }
        })
      }
    }
  }
  
editRow(row: any, index: number) {
  this.editIndex = index;
  this.editSequence = row.sequence;
  this.tierDataForm.patchValue(row);
  this.showPopup = true;
}

}
