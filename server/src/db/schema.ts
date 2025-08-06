
import { serial, text, pgTable, timestamp, numeric, integer, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const customersTable = pgTable('customers', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  id_card_number: text('id_card_number').notNull().unique(),
  address: text('address').notNull(),
  phone_number: text('phone_number').notNull(),
  email: text('email').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const mortgageLoansTable = pgTable('mortgage_loans', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').references(() => customersTable.id).notNull(),
  loan_account_number: text('loan_account_number').notNull().unique(),
  loan_origination_date: date('loan_origination_date').notNull(),
  loan_amount: numeric('loan_amount', { precision: 15, scale: 2 }).notNull(),
  interest_rate: numeric('interest_rate', { precision: 5, scale: 2 }).notNull(),
  tenor_months: integer('tenor_months').notNull(),
  monthly_principal_installment: numeric('monthly_principal_installment', { precision: 12, scale: 2 }).notNull(),
  monthly_interest_installment: numeric('monthly_interest_installment', { precision: 12, scale: 2 }).notNull(),
  total_monthly_installment: numeric('total_monthly_installment', { precision: 12, scale: 2 }).notNull(),
  installment_due_date: integer('installment_due_date').notNull(), // Day of month (1-31)
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const paymentsTable = pgTable('payments', {
  id: serial('id').primaryKey(),
  loan_id: integer('loan_id').references(() => mortgageLoansTable.id).notNull(),
  payment_date: date('payment_date').notNull(),
  payment_amount: numeric('payment_amount', { precision: 12, scale: 2 }).notNull(),
  installment_period_paid: text('installment_period_paid').notNull(), // Format: YYYY-MM
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Define relations for join queries
export const customersRelations = relations(customersTable, ({ many }) => ({
  loans: many(mortgageLoansTable),
}));

export const mortgageLoansRelations = relations(mortgageLoansTable, ({ one, many }) => ({
  customer: one(customersTable, {
    fields: [mortgageLoansTable.customer_id],
    references: [customersTable.id],
  }),
  payments: many(paymentsTable),
}));

export const paymentsRelations = relations(paymentsTable, ({ one }) => ({
  loan: one(mortgageLoansTable, {
    fields: [paymentsTable.loan_id],
    references: [mortgageLoansTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Customer = typeof customersTable.$inferSelect;
export type NewCustomer = typeof customersTable.$inferInsert;
export type MortgageLoan = typeof mortgageLoansTable.$inferSelect;
export type NewMortgageLoan = typeof mortgageLoansTable.$inferInsert;
export type Payment = typeof paymentsTable.$inferSelect;
export type NewPayment = typeof paymentsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  customers: customersTable,
  mortgageLoans: mortgageLoansTable,
  payments: paymentsTable
};
