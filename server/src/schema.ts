
import { z } from 'zod';

// Customer schema
export const customerSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  id_card_number: z.string(),
  address: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
  created_at: z.coerce.date()
});

export type Customer = z.infer<typeof customerSchema>;

// Customer input schema for creating customers
export const createCustomerInputSchema = z.object({
  full_name: z.string().min(1),
  id_card_number: z.string().min(1),
  address: z.string().min(1),
  phone_number: z.string().min(1),
  email: z.string().email()
});

export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>;

// Mortgage loan schema
export const mortgageLoanSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  loan_account_number: z.string(),
  loan_origination_date: z.coerce.date(),
  loan_amount: z.number(),
  interest_rate: z.number(),
  tenor_months: z.number().int(),
  monthly_principal_installment: z.number(),
  monthly_interest_installment: z.number(),
  total_monthly_installment: z.number(),
  installment_due_date: z.number().int().min(1).max(31), // Day of month
  created_at: z.coerce.date()
});

export type MortgageLoan = z.infer<typeof mortgageLoanSchema>;

// Mortgage loan input schema for creating loans
export const createMortgageLoanInputSchema = z.object({
  customer_id: z.number(),
  loan_account_number: z.string().min(1),
  loan_origination_date: z.coerce.date(),
  loan_amount: z.number().positive(),
  interest_rate: z.number().positive(),
  tenor_months: z.number().int().positive(),
  monthly_principal_installment: z.number().positive(),
  monthly_interest_installment: z.number().positive(),
  total_monthly_installment: z.number().positive(),
  installment_due_date: z.number().int().min(1).max(31)
});

export type CreateMortgageLoanInput = z.infer<typeof createMortgageLoanInputSchema>;

// Payment schema
export const paymentSchema = z.object({
  id: z.number(),
  loan_id: z.number(),
  payment_date: z.coerce.date(),
  payment_amount: z.number(),
  installment_period_paid: z.string(), // e.g., "2024-01" for January 2024
  created_at: z.coerce.date()
});

export type Payment = z.infer<typeof paymentSchema>;

// Payment input schema for recording payments
export const createPaymentInputSchema = z.object({
  loan_id: z.number(),
  payment_date: z.coerce.date(),
  payment_amount: z.number().positive(),
  installment_period_paid: z.string().regex(/^\d{4}-\d{2}$/) // YYYY-MM format
});

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;

// Delinquency status schema (calculated data)
export const delinquencyStatusSchema = z.object({
  loan_id: z.number(),
  loan_account_number: z.string(),
  customer_name: z.string(),
  days_overdue: z.number().int(),
  total_overdue_amount: z.number(),
  last_payment_date: z.coerce.date().nullable(),
  next_due_date: z.coerce.date()
});

export type DelinquencyStatus = z.infer<typeof delinquencyStatusSchema>;

// Loan details with customer info (for dashboard views)
export const loanWithCustomerSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  loan_account_number: z.string(),
  loan_origination_date: z.coerce.date(),
  loan_amount: z.number(),
  interest_rate: z.number(),
  tenor_months: z.number().int(),
  monthly_principal_installment: z.number(),
  monthly_interest_installment: z.number(),
  total_monthly_installment: z.number(),
  installment_due_date: z.number().int(),
  created_at: z.coerce.date(),
  customer: customerSchema
});

export type LoanWithCustomer = z.infer<typeof loanWithCustomerSchema>;

// Payment history with loan info
export const paymentWithLoanSchema = z.object({
  id: z.number(),
  loan_id: z.number(),
  payment_date: z.coerce.date(),
  payment_amount: z.number(),
  installment_period_paid: z.string(),
  created_at: z.coerce.date(),
  loan: mortgageLoanSchema,
  customer: customerSchema
});

export type PaymentWithLoan = z.infer<typeof paymentWithLoanSchema>;
