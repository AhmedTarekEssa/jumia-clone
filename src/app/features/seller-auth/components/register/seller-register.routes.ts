import {Step1BusinessInfo} from './step1-business-info/step1-business-info';
import { Routes } from '@angular/router';
import { Step2BankDetails } from './step2-bank-details/step2-bank-details';
import { Step3Documents } from './step3-documents/step3-documents';
import { Step4Training } from './step4-training/step4-training';

export const routes: Routes = [
  {
    path: 'step1',
    component: Step1BusinessInfo
  },
  {
    path: 'step2',
    component: Step2BankDetails
  },
  {
    path: 'step3',
    component: Step3Documents
  },
  {
    path: 'step4',
    component: Step4Training
  }
];
