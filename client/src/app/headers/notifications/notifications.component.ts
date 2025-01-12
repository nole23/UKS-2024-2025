import { Component } from '@angular/core';
import { NotificationsService } from '../../docker-hub/services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  listOfNotifications: any[] = [];

  constructor(private notification: NotificationsService) {
    this._openNotification();
  }

  private _openNotification() {
    this.notification.getAllNotifications().subscribe((res: any) => {
      if (res.status) {
        this.listOfNotifications = res.message;
      }
    })
  }
}
