
export class IMessage {
  public user: string;
  public msgText: string;
}
export class MessageDto implements IMessage {
  public user: string = '';
  public msgText: string = '';
  constructor(init?: MessageDto) {
    Object.assign(this, init);
  }
}
