
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

import { createCustomerInputSchema, createMortgageLoanInputSchema, createPaymentInputSchema } from './schema';
import { createCustomer } from './handlers/create_customer';
import { getCustomers } from './handlers/get_customers';
import { createMortgageLoan } from './handlers/create_mortgage_loan';
import { getLoansWithCustomers } from './handlers/get_loans_with_customers';
import { createPayment } from './handlers/create_payment';
import { getPaymentHistory } from './handlers/get_payment_history';
import { getDelinquencyStatus } from './handlers/get_delinquency_status';
import { getOverdueLoans } from './handlers/get_overdue_loans';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Customer management routes
  createCustomer: publicProcedure
    .input(createCustomerInputSchema)
    .mutation(({ input }) => createCustomer(input)),
  
  getCustomers: publicProcedure
    .query(() => getCustomers()),
  
  // Mortgage loan management routes
  createMortgageLoan: publicProcedure
    .input(createMortgageLoanInputSchema)
    .mutation(({ input }) => createMortgageLoan(input)),
  
  getLoansWithCustomers: publicProcedure
    .query(() => getLoansWithCustomers()),
  
  // Payment management routes
  createPayment: publicProcedure
    .input(createPaymentInputSchema)
    .mutation(({ input }) => createPayment(input)),
  
  getPaymentHistory: publicProcedure
    .query(() => getPaymentHistory()),
  
  // Delinquency and collection routes
  getDelinquencyStatus: publicProcedure
    .query(() => getDelinquencyStatus()),
  
  getOverdueLoans: publicProcedure
    .query(() => getOverdueLoans()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`KPR Collection Dashboard TRPC server listening at port: ${port}`);
}

start();
