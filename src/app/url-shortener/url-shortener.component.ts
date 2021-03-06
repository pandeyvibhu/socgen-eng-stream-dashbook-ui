import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ShortenerDetail } from '../model/shortener/shortener.details.model';
import { ShortenerUrl } from '../model/shortener/shortener.model';
import { ShortenerService } from '../services/shared/shortener.service';

@Component({
  selector: 'app-dashbook-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.scss']
})
export class UrlShortenerComponent implements OnInit {

  urlForm: FormGroup;
  redirectionUrl: string;
  urlHash: string;
  submitted = false;
  shortenerObj: ShortenerUrl;
  shortenerDetail: ShortenerDetail;
  public BACKEND_URL = 'http://dashbookparent-env.eba-gbtkatyv.ap-south-1.elasticbeanstalk.com/tiny/';

  now = new Date();

  private readonly url = 'url';
  private readonly expirationTime = 'expirationTime';

  constructor(
      private formBuilder: FormBuilder,
      private urlService: ShortenerService
  ) {}

  ngOnInit(): void {
      this.urlForm = this.formBuilder.group({
        url: ['',  Validators.required],
        expirationTime: ['', Validators.required]
      });
  }

  onSubmit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.urlForm.invalid) {
         return;
    }

    this.shortenerObj = new ShortenerUrl(
    this.urlForm.controls[this.url].value,
    this.urlForm.controls[this.expirationTime].value
    );

    this.urlService.createShortUrl(this.shortenerObj)
    .pipe(
        tap(urlDetail => {
            this.shortenerDetail = urlDetail;
            this.redirectionUrl = this.BACKEND_URL + urlDetail.shortUrl;
        })
    ).subscribe();

    }
}
