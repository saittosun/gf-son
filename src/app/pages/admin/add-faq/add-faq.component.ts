import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseHandlerService } from 'src/app/services/database-handler.service';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.css']
})
export class AddFaqComponent implements OnInit {

  isLoading = false;
  title:string = '';
  bodyString: string = '';
  errorMessage: string;
  body: { tag: string; element: string }[] = [];


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    if (!this.isFormValid()) return;
    this.isLoading = true;
    const data = {title: this.title, body: this.body};
    this.authService
      .addFaq(data)
      .subscribe((response) => {
        console.log(response);
        this.resetForm();
        this.errorMessage = "Faq saved sucsessfully.";
        this.isLoading = false;
      },
      error => {
        this.errorMessage = error;
        this.isLoading = false;
      });
  }

  isFormValid(): boolean {
    this.errorMessage = null;
    if (!this.body.length) this.errorMessage = 'Body is too short. Please click previev.';
    if (this.title.trim().length < 5) this.errorMessage = 'Title is too short';
    return this.errorMessage === null;
  }

  onPrewiew(){
    this.errorMessage = null;
    this.body = [];
    const bodyArray = this.bodyString.split('\n')
    for (let line of bodyArray){
      line = line.trim();
      if (line.startsWith('---')){
        this.body.push({tag: 'header', element: line.substring(3).trim()})
      } else if (line.startsWith('*')){
        this.body.push({tag: 'listItem', element: line.substring(1).trim()})
      } else {
        this.body.push({tag: 'paragraph', element: line.trim()})
      }
    }
    console.log(bodyArray);
  }

  resetForm(){
    this.title = null;
    this.bodyString = null;
    this.body = [];;
    this.errorMessage = null;
    this.isLoading = false;
  }

}
