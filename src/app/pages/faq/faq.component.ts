import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';

@Component({
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {

  data : FaqData [];
  errorMessage: string;
  isLoading = false;
  faqArray: boolean [] = [];

  constructor(private databaseHandlerService: DatabaseHandlerService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.databaseHandlerService.getFaqs().subscribe(response => {
      console.log(response);
      this.data = response.data;
      this.isLoading = false;
      this.faqArray = new Array(this.data.length).fill(false);
    },
    error => {
      this.errorMessage = error;
      this.isLoading = false;
    });
  }

  onFaqClick(i) {
    this.faqArray[i] = !this.faqArray[i];
  }
}

interface FaqData{
  title: string,
  body: { tag: string; element: string }[]
}
