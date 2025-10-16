import { create } from 'zustand';

interface BillingState {
  amount: string;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  country: string;
  landmark: string;
  state: string;
  pincode: string;
  city: string;
  card_name: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  setField: (field: keyof BillingState, value: string) => void;
}

export const useStoreCredits = create<BillingState>((set) => ({
  amount: '',
  merchant_id: '',
  full_name: '',
  phone_number: '',
  address_line_1: '',
  country: '',
  landmark: '',
  state: '',
  pincode: '',
  city: '',
  card_name: '',
  card_number: '',
  expiry_date: '',
  cvv: '',
  setField: (field, value) => set({ [field]: value }),
}));
