import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  public buildApiUrl(...params: string[]): string {
    return 'rest/' + params.join('/');
  }
}
