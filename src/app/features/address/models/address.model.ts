export interface Address {
  firstName ?: string;
  lastName ?: string;
  addressId?: number;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
  addressName: string;
}
