import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnMode, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { NotificationsService } from 'src/app/services/notifications-service/notifications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [QuillModule, FormsModule, ReactiveFormsModule, NgxDatatableModule, CommonModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export default class TemplateComponent {
  emailForm!: FormGroup;
  ColumnMode = ColumnMode;
  showPopup: boolean = false;
  uniqueTemplateTypeError: boolean = false;
  editTemplateType: string;
  // email = {
  //   name: '',
  //   whatsapp_name: '',
  //   template_type: '',
  //   subject: '',
  //   body: '',
  // };

  templates = [];

  templateTypesList = [ ];

  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  constructor(private fb: FormBuilder, private notificationSvc: NotificationsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      id: [0],
      email_template_name: ['', [Validators.required, Validators.maxLength(100)]],
      whatsapp_template_name: ['', [Validators.required, Validators.maxLength(100)]],
      template_type: [null, Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(250)]],
      body: ['', Validators.required]
    });

    this.getNotificatificationsList();
    this.getTemplateTypesList();
  }

  getNotificatificationsList(){
    this.notificationSvc.GetNotificationList().subscribe({
      next: (resp)=>{
        if(resp.status){
          this.templates = resp.data;
        }else{
          this.toastr.error(resp.message, "Error");
        }
      },
      error: (err)=>{
        this.toastr.error(err.error.message, "Error");
      }
    })
  }

  getTemplateTypesList(){
    this.notificationSvc.GetTemplateTypesList().subscribe({
      next: (resp)=>{
        if(resp.status){
          this.templateTypesList = resp.data;
        }else{
          this.toastr.error(resp.message, "Error");
        }
      },
      error: (err)=>{
        this.toastr.error(err.error.message, "Error");
      }
    })
  }

  openModal(): void {
    this.showPopup = true;
    this.emailForm.reset();
    this.editTemplateType = "";
    // this.email = { name: '', whatsapp_name: '', template_type: '', subject: '', body: '' };
  }

  editRow(row: any, index: number): void {
    this.editTemplateType = row.template_type;
    this.emailForm.patchValue({
      ...row
    });
    this.showPopup = true;
  }

  saveEmail(): void {
    this.emailForm.markAllAsTouched();
    let formVal = this.emailForm.value;

    for(const element of this.templates){
      if(element.template_type == formVal.template_type &&
      this.editTemplateType != formVal.template_type){
        this.uniqueTemplateTypeError = true;
        return;
      }else{
        this.uniqueTemplateTypeError = false;
      }
    }

    if (this.emailForm.valid && !this.uniqueTemplateTypeError) {
      if(formVal.id > 0){
        this.notificationSvc.UpdateNotification(formVal.id, formVal).subscribe({
          next: (resp)=>{
            if(resp.status){
              this.toastr.success(resp.message, "Success");
              this.onTemplateModalClose();
            }else{
              this.toastr.error(resp.message, "Error");
            }
          },
          error: (err)=>{
            this.toastr.error(err.error.message, "Error");
          }
        })
      }else{
        this.notificationSvc.CreateNotification(formVal).subscribe({
          next: (resp)=>{
            if(resp.status == "success"){
              this.toastr.success(resp.message, "Success");
              this.onTemplateModalClose();
            }else{
              this.toastr.error(resp.message, "Error");
            }
          },
          error: (err)=>{
            this.toastr.error(err.error.message, "Error");
          }
        })
      }
      this.onTemplateModalClose();
      // console.log('Saving Email:', formVal);
      // alert('Email Saved!');
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  onTemplateModalClose(): void {
    this.showPopup = false;
    this.emailForm.reset();
    this.getNotificatificationsList();
    this.uniqueTemplateTypeError = false;
  }
}
