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
    tierName: string;
    rentalsQualification: number;
    earningRentalpoint: number;
    earningNonRentalpoint: number;
    upgrades: string;
    redeemPointValueRental: number;
    redeemPointValueNonRental: number;
    perks: number;
    perksPointValue: number;
    sequence: number;
    status: boolean;
    defaultLoyalty: boolean;
    

  }[] = [];




  ngOnInit(): void {
    this.tierDataList = [
      {
        tierName: 'Gold',
        rentalsQualification: 1000,
        earningRentalpoint: 10,
        earningNonRentalpoint: 5,
        upgrades: 'Yes',
        redeemPointValueRental: 100,
        redeemPointValueNonRental: 50,
        perks: 3,
        perksPointValue: 20,
        sequence: 1,
        status: true,
        defaultLoyalty: true
      },
      {
        tierName: 'Silver',
        rentalsQualification: 500,
        earningRentalpoint: 5,
        earningNonRentalpoint: 3,
        upgrades: 'Yes',
        redeemPointValueRental: 60,
        redeemPointValueNonRental: 30,
        perks: 2,
        perksPointValue: 10,
        sequence: 2,
        status: true,
        defaultLoyalty: false
      },
      {
        tierName: 'Bronze',
        rentalsQualification: 250,
        earningRentalpoint: 3,
        earningNonRentalpoint: 2,
        upgrades: 'No',
        redeemPointValueRental: 40,
        redeemPointValueNonRental: 20,
        perks: 1,
        perksPointValue: 5,
        sequence: 3,
        status: false,
        defaultLoyalty: false
      }
    ];
  }




  constructor(private fb: FormBuilder) { }

  tierDataForm = this.fb.group({
    id:  "",
    tierName: ['', [Validators.required]],
    rentalsQualification: [0, [Validators.required, Validators.min(0)]],
    earningRentalpoint: [0, [Validators.required, Validators.min(0)]],
    earningNonRentalpoint: [0, [Validators.required, Validators.min(0)]],
    upgrades: ['', [Validators.required]],
    redeemPointValueRental: [0, [Validators.required, Validators.min(0)]],
    redeemPointValueNonRental: [0, [Validators.required, Validators.min(0)]],
    perks: [0, [Validators.required, Validators.min(0)]],
    perksPointValue: [0, [Validators.required, Validators.min(0)]],
    sequence: [0, [Validators.required, Validators.min(0)]],
    status: [false, [Validators.required]],
    defaultLoyalty: [false, [Validators.required]],


  });
  generateUniqueId(): string {
    return Date.now().toString();
  }
  // onSubmit() {
  //   const newTier = this.tierDataForm.value;
  //   this.tierDataList.push(newTier as {
  //     id: string;
  //     tierName: string;
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
      tierName: formValue.tierName!,
      rentalsQualification: formValue.rentalsQualification!,
      earningRentalpoint: formValue.earningRentalpoint!,
      earningNonRentalpoint: formValue.earningNonRentalpoint!,
      upgrades: formValue.upgrades!,
      redeemPointValueRental: formValue.redeemPointValueRental!,
      redeemPointValueNonRental: formValue.redeemPointValueNonRental!,
      perks: formValue.perks!,
      perksPointValue: formValue.perksPointValue!,
      sequence: formValue.sequence!,
      status: formValue.status!,
      defaultLoyalty: formValue.defaultLoyalty!
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

  deleteRow(index: number) {
    this.tierDataList.splice(index, 1);
    this.tierDataList = [...this.tierDataList];
  }
}
