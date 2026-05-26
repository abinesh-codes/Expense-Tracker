def generate_financial_insights(total_income, total_expenses, category_totals):
    insights = []
    
    if total_income == 0 and total_expenses == 0:
        return [
            "Welcome to SpendWise! Add your first income and expense items to unlock personalized financial insights.",
            "Set budget goals in your Profile page to stay alert and build great saving habits."
        ]
        
    balance = total_income - total_expenses
    savings_rate = 0
    if total_income > 0:
        savings_rate = (balance / total_income) * 100
        
    # Insight 1: Savings rate advice
    if savings_rate > 20:
        insights.append(f"🟢 **Excellent Saving Rate**: You saved {savings_rate:.1f}% of your income this month! This exceeds the recommended 20% savings rule. Consider moving these savings into investments.")
    elif savings_rate > 5:
        insights.append(f"🟡 **Healthy Balance**: You saved {savings_rate:.1f}% of your income. That's a good buffer, but see if you can trim non-essential items next month to hit 20%.")
    elif savings_rate >= 0:
        insights.append(f"⚠️ **Tight Cash Flow**: You saved only {savings_rate:.1f}% of your income. You are living very close to your means. Try reviewing your subscriptions and non-essential expenses.")
    else:
        deficit_pct = (abs(balance) / total_income * 100) if total_income > 0 else 100
        insights.append(f"🚨 **Deficit Alert**: You are spending {deficit_pct:.1f}% more than you earn! High interest debt can accumulate quickly; immediate budget trimming is strongly recommended.")
        
    # Insight 2: Category distribution spikes
    if total_expenses > 0:
        dominant_category = None
        max_amt = 0
        for cat, amt in category_totals.items():
            if amt > max_amt:
                max_amt = amt
                dominant_category = cat
                
        if dominant_category:
            pct = (max_amt / total_expenses) * 100
            if pct > 30 and dominant_category not in ["Bills", "Health"]:
                insights.append(f"🍕 **Concentrated Spending**: **{dominant_category}** represents {pct:.1f}% of all expenses. Try setting a specific weekly budget cap for this category.")
            elif pct > 15:
                insights.append(f"📊 **Category Focus**: Your largest discretionary expense category is **{dominant_category}** at {pct:.1f}%. Make sure to verify whether these are essential or luxury spends.")
                
    # Insight 3: Dynamic tips based on categories
    bills_pct = (category_totals.get("Bills", 0) / total_expenses * 100) if total_expenses > 0 else 0
    food_pct = (category_totals.get("Food", 0) / total_expenses * 100) if total_expenses > 0 else 0
    
    if food_pct > 25:
        insights.append("💡 **Food Spending Tip**: Preparing meals at home or meal prepping once a week can cut your Food and Dining costs by up to 40%!")
    if bills_pct > 40:
        insights.append("💡 **Fixed Expenses Tip**: Your utility and subscription bills are quite high. Audit your active digital subscriptions or look for bundled service plans to save.")
        
    # Fallback to make sure there are always 3 insights
    if len(insights) < 3:
        insights.append("💡 **General Wealth Strategy**: Try the standard 50/30/20 budget framework: 50% for Needs, 30% for Wants, and 20% for Savings/Debt reduction.")
        
    return insights
