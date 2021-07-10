import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { IMessage, MessageDto } from '../model/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private  connection: any = new signalR.HubConnectionBuilder().withUrl("https://localhost:5001/chatsocket")   // mapping to the chathub as in startup.cs
  .configureLogging(signalR.LogLevel.Information)
  .build();
  readonly POST_URL = "https://localhost:5001/api/chat/send"
  private receivedMessageObject: MessageDto = new MessageDto();
  private sharedObj = new Subject<MessageDto>();

  constructor(private http: HttpClient) {
    this.connection.onclose(async () => {
      await this.start();
    });
   this.connection.on("ReceiveOne", (user, message) => { this.mapReceivedMessage(user, message); });
   this.start();
  }


  // Strart the connection
  public async start() {
    try {
      await this.connection.start();
      console.log("connected");
    } catch (err) {
      console.log(err);
      setTimeout(() => this.start(), 5000);
    }
  }

  private mapReceivedMessage(user: string, message: string): void {
    this.receivedMessageObject.user = user;
    this.receivedMessageObject.msgText = message;
    console.log(this.receivedMessageObject);
    this.sharedObj.next(this.receivedMessageObject);
  }

  // Calls the controller method
  broadcastMessage(msgDto: MessageDto) {
    this.http.post<IMessage>(this.POST_URL, msgDto).subscribe((response: any) => {

    }, error => {
      console.log(error);
    });;
    // this.connection.invoke("SendMessage1", msgDto.user, msgDto.msgText).catch(err => console.error(err));    // This can invoke the server method named as "SendMethod1" directly.
  }

  public retrieveMappedObject(): Observable<MessageDto> {
    return this.sharedObj.asObservable();
  }

}
