import React, { useEffect, useState, useCallback } from 'react';
import UserNavBar from './UserNavBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

const Expense = () => {
    const navigate = useNavigate();
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [budgetGoals, setBudgetGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Form states
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);

    // Filter states
    const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [showAll, setShowAll] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';
            if (!userId) throw new Error('User not logged in.');

            const [catRes, expRes, goalRes] = await Promise.all([
                fetch(`${API_URL}/categories`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(showAll ? `${API_URL}/expenses/user/${userId}/all` : `${API_URL}/expenses/user/${userId}?year=${filterMonth.split('-')[0]}&month=${filterMonth.split('-')[1]}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/budgetgoal/user/${userId}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            
            if (!catRes.ok) throw new Error('Failed to load categories.');
            const catData = await catRes.json();
            setCategories(catData);
            
            if (!expRes.ok) throw new Error(`HTTP Error on expenses: ${expRes.status}`);
            const expData = await expRes.json();
            setExpenses(expData);

            if (!goalRes.ok) throw new Error('Failed to load budget goals.');
            const goalData = await goalRes.json();
            setBudgetGoals(goalData);

        } catch (e) {
            setError(e.message || 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, [filterMonth, showAll]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const checkBudgetsAndNotify = async (newExpense) => {
        const relevantGoal = budgetGoals.find(g => g.categoryId === Number(newExpense.category.id));
        if (!relevantGoal) return;

        const goalStart = new Date(relevantGoal.startDate);
        const goalEnd = new Date(relevantGoal.endDate);
        const expenseDateObj = new Date(newExpense.expenseDate);
        if (expenseDateObj < goalStart || expenseDateObj > goalEnd) return;

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user.id || user.userId;
        const token = localStorage.getItem('token') || '';
            const res = await fetch(`${API_URL}/expenses/user/${userId}/all`, { headers: {'Authorization': `Bearer ${token}`}});
        if (!res.ok) return;
        const allExpenses = await res.json();
        
        const totalSpentInPeriod = allExpenses
            .filter(exp => exp.category.id === newExpense.category.id && new Date(exp.expenseDate) >= goalStart && new Date(exp.expenseDate) <= goalEnd)
            .reduce((sum, exp) => sum + exp.amount, 0);

        const percentageSpent = (totalSpentInPeriod / relevantGoal.monthlyLimit) * 100;
        const categoryName = categories.find(c => c.id === Number(newExpense.category.id))?.name || 'the category';
        
        if (percentageSpent > 100) {
            toast.error(`BUDGET EXCEEDED for ${categoryName}! Spent: $${totalSpentInPeriod.toFixed(2)}`);
        } else if (percentageSpent === 100) {
            toast.success(`Budget Limit Reached for ${categoryName}! You've spent exactly $${totalSpentInPeriod.toFixed(2)}.`);
        } else if (percentageSpent >= (relevantGoal.warningThreshold || 70)) {
            toast.warn(`Budget Warning for ${categoryName}: ${percentageSpent.toFixed(1)}% used.`);
        }
    };

    const addExpense = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';

            const expensePayload = { 
                amount: Number(amount), 
                description: description,
                category: { id: Number(categoryId) },
                expenseDate: expenseDate,
                user: { id: userId }
            };

            const response = await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': `Bearer ${token}` }) },
                body: JSON.stringify(expensePayload)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            setSuccessMessage('Expense added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            
            await checkBudgetsAndNotify(expensePayload);
            await loadData();
            
            setAmount('');
            setDescription('');
            setCategoryId('');
            
        } catch (e) {
            setError(String(e.message || e));
            setSuccessMessage('');
        }
    };
    
    const deleteExpense = async (expenseId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`${API_URL}/expenses/${expenseId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            await loadData();
        } catch (e) {
            setError(String(e.message || e));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/user/login');
    };

    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    return (
        <div>
            <UserNavBar onLogout={handleLogout} />
            <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh' }}>
                <h2>Expenses</h2>
                
                <form onSubmit={addExpense} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
                    <h3>Add Expense</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 8 }}>
                        <input type="number" step="0.01" placeholder="Amount" required value={amount} onChange={(e) => setAmount(e.target.value)} />
                        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <input type="date" required value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
                        <button type="submit" style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)' }}>Add Expense</button>
                    </div>
                </form>

                {loading && <div>Loading...</div>}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

                <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 12, flexWrap:'wrap' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                        Month:
                        <input type="month" value={filterMonth} disabled={showAll} onChange={(e)=>setFilterMonth(e.target.value)} />
                    </label>
                    <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <input type="checkbox" checked={showAll} onChange={(e)=>setShowAll(e.target.checked)} />
                        Show all months
                    </label>
                </div>

                <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
                    <thead>
                        <tr>
                            {['Amount','Description','Category','Date','Actions'].map(h => (
                                <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map(expense => (
                            <tr key={expense.id}>
                                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>${Number(expense.amount).toFixed(2)}</td>
                                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>{expense.description || ''}</td>
                                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>{expense.category?.name || 'Unknown'}</td>
                                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>{expense.expenseDate || ''}</td>
                                <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                                    <button onClick={() => deleteExpense(expense.id)} style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 10, cursor: 'pointer' }}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ marginTop: 12, fontSize: '1.2em', fontWeight: 'bold' }}>Total for Period: ${totalExpenses.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default Expense;