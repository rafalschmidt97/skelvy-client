import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MapsResponse, MapsResponseType } from '../../../../../core/maps/maps';

@Component({
  selector: 'app-address-item',
  templateUrl: './address-item.component.html',
  styleUrls: ['./address-item.component.scss'],
})
export class AddressItemComponent {
  @Input() result: MapsResponse;
  @Output() select = new EventEmitter<MapsResponse>();

  isNotCity(type: string): boolean {
    return type !== MapsResponseType.LOCALITY;
  }
}
