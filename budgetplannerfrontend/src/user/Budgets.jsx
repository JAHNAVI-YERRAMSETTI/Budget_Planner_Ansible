import React, { useEffect, useState, useCallback, useMemo } from 'react';
import UserNavBar from './UserNavBar';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const Budgets = () => {
    const navigate = useNavigate();
    const [budgetGoals, setBudgetGoals] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allExpenses, setAllExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    
    // Form states
    const [targetAmount, setTargetAmount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [warningThreshold, setWarningThreshold] = useState('');
    
    // Filter states
    const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        setStartDate(firstDay.toISOString().split('T')[0]);
        setEndDate(lastDay.toISOString().split('T')[0]);
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';
            if (!userId) throw new Error('User not logged in.');

            const goalsUrl = `${API_URL}/budgetgoal/user/${userId}`; 
            
            const [catRes, goalsRes, expensesRes] = await Promise.all([
                fetch(`${API_URL}/categories`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(goalsUrl, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/expenses/user/${userId}/all`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (!catRes.ok) throw new Error('Failed to load categories.');
            const catData = await catRes.json();
            setCategories(catData);

            if (!goalsRes.ok) throw new Error(`Failed to load Budget Goals: HTTP Error ${goalsRes.status}`);
            const goalsData = await goalsRes.json();
            setBudgetGoals(goalsData);

            if (!expensesRes.ok) throw new Error('Failed to load expenses.');
            const expensesData = await expensesRes.json();
            setAllExpenses(expensesData);

        } catch (e) {
            setError(e.message || 'Failed to load data.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const visibleBudgets = useMemo(() => {
        if (showAll) return budgetGoals;
        return budgetGoals.filter(goal => {
            const goalStart = new Date(goal.startDate);
            const goalEnd = new Date(goal.endDate);
            const [year, month] = filterMonth.split('-').map(Number);
            const filterStart = new Date(year, month - 1, 1);
            const filterEnd = new Date(year, month, 0);
            return goalStart <= filterEnd && goalEnd >= filterStart;
        });
    }, [budgetGoals, filterMonth, showAll]);

    const addBudgetGoal = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (new Date(endDate) < new Date(startDate)) {
            setError('End date must be after start date');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const userId = user.id || user.userId;
            const token = localStorage.getItem('token') || '';
            if (!userId) throw new Error('User not logged in.');

            const response = await fetch(`${API_URL}/budgetgoal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ 
                    monthlyLimit: Number(targetAmount),
                    startDate,
                    endDate,
                    warningThreshold: warningThreshold ? Number(warningThreshold) : 70,
                    user: { id: userId },
                    category: { id: Number(categoryId) }
                })
            });

            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || `HTTP ${response.status}`);
            
            setSuccessMessage('Budget goal added successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);

            await loadData();

            setTargetAmount('');
            setCategoryId('');
            setWarningThreshold('');
        } catch (e) {
            setError(String(e.message || e));
        }
    };

    const deleteBudgetGoal = async (budgetGoalId) => {
        if (!window.confirm('Are you sure you want to delete this budget goal?')) return;
        
        try {
            const token = localStorage.getItem('token') || '';
            const response = await fetch(`${API_URL}/budgetgoal/${budgetGoalId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
            });
            
            const responseData = await response.json();
            if (!response.ok) throw new Error(responseData.error || `HTTP ${response.status}`);
            
            await loadData();
        } catch (e) {
            setError(String(e.message || e));
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/user/login');
    };
    
    const totalGoalAmount = visibleBudgets.reduce((s, g) => s + Number(g.monthlyLimit || 0), 0);

    return (
        <div>
            <UserNavBar onLogout={handleLogout} />
            <div className="container" style={{ background: '#ffffff', padding: 16, marginLeft: '248px', minHeight: '100vh' }}>
                <h2>Budget Goals</h2>
                
                <form onSubmit={addBudgetGoal} className="card" style={{ padding: 16, marginBottom: 16, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
                    <h3>Add Budget Goal</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 8 }}>
                        <input type="number" step="0.01" min="0.01" placeholder="Target Amount" required value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} />
                        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        <input type="number" min="1" max="100" placeholder="Warning % (e.g., 70)" value={warningThreshold} onChange={(e) => setWarningThreshold(e.target.value)} title="Percentage threshold for warnings (default 70%)" />
                    </div>
                    <div style={{ marginTop: 8 }}>
                        <button type="submit" style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 24px rgba(102,126,234,0.25)' }}>Add Goal</button>
                    </div>
                </form>

                {loading && <div>Loading...</div>}
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

                <div style={{ display:'flex', alignItems:'center', gap: 12, marginBottom: 12, flexWrap:'wrap' }}>
                    <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                        Active in Month:
                        <input type="month" value={filterMonth} disabled={showAll} onChange={(e)=>setFilterMonth(e.target.value)} />
                    </label>
                    <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <input type="checkbox" checked={showAll} onChange={(e)=>setShowAll(e.target.checked)} />
                        Show all goals
                    </label>
                </div>

                <table className="table" style={{ width:'100%', borderCollapse:'separate', borderSpacing:0, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, boxShadow:'0 8px 24px rgba(15,23,42,0.06)' }}>
                    <thead>
                        <tr>
                            {['Category','Target Amount','Spent / Progress','Period','Warning %','Status','Actions'].map(h => (
                                <th key={h} style={{ textAlign:'left', padding:'12px 14px', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color:'#fff' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {visibleBudgets.map(goal => {
                            const goalStart = new Date(goal.startDate);
                            const goalEnd = new Date(goal.endDate);
                            const spentInPeriod = allExpenses
                                .filter(exp => {
                                    const expDate = new Date(exp.expenseDate);
                                    return exp.category && exp.category.id === goal.categoryId && expDate >= goalStart && expDate <= goalEnd;
                                })
                                .reduce((sum, exp) => sum + exp.amount, 0);

                            const percentageSpent = goal.monthlyLimit > 0 ? (spentInPeriod / goal.monthlyLimit) * 100 : 0;
                            
                            // --- UPDATED: More specific status logic ---
                            let status = { text: 'Active', color: '#17a2b8' }; // Blue
                            if (percentageSpent > 100) {
                                status = { text: 'Exceeded', color: '#dc3545' }; // Red
                            } else if (percentageSpent === 100) {
                                status = { text: 'Limit Reached', color: '#28a745' }; // Green
                            } else if (percentageSpent >= (goal.warningThreshold || 70)) {
                                status = { text: 'Warning', color: '#ffc107' }; // Yellow
                            }
                            // --- END OF UPDATE ---

                            const categoryName = categories.find(c => c.id === goal.categoryId)?.name || 'Uncategorized';
                            
                            return (
                                <tr key={goal.id}>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>{categoryName}</td>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>${(goal.monthlyLimit || 0).toLocaleString()}</td>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>${spentInPeriod.toLocaleString()} ({percentageSpent.toFixed(1)}%)</td>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>{goal.startDate} to {goal.endDate}</td>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>{goal.warningThreshold || 70}%</td>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                                        <span style={{ 
                                            color: status.color, 
                                            fontWeight: 'bold',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: status.color + '20'
                                        }}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td style={{ padding:'10px 14px', borderTop:'1px solid #eef2f7' }}>
                                        <button onClick={() => deleteBudgetGoal(goal.id)} style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', color: 'white', border: 'none', padding: '6px 10px', borderRadius: 10, cursor: 'pointer' }}>Delete</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div style={{ marginTop: 12, fontWeight: 'bold' }}>Total Goal Amount for Period: ${totalGoalAmount.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default Budgets;
