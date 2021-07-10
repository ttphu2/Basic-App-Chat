import { Component, OnInit } from '@angular/core';
import { MessageDto } from '../model/message';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-app-chat',
  templateUrl: './app-chat.component.html',
  styleUrls: ['./app-chat.component.scss']
})
export class AppChatComponent implements OnInit {
  msgDto: MessageDto = new MessageDto();
  msgInboxArray: MessageDto[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.retrieveMappedObject()
    .subscribe( (receivedObj: MessageDto) => { this.addToInbox(receivedObj);}
    , error => {
      console.log(error);
    });  // calls the service method to get the new messages sent

  }


  send(){
    if(this.msgDto) {
      if(this.msgDto.user.length == 0 || this.msgDto.user.length == 0){
        window.alert("Both fields are required.");
        return;
      } else {
        this.chatService.broadcastMessage(this.msgDto);
        this.msgDto.msgText = '';
      }
    }
  }

  addToInbox(obj: MessageDto) {
    let newObj = new MessageDto();
    newObj.user = obj.user;
    newObj.msgText = obj.msgText;
    this.msgInboxArray.push(newObj);

  }
}
