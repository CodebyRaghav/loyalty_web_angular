import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader-service/loader.service';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}

}
