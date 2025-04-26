import { Component } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [QuillModule, FormsModule, ReactiveFormsModule, NgxDatatableModule,CommonModule],
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export default class TemplateComponent {
  emailForm!: FormGroup;
  selectedTemplate: string | null = null;

  email = {
    name: '',
    subject: '',
    body: ''
  };
  templates = [
    { key: 'welcome', name: 'Welcome Template' },
    { key: 'reward', name: 'Reward Earned Template' },
    { key: 'discount', name: 'Discount Offer Template' }
  ];
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ]
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      body: ['', Validators.required]
    });
  }

  selectTemplate(templateKey: string): void {
    this.selectedTemplate = templateKey;

    let name = '';
    let subject = '';
    let body = '';

    switch (templateKey) {
      case 'welcome':
        name = 'Welcome Template';
        subject = 'Welcome to Our Service!';
        body = `Dear Customer,

Welcome to our service! We're excited to have you with us. Enjoy the benefits of our loyalty program.

Best regards,
The Team`;
        break;

      case 'reward':
        name = 'Reward Earned Template';
        subject = 'You’ve Earned a Reward!';
        body = `Dear Customer,

Congratulations! You've earned a reward for your loyalty. Keep up the great work, and enjoy the rewards!

Best regards,
The Team`;
        break;

      case 'discount':
        name = 'Discount Offer Template';
        subject = 'Special Discount Just for You!';
        body = `Dear Customer,

We’re offering a special discount just for you! Use code DISCOUNT2025 at checkout to claim your offer.

Best regards,
The Team`;
        break;
    }

   
    this.email = { name, subject, body };

    this.emailForm.patchValue(this.email);
  }

  saveEmail(): void {
    if (this.emailForm.valid) {
      this.email = this.emailForm.value;
      console.log('Saving Email:', this.email);
      alert('Email Saved!');
    } else {
      this.emailForm.markAllAsTouched();
    }
  }

  editRow(row: any, index: number): void {
    console.log('Editing row:', row, 'at index', index);
  }
}
