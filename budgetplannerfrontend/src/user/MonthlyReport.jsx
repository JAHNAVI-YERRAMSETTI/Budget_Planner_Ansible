import React, { useState, useEffect, useCallback } from 'react';
import UserNavBar from './UserNavBar';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const MonthlyReport = () => {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState(null);
    const [filterMonth, setFilterMonth] = useState(() => new Date().toISOString().slice(0, 7));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token') || '';

    const fetchReport = useCallback(async () => {
        if (!filterMonth) return;

        setLoading(true);
        setError('');
        setReportData(null);
        try {
            const userId = user.id || user.userId;
            if (!userId) throw new Error("User not logged in.");

            const [year, month] = filterMonth.split('-');
            const url = `${API_URL}/reports/user/${userId}/comprehensive?year=${year}&month=${month}`;

            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - No report data found for this month.`);
            
            const data = await response.json();
            setReportData(data);
        } catch (e) {
            setError(e.message || "Failed to fetch report.");
        } finally {
            setLoading(false);
        }
    }, [filterMonth, user.id, token]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleExport = () => {
        const userId = user.id || user.userId;
        const [year, month] = filterMonth.split('-');
        const exportUrl = `${API_URL}/reports/user/${userId}/export?year=${year}&month=${month}`;
        window.open(exportUrl, '_blank');
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/user/login');
    };

    return (
        <div>
            <UserNavBar onLogout={handleLogout} />
            <div className="container" style={{ marginLeft: '248px', padding: '24px', background: '#f8f9fa', minHeight: '100vh' }}>
                <h2>Monthly Report</h2>

                <div className="card" style={{ padding: 16, background: '#ffffff', border: '1px solid #dee2e6', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <label style={{ marginRight: '8px', fontWeight: 500 }}>Select Report Month:</label>
                        <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ced4da' }} />
                    </div>
                    <button onClick={handleExport} disabled={!reportData || loading} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', opacity: (!reportData || loading) ? 0.5 : 1 }}>
                        Export to Excel
                    </button>
                </div>

                {loading && <p>Generating report...</p>}
                {error && <p style={{ color: '#dc3545', background: '#ffeaea', padding: '12px', borderRadius: '8px' }}>{error}</p>}

                {reportData && (
                    <div>
                        {/* Summary Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <h4 style={{ margin: 0, color: '#6c757d' }}>Total Income</h4>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', margin: '8px 0 0' }}>${reportData.totalIncome.toFixed(2)}</p>
                            </div>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <h4 style={{ margin: 0, color: '#6c757d' }}>Total Expenses</h4>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545', margin: '8px 0 0' }}>${reportData.totalExpenses.toFixed(2)}</p>
                            </div>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                                <h4 style={{ margin: 0, color: '#6c757d' }}>Net Savings</h4>
                                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: reportData.netSavings < 0 ? '#ffc107' : '#17a2b8', margin: '8px 0 0' }}>${reportData.netSavings.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Income & Expense Tables */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <h3>Income Transactions</h3>
                                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                                   <thead>
                                       <tr style={{ background: '#f8f9fa' }}>
                                           <th style={{padding: '8px', border: '1px solid #dee2e6', textAlign: 'left'}}>Date</th>
                                           <th style={{padding: '8px', border: '1px solid #dee2e6', textAlign: 'left'}}>Source</th>
                                           <th style={{padding: '8px', border: '1px solid #dee2e6', textAlign: 'left'}}>Amount</th>
                                       </tr>
                                   </thead>
                                    <tbody>
                                        {reportData.incomeTransactions.map(item => (
                                            <tr key={`inc-${item.id}`}>
                                                <td style={{padding: '8px', border: '1px solid #dee2e6'}}>{item.date}</td>
                                                <td style={{padding: '8px', border: '1px solid #dee2e6'}}>{item.source}</td>
                                                <td style={{padding: '8px', border: '1px solid #dee2e6'}}>${item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h3>Expense Transactions</h3>
                                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa' }}>
                                            <th style={{padding: '8px', border: '1px solid #dee2e6', textAlign: 'left'}}>Date</th>
                                            <th style={{padding: '8px', border: '1px solid #dee2e6', textAlign: 'left'}}>Category</th>
                                            <th style={{padding: '8px', border: '1px solid #dee2e6', textAlign: 'left'}}>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportData.expenseTransactions.map(item => (
                                            <tr key={`exp-${item.id}`}>
                                                <td style={{padding: '8px', border: '1px solid #dee2e6'}}>{item.expenseDate}</td>
                                                <td style={{padding: '8px', border: '1px solid #dee2e6'}}>{item.category.name}</td>
                                                <td style={{padding: '8px', border: '1px solid #dee2e6'}}>${item.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonthlyReport;