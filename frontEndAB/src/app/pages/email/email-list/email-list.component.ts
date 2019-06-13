import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecievedEmail } from '../../../models';

@Component({
  selector: 'email-list',
  templateUrl: './email-list.component.html',
  styleUrls: [ './email-list.component.css' ]
})
export class EmailListComponent  {
  
  @Input() emails: RecievedEmail[];
  @Output() protected selectedEmail = new EventEmitter<RecievedEmail>();
  clickedItem: RecievedEmail;


  onSelect(selected_email){
    this.clickedItem = selected_email;
    this.selectedEmail.emit(selected_email);
  }

  constructor() { }

  ngOnInit() {
  }

}