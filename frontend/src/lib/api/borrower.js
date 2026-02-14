/**
 * Borrower API endpoints
 */

import { post, get } from './client';

/**
 * Request a loan and get matching lenders
 * @param {number} amount - Requested loan amount
 * @returns {Promise<object>} Borrower info and matching lenders
 */
export async function requestLoan(amount) {
  return post('/borrower/requestloan', { amount }, true);
}

/**
 * Select a loan option from a lender
 * @param {object} loanData - Loan selection data
 * @param {number} loanData.loan_amt - Loan amount
 * @param {number} loanData.duration - Duration in days
 * @param {number} loanData.lender_id - Lender ID
 * @param {number} loanData.borrower_id - Borrower ID
 * @param {number} loanData.option_id - Option ID
 * @returns {Promise<object>} Loan ID and status
 */
export async function selectLoan(loanData) {
  return post('/borrower/selectloan', loanData, true);
}

/**
 * Get all loans for the authenticated borrower
 * @returns {Promise<object>} List of loans
 */
export async function getBorrowerLoans() {
  return get('/borrower/loans', true);
}

/**
 * Get details for a specific loan
 * @param {string} loanId - Loan ID
 * @returns {Promise<object>} Loan details
 */
export async function getBorrowerLoanDetail(loanId) {
  return get(`/borrower/${loanId}`, true);
}
