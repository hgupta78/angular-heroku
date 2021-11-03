import { LocalStorageService } from 'angular-2-local-storage';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigurationsetupService } from 'projects/attendancerecorderapp/src/public-api';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppInitializer {
  rmaConfig: any = {};
  constructor(private http: HttpClient,
    private configService: ConfigurationsetupService,
    private localStorage: LocalStorageService) {

  }
  loadConfig() {
    const val = this.localStorage.get('clientId');
    if (val === null) {
      this.localStorage.set('clientId', '0');
    }
    let myPromiseArray = [];
    myPromiseArray.push(this.http
      .get('./assets/config/development.json')
      .toPromise());

    return Promise.all(myPromiseArray).then(result => {
      this.configService.config({
        SERVER: {
          APISERVER: result[0].API_ENDPOINTS.CLAIMSERVER
        },
      });
    }).catch((err: any) => {
      this.configService.config({
        SERVER: {
          APISERVER: 'http://localhost/',
        },
      });
    });
    // return this.http
    //   .get('../rmacommon/config.json')
    //   .toPromise()
    //   .then((data: any) => {
    //     this.configService.config({
    //       SERVER: {
    //         RMASERVER: data.RMASERVER + '/' + data.RMASERVERVIRDIR,
    //         CLAIMSROOTURI: data.RMASERVER + '/' + data.CLAIMSROOTURIVIRDIR
    //       },
    //       TIMEOUT: '90',
    //       AUTHENTICATIONKEY: '',
    //       HELPLINK: '',
    //       REQUIRED: RequiredFormat.STAR
    //     });
    //   })
    //   .catch((err: any) => {
    //     this.configService.config({
    //       SERVER: {
    //         CLAIMSERVER: 'http://localhost/claimsapi',
    //         CODESERVER: 'http://localhost/claimsapi',
    //         RESOURCESERVER: 'http://localhost/claimsapi',
    //         UTITILTYSERVER: 'http://localhost/claimsapi',
    //         ENTITYSERVER: 'http://localhost/claimsapi',
    //         RMASERVER: 'http://localhost'
    //       },
    //       TIMEOUT: '90',
    //       AUTHENTICATIONKEY: `a1WuztmA0oJKzv3N2JNvbWUBalcZ6/pIXWSNY+Ie7evkH
    //       ea089/pUH3xO6P6PXFH1pq3tituSAHYT6jlLCn8ELh59OxNmT8wwLeABoUq3dx9CVPEK3YcXUWGWZFM0cWtdUo9UuhpxrJzIQkOy2nJeKzjCqBFZKcFIjgR59rSTXs=`,
    //       HELPLINK: '',
    //       REQUIRED: RequiredFormat.BORDER
    //     });
    //     console.log('Error', err);
    //   });


  }
}
