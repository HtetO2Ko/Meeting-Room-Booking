import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
})
export class Alert implements OnChanges, OnDestroy {
  @Input() isVisible = false;
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'success';
  @Input() message = '';
  @Input() duration = 4000; 

  @Output() isVisibleChange = new EventEmitter<boolean>();

  timeString = '';
  private timeoutId: any = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      if (this.isVisible) {
        this.timeString = this.getFormattedTime();
        this.startAutoDismiss();
      } else {
        this.clearTimeout();
      }
    }
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  private startAutoDismiss() {
    this.clearTimeout();
    if (this.duration > 0) {
      this.timeoutId = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  private clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  private getFormattedTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  close() {
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }
}
