export class OutputLoginDto {
  accessToken: string;
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
}
