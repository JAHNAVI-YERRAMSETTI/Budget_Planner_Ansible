import React from 'react'
import { Link } from 'react-router-dom'
import MainNavBar from './MainNavBar'

const Home = () => {
  return (
    <div>
      <MainNavBar />
      <div className="container">
        <section style={{ padding: 16 }}>
          <h2>Track, Plan, and Achieve Your Budget Goals</h2>
          <p>Manage daily expenses, set monthly and category goals, and see smart insights.</p>
          <div style={{ marginTop: 12 }}>
            <Link to="/user/register" className="nav-button register">Get Started</Link>
          </div>
        </section>

        <section className="card" style={{ padding: 16, marginTop: 16 }}>
          <h3>Payment App Tracking</h3>
          <p>Import or connect your payment app transactions. We will prompt you to categorize unknown merchants and remember your preference for next time.</p>
          <div style={{ marginTop: 8 }}>
            <Link to="/user/budgets">Go to Budgets</Link>
          </div>
        </section>

        <section className="card" style={{ padding: 16, marginTop: 16 }}>
          <h3>Retailer-to-Category Mapping</h3>
          <p>When you pay a known retailer, we automatically apply your chosen category. You can always change it if needed.</p>
          <div style={{ marginTop: 8 }}>
            <Link to="/user/budgets">Review Budgets</Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home
