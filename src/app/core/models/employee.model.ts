export interface Employee {
  id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  createdAt?: string;
  avatar?: string;
  emailId?: string;
}

export type CreateEmployeeDto = Omit<Employee, 'id' | 'createdAt' | 'avatar' | 'emailId'>;

export type UpdateEmployeeDto = CreateEmployeeDto;
