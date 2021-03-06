import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController, Events } from 'ionic-angular';

import { AppConfig } from "../../app/app.config";
import { Settings } from '../../providers/settings';
import { AbstractComponent } from '../../interfaces/abstract-component';

import { TranslateService } from '@ngx-translate/core';

/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage extends AbstractComponent {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, public events: Events) {
    super(null, navCtrl, toastCtrl, null, null, alertCtrl);
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3],
      option4: [this.options.option4]
    };

    // switch (this.page) {
    //   case 'main':
    //     break;
    //   case 'profile':
    //     group = {
    //       option4: [this.options.option4]
    //     };
    //     break;
    // }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      console.log(v);
      this.settings.merge(this.form.value).then(() => {
        AppConfig.enableNotification = this.options.option4;
        AppConfig.enableBingPic = this.options.option1;
        AppConfig.backImg = this.options.option2;
        if (AppConfig.tempFormat != this.options.option3) {
          AppConfig.tempFormat = this.options.option3;
          location.reload();
        }
      });
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;
      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }
  clearCache() {
    this.confirm("清除缓存？", "您的城市搜索记录等所有信息都将被清除", con => {
      if (con) {
        this.settings.setAll({});
        this.showMessage("清除缓存成功");
      }
    });
  }
}
