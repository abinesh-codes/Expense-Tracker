import io
import csv
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

def generate_csv_report(expenses, incomes):
    """
    Generates a CSV string representing all transactions.
    """
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(["Type", "Date", "Title/Source", "Category", "Amount", "Description"])
    
    # Combine and sort transactions by date desc
    txs = []
    for inc in incomes:
        txs.append({
            "type": "Income",
            "date": inc.get("date", ""),
            "title": inc.get("source", ""),
            "category": "Income",
            "amount": inc.get("amount", 0.0),
            "description": inc.get("description", "")
        })
    for exp in expenses:
        txs.append({
            "type": "Expense",
            "date": exp.get("date", ""),
            "title": exp.get("title", ""),
            "category": exp.get("category", ""),
            "amount": exp.get("amount", 0.0),
            "description": exp.get("description", "")
        })
        
    txs = sorted(txs, key=lambda x: x["date"], reverse=True)
    
    for tx in txs:
        writer.writerow([tx["type"], tx["date"], tx["title"], tx["category"], f"{tx['amount']:.2f}", tx["description"]])
        
    return output.getvalue()

def generate_pdf_report(username, expenses, incomes, total_income, total_expenses, balance, currency_symbol="₹"):
    """
    Generates a stylized PDF report using ReportLab.
    """
    buffer = io.BytesIO()
    
    # Map raw currency symbols to PDF-supported printable strings to avoid Helvetica font glyph crashes
    pdf_symbol = currency_symbol
    if currency_symbol == "₹":
        pdf_symbol = "Rs."
    elif currency_symbol == "£":
        pdf_symbol = "£"
    elif currency_symbol == "€":
        pdf_symbol = "EUR "
    
    # Setup document template with standard margin bounds
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Tailored styles for premium presentation
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        textColor=colors.HexColor('#0f172a'),
        spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#64748b'),
        spaceAfter=20
    )
    
    header_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        textColor=colors.HexColor('#1e293b'),
        spaceBefore=14,
        spaceAfter=8
    )
    
    cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#334155')
    )
    
    cell_style_bold = ParagraphStyle(
        'TableCellBold',
        parent=cell_style,
        fontName='Helvetica-Bold'
    )
    
    elements = []
    
    # Header Section
    elements.append(Paragraph("SpendWise Financial Statement", title_style))
    elements.append(Paragraph(f"Prepared for: {username}  |  Generated on: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC", subtitle_style))
    
    # Summary Dashboard Table
    summary_data = [
        [
            Paragraph("<b>Total Income</b>", cell_style_bold),
            Paragraph("<b>Total Expenses</b>", cell_style_bold),
            Paragraph("<b>Net Balance</b>", cell_style_bold)
        ],
        [
            Paragraph(f"<font color='#10b981'>+{pdf_symbol}{total_income:,.2f}</font>", cell_style_bold),
            Paragraph(f"<font color='#ef4444'>-{pdf_symbol}{total_expenses:,.2f}</font>", cell_style_bold),
            Paragraph(f"<font color=\"{'#10b981' if balance >= 0 else '#ef4444'}\">{pdf_symbol}{balance:,.2f}</font>", cell_style_bold)
        ]
    ]
    
    summary_table = Table(summary_data, colWidths=[175, 175, 170])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f8fafc')),
        ('BACKGROUND', (0,1), (-1,1), colors.HexColor('#ffffff')),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
    ]))
    
    elements.append(summary_table)
    elements.append(Spacer(1, 15))
    
    # Merged Transaction History List
    elements.append(Paragraph("Recent Transactions Flow", header_style))
    
    txs = []
    for inc in incomes:
        txs.append({
            "type": "Income",
            "title": inc.get("source", ""),
            "amount": inc.get("amount", 0.0),
            "category": "Income",
            "date": inc.get("date", ""),
            "color": "#10b981"
        })
    for exp in expenses:
        txs.append({
            "type": "Expense",
            "title": exp.get("title", ""),
            "amount": exp.get("amount", 0.0),
            "category": exp.get("category", ""),
            "date": exp.get("date", ""),
            "color": "#ef4444"
        })
        
    txs = sorted(txs, key=lambda x: x["date"], reverse=True)
    
    tx_data = [
        [
            Paragraph("<b>Date</b>", cell_style_bold),
            Paragraph("<b>Type</b>", cell_style_bold),
            Paragraph("<b>Title / Source</b>", cell_style_bold),
            Paragraph("<b>Category</b>", cell_style_bold),
            Paragraph("<b>Amount</b>", cell_style_bold)
        ]
    ]
    
    # If no records exist
    if not txs:
        tx_data.append([
            Paragraph("No transactions recorded.", cell_style),
            Paragraph("-", cell_style),
            Paragraph("-", cell_style),
            Paragraph("-", cell_style),
            Paragraph("-", cell_style)
        ])
    else:
        # Cap PDF list at 50 transactions to avoid endless overflow pages in reports
        for tx in txs[:50]:
            tx_data.append([
                Paragraph(tx["date"], cell_style),
                Paragraph(f"<font color='{tx['color']}'><b>{tx['type']}</b></font>", cell_style),
                Paragraph(tx["title"], cell_style),
                Paragraph(tx["category"], cell_style),
                Paragraph(f"<font color='{tx['color']}'><b>{pdf_symbol}{tx['amount']:,.2f}</b></font>", cell_style)
            ])
            
    tx_table = Table(tx_data, colWidths=[80, 70, 180, 100, 90])
    tx_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0f172a')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#f8fafc')]),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
    ]))
    
    elements.append(tx_table)
    
    # Build the document
    doc.build(elements)
    buffer.seek(0)
    return buffer.getvalue()
