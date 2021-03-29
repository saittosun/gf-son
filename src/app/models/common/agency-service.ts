import { environment } from '../../../environments/environment';
import { Adress } from './adress';
import { AgencyServiceDetail } from './agency-service-detail';
import { DeliveryType } from '../enums/delivery-type.enum';

export class AgencyService {

  deliveryAddress: Adress;
  serviceFee: number;
  remarks: string;
  deliveryType: DeliveryType;
  deliveryPrice: number;
  additionalServicePrice: number;
  additionalServiceDescription: string;
  serviceDetails: AgencyServiceDetail[] = [];

  constructor(){
    // this.deliveryAddress = new Adress();
    // this.deliveryAddress.line = 'El. Venizelou 61,  , Greece';
    // this.deliveryAddress.zipCode = '10564';
    // this.deliveryAddress.city = 'Athens';
    // this.deliveryAddress.country = 'GR';
    this.serviceFee = environment.SERVICE_FEE;
    this.deliveryType = DeliveryType.KIOSK; //TODO
    this.deliveryPrice = 0; //TODO
    this.additionalServicePrice = 0;
  }
}
