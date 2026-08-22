export const mockSalaryStructures = {
  'DF-1024': { monthlyWage: '₹85,000', yearlyWage: '₹10,20,000', components: [['Basic Salary', '₹42,500'], ['HRA', '₹21,250'], ['Standard Allowance', '₹8,000'], ['Performance Bonus', '₹5,000'], ['Leave Travel Allowance', '₹3,250'], ['Fixed Allowance', '₹5,000']], deductions: [['Provident Fund', '₹5,100'], ['Professional Tax', '₹200']], netSalary: '₹79,700' },
  'DF-1001': { monthlyWage: '₹1,80,000', yearlyWage: '₹21,60,000', components: [['Basic Salary', '₹90,000'], ['HRA', '₹45,000'], ['Standard Allowance', '₹18,000'], ['Performance Bonus', '₹12,000'], ['Leave Travel Allowance', '₹5,000'], ['Fixed Allowance', '₹10,000']], deductions: [['Provident Fund', '₹10,800'], ['Professional Tax', '₹200']], netSalary: '₹1,69,000' },
  'DF-1088': { monthlyWage: '₹1,25,000', yearlyWage: '₹15,00,000', components: [['Basic Salary', '₹62,500'], ['HRA', '₹31,250'], ['Standard Allowance', '₹12,000'], ['Performance Bonus', '₹8,000'], ['Leave Travel Allowance', '₹4,250'], ['Fixed Allowance', '₹7,000']], deductions: [['Provident Fund', '₹7,500'], ['Professional Tax', '₹200']], netSalary: '₹1,17,300' },
  'DF-1117': { monthlyWage: '₹72,000', yearlyWage: '₹8,64,000', components: [['Basic Salary', '₹36,000'], ['HRA', '₹18,000'], ['Standard Allowance', '₹7,000'], ['Performance Bonus', '₹4,000'], ['Leave Travel Allowance', '₹3,000'], ['Fixed Allowance', '₹4,000']], deductions: [['Provident Fund', '₹4,320'], ['Professional Tax', '₹200']], netSalary: '₹67,480' },
}

export const mockPayrollHistory = {
  'DF-1024': [
    { id: 'pay-1024-1', month: 'July', year: '2026', gross: '₹85,000', deductions: '₹5,300', net: '₹79,700', status: 'PAID' },
    { id: 'pay-1024-2', month: 'June', year: '2026', gross: '₹85,000', deductions: '₹5,300', net: '₹79,700', status: 'PAID' },
    { id: 'pay-1024-3', month: 'May', year: '2026', gross: '₹85,000', deductions: '₹5,300', net: '₹79,700', status: 'FINALIZED' },
  ],
  'DF-1001': [{ id: 'pay-1001-1', month: 'July', year: '2026', gross: '₹1,80,000', deductions: '₹11,000', net: '₹1,69,000', status: 'PAID' }],
  'DF-1088': [{ id: 'pay-1088-1', month: 'July', year: '2026', gross: '₹1,25,000', deductions: '₹7,700', net: '₹1,17,300', status: 'DRAFT' }],
  'DF-1117': [{ id: 'pay-1117-1', month: 'July', year: '2026', gross: '₹72,000', deductions: '₹4,520', net: '₹67,480', status: 'PAID' }],
}
