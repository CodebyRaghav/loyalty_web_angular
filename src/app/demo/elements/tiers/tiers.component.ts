import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { UiSwitchModule } from 'ngx-ui-switch';

@Component({
  selector: 'app-tiers',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NgxDatatableModule,
    UiSwitchModule
  ],
  templateUrl: './tiers.component.html',
  styleUrl: './tiers.component.scss'
})
export default class TiersComponent implements OnInit {

  showPopup = false;
  editIndex: number | null = null;

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
    status: boolean;
    default_loyalty: boolean;
    

  }[] = [];




  ngOnInit(): void {
    this.tierDataList = [
      {
        tier_name: 'Gold',
        rental_qual: 1000,
        rental_earn_pts_val: 10,
        access_earn_pts_val: 5,
        upgrades: 'Yes',
        rental_redeem_pts_val: 100,
        access_redeem_pts_val: 50,
        notable_perks: 3,
        perks_pts_val: 20,
        sequence: 1,
        status: true,
        default_loyalty: true
      },
      {
        tier_name: 'Silver',
        rental_qual: 500,
        rental_earn_pts_val: 5,
        access_earn_pts_val: 3,
        upgrades: 'Yes',
        rental_redeem_pts_val: 60,
        access_redeem_pts_val: 30,
        notable_perks: 2,
        perks_pts_val: 10,
        sequence: 2,
        status: true,
        default_loyalty: false
      },
      {
        tier_name: 'Bronze',
        rental_qual: 250,
        rental_earn_pts_val: 3,
        access_earn_pts_val: 2,
        upgrades: 'No',
        rental_redeem_pts_val: 40,
        access_redeem_pts_val: 20,
        notable_perks: 1,
        perks_pts_val: 5,
        sequence: 3,
        status: false,
        default_loyalty: false
      }
    ];
  }




  constructor(private fb: FormBuilder) { }

  tierDataForm = this.fb.group({
    id:  "",
    tier_name: ['', [Validators.required]],
    rental_qual: [0, [Validators.required, Validators.min(0)]],
    rental_earn_pts_val: [0, [Validators.required, Validators.min(0)]],
    access_earn_pts_val: [0, [Validators.required, Validators.min(0)]],
    upgrades: ['', [Validators.required]],
    rental_redeem_pts_val: [0, [Validators.required, Validators.min(0)]],
    access_redeem_pts_val: [0, [Validators.required, Validators.min(0)]],
    notable_perks: [0, [Validators.required, Validators.min(0)]],
    perks_pts_val: [0, [Validators.required, Validators.min(0)]],
    sequence: [0, [Validators.required, Validators.min(0)]],
    status: [false, [Validators.required]],
    default_loyalty: [false, [Validators.required]],


  });
  generateUniqueId(): string {
    return Date.now().toString();
  }
  // onSubmit() {
  //   const newTier = this.tierDataForm.value;
  //   this.tierDataList.push(newTier as {
  //     id: string;
  //     tier_name: string;
  //     rentalsQualification: number;
  //     earningRentalpoint: number;
  //     earningNonRentalpoint: number;
  //     upgrades: string;
  //     redeemPointValueRental: number;
  //     redeemPointValueNonRental: number;
  //     perks: number;
  //     perksPointValue: number;
  //     sequence: number;
  //     status: boolean;
  //     defaultLoyalty: boolean;
  //   });

  //   this.tierDataForm.reset();
  //   this.showPopup = false;
  //   console.log("tierDataList", this.tierDataList)
  // }
  onSubmit() {
    if (this.tierDataForm.invalid) return;
  
    const formValue = this.tierDataForm.value;
  
    const updatedTier = {
      id: formValue.id || this.generateUniqueId(),
      tier_name: formValue.tier_name!,
      rental_qual: formValue.rental_qual!,
      rental_earn_pts_val: formValue.rental_earn_pts_val!,
      access_earn_pts_val: formValue.access_earn_pts_val!,
      upgrades: formValue.upgrades!,
      rental_redeem_pts_val: formValue.rental_redeem_pts_val!,
      access_redeem_pts_val: formValue.access_redeem_pts_val!,
      notable_perks: formValue.notable_perks!,
      perks_pts_val: formValue.perks_pts_val!,
      sequence: formValue.sequence!,
      status: formValue.status!,
      default_loyalty: formValue.default_loyalty!
    };
  
    if (this.editIndex !== null) {
      this.tierDataList[this.editIndex] = updatedTier;
      this.editIndex = null; 
    } else {
      this.tierDataList.push(updatedTier);
    }
  
    this.tierDataList = [...this.tierDataList]; 
    this.tierDataForm.reset();
    this.showPopup = false;
  }
  
  
 

editRow(row: any, index: number) {
  this.editIndex = index;
  this.tierDataForm.patchValue(row);
  this.showPopup = true;
}

}
