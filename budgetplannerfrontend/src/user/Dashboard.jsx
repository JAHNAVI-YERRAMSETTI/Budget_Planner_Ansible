import React, { useEffect, useMemo, useState, useCallback } from 'react';
import UserNavBar from './UserNavBar';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const navigate = useNavigate();
    const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [summary, setSummary] = useState(null);
    const [budgetAlerts, setBudgetAlerts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const loadDashboardData = useCallback(async () => {
        
        setLoading(true);
        setError('');
        try {
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';
            if (!userId) { throw new Error("User not logged in.") }

            const authHeaders = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const [year, monthNum] = month.split('-').map(Number);

            // UPDATED: Removed the fetch call for '/reports' as it's no longer needed for trends
            const [monthIncomes, monthExpenses, allExpensesForAlerts, budgetsData] = await Promise.all([
                fetch(`${API_URL}/incomes/user/${userId}?year=${year}&month=${monthNum}`, { headers: authHeaders }).then(res => res.ok ? res.json() : []),
                fetch(`${API_URL}/expenses/user/${userId}?year=${year}&month=${monthNum}`, { headers: authHeaders }).then(res => res.ok ? res.json() : []),
                fetch(`${API_URL}/expenses/user/${userId}/all`, { headers: authHeaders }).then(res => res.ok ? res.json() : []),
                fetch(`${API_URL}/budgetgoal/user/${userId}/all`, { headers: authHeaders }).then(res => res.ok ? res.json() : [])
            ]);
            
            const totalIncome = monthIncomes.reduce((sum, income) => sum + (income.amount || 0), 0);
            const totalExpenses = monthExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
            
            const s = { income: totalIncome, expenses: totalExpenses };
            
            // Generate budget alerts
            const monthStart = new Date(year, monthNum - 1, 1);
            const monthEnd = new Date(year, monthNum, 0);
            const alerts = [];
            budgetsData.forEach(budget => {
                const budgetStart = new Date(budget.startDate);
                const budgetEnd = new Date(budget.endDate);
                
                if (monthStart <= budgetEnd && monthEnd >= budgetStart) {
                    const categoryExpenses = allExpensesForAlerts.filter(expense => {
                        const expenseDate = new Date(expense.expenseDate);
                        return expense.category?.id === budget.categoryId && 
                               expenseDate >= monthStart && 
                               expenseDate <= monthEnd;
                    });
                    
                    const totalSpent = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                    if (budget.monthlyLimit > 0) {
                        const spendingPercentage = (totalSpent / budget.monthlyLimit) * 100;
                        const warningThreshold = budget.warningThreshold || 70;
                        
                        if (spendingPercentage >= warningThreshold) {
                            alerts.push({
                                category: budget.category?.name || 'Uncategorized',
                                spent: totalSpent,
                                budget: budget.monthlyLimit,
                                percentage: spendingPercentage,
                                isOverBudget: spendingPercentage >= 100
                            });
                        }
                    }
                }
            });

            setSummary(s);
            setBudgetAlerts(alerts);
            
        } catch (e) {
            setError(String(e.message || e));
        } finally {
            setLoading(false);
        }
    }, [month, user.id]);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    const savingsPercent = useMemo(() => {
        if (!summary || summary.income <= 0) return 0;
        const income = summary.income || 0;
        const expenses = summary.expenses || 0;
        return Math.round(((income - expenses) / income) * 100);
    }, [summary]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        navigate('/user/login');
    };

    return (
        <div>
            <UserNavBar onLogout={handleLogout} />
            <div className="container" style={{ padding: 16, background: '#ffffff', marginLeft: '248px', minHeight: '100vh' }}>
                <div>
                    <h2 style={{ color: '#667eea', fontWeight: 'bold', fontSize: '2rem' }}>
                        Dashboard
                    </h2>
                </div>
                <div style={{ marginBottom: 12 }}>
                    <label>Month: </label>
                    <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
                </div>
                {loading && <div>Loading...</div>}
                {error && <div style={{ color: 'black' }}>{error}</div>}
                {summary && (
                    <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                        {[
                            { label: 'Income', value: summary.income?.toFixed?.(2) ?? "0.00" },
                            { label: 'Expenses', value: summary.expenses?.toFixed?.(2) ?? "0.00" },
                            { label: 'Saved', value: (summary.income - summary.expenses)?.toFixed?.(2) ?? "0.00" },
                            { label: 'Saved %', value: `${savingsPercent}%` }
                        ].map((c) => (
                            <div key={c.label} className="card" style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s ease',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: 14,
                                padding: 12,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                textAlign: 'center'
                            }}>
                                <div className="card-title" style={{color: '#6b7280', marginBottom: '8px'}}>{c.label}</div>
                                <div className="card-value" style={{fontSize: '1.75rem', fontWeight: 'bold', color: '#111827'}}>{c.value}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Budget Alerts */}
                {budgetAlerts.length > 0 && (
                    <div style={{ marginTop: 24 }}>
                        <h3 style={{ color: '#dc3545' }}>⚠ Budget Alerts</h3>
                        <div style={{ display: 'grid', gap: 12 }}>
                            {budgetAlerts.map((alert, index) => (
                                <div key={index} style={{ 
                                    padding: 12, 
                                    backgroundColor: alert.isOverBudget ? '#ffeaea' : '#fff3cd', 
                                    borderRadius: 8, 
                                    border: `1px solid ${alert.isOverBudget ? '#dc3545' : '#ffc107'}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <strong style={{ color: alert.isOverBudget ? '#dc3545' : '#856404' }}>
                                            {alert.category}
                                        </strong>
                                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                                            ${alert.spent.toFixed(2)} of ${alert.budget.toFixed(2)} ({alert.percentage.toFixed(1)}%)
                                        </div>
                                    </div>
                                    <span style={{ 
                                        color: alert.isOverBudget ? '#dc3545' : '#856404',
                                        fontWeight: 'bold',
                                        fontSize: '14px'
                                    }}>
                                        {alert.isOverBudget ? 'OVER BUDGET' : 'WARNING'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div style={{ marginTop: 24 }}>
                    <h3>Quick Actions</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                        <button onClick={() => navigate('/user/expense')} style={{ padding: 16, background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                            Add Expense
                        </button>
                        <button onClick={() => navigate('/user/income')} style={{ padding: 16, background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                            Add Income
                        </button>
                        <button onClick={() => navigate('/user/budgets')} style={{ padding: 16, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                            Manage Budgets
                        </button>
                        <button onClick={() => navigate('/user/analysis')} style={{ padding: 16, background: 'linear-gradient(135deg, #4ecdc4, #45b7d1)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                            View Analysis
                        </button>
                    </div>
                </div>

                {/* REMOVED: Month-over-Month section is no longer displayed */}
                
            </div>
        </div>
    );
}

export default Dashboard;
