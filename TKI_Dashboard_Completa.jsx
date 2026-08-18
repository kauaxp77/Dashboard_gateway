import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TKIDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  // ==================== DADOS SIMULADOS ====================
  const balanceData = {
    current: 2458750.32,
    change: 8.42,
    status: 'Aprovado',
    statusPercent: 100,
    previousBalance: 2268910.23
  };

  const chartData = [
    { date: '01 Jan', value: 2100000, transactions: 145 },
    { date: '07 Jan', value: 2200000, transactions: 189 },
    { date: '14 Jan', value: 2280000, transactions: 234 },
    { date: '21 Jan', value: 2350000, transactions: 312 },
    { date: '28 Jan', value: 2420000, transactions: 401 },
    { date: '04 Fev', value: 2458750, transactions: 456 }
  ];

  const recentTransactions = [
    { id: 1, name: 'Pagamento Pix', value: 1250.00, date: '04 Fev, 14:32', status: 'Aprovado', type: 'pix', fee: 0 },
    { id: 2, name: 'Pagamento Cartão', value: 3850.00, date: '03 Fev, 09:15', status: 'Aprovado', type: 'cartao', fee: 2.99 },
    { id: 3, name: 'Pagamento Pix', value: 980.00, date: '02 Fev, 16:45', status: 'Aprovado', type: 'pix', fee: 0 },
    { id: 4, name: 'Pagamento Boleto', value: 2100.00, date: '01 Fev, 11:20', status: 'Aprovado', type: 'boleto', fee: 1.50 },
    { id: 5, name: 'Transferência TEF', value: 5600.00, date: '31 Jan, 08:00', status: 'Aprovado', type: 'tef', fee: 0 },
    { id: 6, name: 'Pagamento Link', value: 450.00, date: '30 Jan, 15:30', status: 'Aprovado', type: 'link', fee: 1.99 }
  ];

  const splitData = [
    { name: 'Recebedor Principal', value: 60, amount: 1475250.19, fill: '#2a78d6' },
    { name: 'Parceiro Comercial', value: 25, amount: 614687.58, fill: '#eb6834' },
    { name: 'Afiliado', value: 15, amount: 368812.55, fill: '#1baf7a' }
  ];

  const receivers = [
    { id: 1, name: 'Empresa Principal', percent: 60, color: '#2a78d6', code: 'CODE: ***', amount: 1475250.19, active: true },
    { id: 2, name: 'Parceiro Comercial', percent: 25, color: '#eb6834', code: 'CODE: ***2034', amount: 614687.58, active: true },
    { id: 3, name: 'Afiliado', percent: 15, color: '#1baf7a', code: 'CODE: ***0101', amount: 368812.55, active: true }
  ];

  const apiConnections = [
    { id: 1, name: 'Pix', status: 'Ativo', icon: '📱', requests: 15234, errors: 0 },
    { id: 2, name: 'Cartões', status: 'Ativo', icon: '💳', requests: 8923, errors: 2 },
    { id: 3, name: 'Webhooks', status: 'Ativo', icon: '🔗', requests: 45670, errors: 0 }
  ];

  const multiacquirers = [
    { id: 1, name: 'Adquirente A', status: 'Ativo', letter: 'A', color: '#2a78d6', volume: 892345.23 },
    { id: 2, name: 'Adquirente B', status: 'Ativo', letter: 'B', color: '#eb6834', volume: 654123.45 },
    { id: 3, name: 'Adquirente C', status: 'Ativo', letter: 'C', color: '#1baf7a', volume: 912281.64 }
  ];

  const operationMetrics = [
    { label: 'Transações', value: 456, change: '+12.5%' },
    { label: 'Taxa Aprovação', value: '99.8%', change: '+0.2%' },
    { label: 'Tempo Médio', value: '2.3s', change: '-0.4s' },
    { label: 'Disponibilidade', value: '99.99%', change: 'Estável' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: '📊' },
    { id: 'transactions', label: 'Transações', icon: '💳' },
    { id: 'receivers', label: 'Recebedores', icon: '👥' },
    { id: 'split', label: 'Split de Pagamentos', icon: '🎯' },
    { id: 'api', label: 'API', icon: '⚙️' },
    { id: 'connections', label: 'Conexões', icon: '🔗' },
    { id: 'multiacquirer', label: 'Multiadquirência', icon: '🏪' },
    { id: 'reports', label: 'Relatórios', icon: '📈' },
    { id: 'settings', label: 'Configurações', icon: '🔧' }
  ];

  // ==================== FUNÇÕES AUXILIARES ====================
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Aprovado': return '#0ca30c';
      case 'Pendente': return '#fab219';
      case 'Rejeitado': return '#d03b3b';
      default: return '#999';
    }
  };

  // ==================== COMPONENTES ====================
  const MetricCard = ({ label, value, change }) => (
    <div style={styles.metricCard}>
      <p style={styles.metricLabel}>{label}</p>
      <h3 style={styles.metricValue}>{value}</h3>
      <p style={styles.metricChange}>{change}</p>
    </div>
  );

  const TransactionCard = ({ tx }) => (
    <div
      key={tx.id}
      style={{
        ...styles.transactionItem,
        ...(selectedTransaction?.id === tx.id ? styles.transactionItemActive : {})
      }}
      onClick={() => setSelectedTransaction(selectedTransaction?.id === tx.id ? null : tx)}
    >
      <div style={styles.txIcon}>
        {tx.type === 'pix' && '📱'}
        {tx.type === 'cartao' && '💳'}
        {tx.type === 'boleto' && '📄'}
        {tx.type === 'tef' && '🔄'}
        {tx.type === 'link' && '🔗'}
      </div>
      <div style={styles.txInfo}>
        <p style={styles.txName}>{tx.name}</p>
        <p style={styles.txDate}>{tx.date}</p>
      </div>
      <div style={styles.txRight}>
        <p style={styles.txValue}>{formatCurrency(tx.value)}</p>
        <span style={{ ...styles.txStatus, color: getStatusColor(tx.status) }}>
          ✓ {tx.status}
        </span>
      </div>
      {selectedTransaction?.id === tx.id && (
        <div style={styles.txDetails}>
          <p>Taxa: {formatCurrency(tx.fee)}</p>
          <p>ID: #TXN{tx.id.toString().padStart(8, '0')}</p>
        </div>
      )}
    </div>
  );

  // ==================== RENDERIZAÇÃO ====================
  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>◆ TKI</div>
          <p style={styles.logoText}>TECNOLOGIA</p>
          <p style={styles.logoVersion}>v2.5.0</p>
        </div>

        <nav style={styles.nav}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                ...styles.navItem,
                ...(activePage === item.id ? styles.navItemActive : {})
              }}
              title={item.label}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userProfile}>
            <div style={styles.userAvatar}>JD</div>
            <div style={styles.userInfo}>
              <p style={styles.userName}>João Developer</p>
              <p style={styles.userEmail}>dev@tki.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <div style={styles.mainContent}>
        {/* ===== HEADER ===== */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Seu Próprio Gateway</h1>
            <p style={styles.headerSubtitle}>Código-fonte completo • Solução open-source</p>
          </div>
          <div style={styles.headerRight}>
            <button style={styles.whatsappBtn}>💬 Conversar no WhatsApp</button>
            <button style={styles.apiDocsBtn}>📚 Documentação</button>
          </div>
        </div>

        {/* ===== CONTEÚDO ===== */}
        <div style={styles.content}>
          {activePage === 'dashboard' && (
            <>
              {/* SEÇÃO DE SALDO */}
              <div style={styles.balanceSection}>
                <div style={styles.balanceCard}>
                  <p style={styles.balanceLabel}>💰 Saldo disponível</p>
                  <h2 style={styles.balanceValue}>{formatCurrency(balanceData.current)}</h2>
                  <p style={styles.balanceChange}>↑ 8,42% em relação a ontem</p>

                  <div style={styles.divider}></div>

                  <p style={styles.systemStatusLabel}>🔧 Status da operação</p>
                  <div style={styles.statusBadge}>
                    <span style={styles.statusDot}>✓</span>
                    <span style={styles.statusText}>{balanceData.status}</span>
                    <span style={styles.statusPercent}>{balanceData.statusPercent}%</span>
                  </div>

                  <div style={styles.operationDetails}>
                    <p style={styles.detailItem}>🟢 Todos os serviços ativos</p>
                    <p style={styles.detailItem}>⚡ Latência: 45ms</p>
                    <p style={styles.detailItem}>📡 Uptime: 99.99%</p>
                  </div>
                </div>

                {/* GRÁFICO DE TENDÊNCIA */}
                <div style={styles.chartContainer}>
                  <div style={styles.chartHeader}>
                    <h3 style={styles.chartTitle}>Saldo ao longo do tempo</h3>
                    <p style={styles.chartSubtitle}>Últimos 35 dias</p>
                  </div>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3987e5" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3987e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#666" style={{ fontSize: '12px' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '6px', padding: '12px' }}
                        formatter={(value) => formatCurrency(value)}
                        labelStyle={{ color: '#999' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#3987e5" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* MÉTRICAS OPERACIONAIS */}
              <div style={styles.metricsGrid}>
                {operationMetrics.map((metric, idx) => (
                  <MetricCard key={idx} {...metric} />
                ))}
              </div>

              {/* TRANSAÇÕES E SPLIT */}
              <div style={styles.gridRow}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>Transações recentes</h3>
                    <a style={styles.cardLink} href="#all">Ver todas →</a>
                  </div>
                  <div style={styles.transactionsList}>
                    {recentTransactions.slice(0, 4).map(tx => (
                      <TransactionCard key={tx.id} tx={tx} />
                    ))}
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Split de pagamentos</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1, minHeight: '200px' }}>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={splitData}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                            startAngle={90}
                            endAngle={-270}
                          >
                            {splitData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div style={styles.splitLegend}>
                      {splitData.map((item, idx) => (
                        <div key={idx} style={styles.legendItem}>
                          <span style={{ ...styles.legendDot, backgroundColor: item.fill }}></span>
                          <div>
                            <p style={styles.legendName}>{item.name}</p>
                            <p style={styles.legendPercent}>{item.value}% ({formatCurrency(item.amount)})</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RECEBEDORES, API, MULTIADQUIRENTES */}
              <div style={styles.gridRow}>
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Recebedores configurados</h3>
                  <div style={styles.receiversContainer}>
                    {receivers.map((receiver, idx) => (
                      <div key={idx} style={styles.receiverItem}>
                        <span style={{ ...styles.receiverDot, backgroundColor: receiver.color }}></span>
                        <div style={{ flex: 1 }}>
                          <p style={styles.receiverName}>{receiver.name}</p>
                          <p style={styles.receiverCode}>{receiver.code}</p>
                          <p style={styles.receiverAmount}>{formatCurrency(receiver.amount)}</p>
                        </div>
                        <div style={styles.receiverRight}>
                          <p style={styles.receiverPercent}>{receiver.percent}%</p>
                          <span style={{ fontSize: '10px', color: '#0ca30c' }}>● Ativo</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Conexões de API</h3>
                  <div style={styles.apiContainer}>
                    {apiConnections.map((api, idx) => (
                      <div key={idx} style={styles.apiItem}>
                        <div style={styles.apiIcon}>{api.icon}</div>
                        <div style={{ flex: 1 }}>
                          <p style={styles.apiName}>{api.name}</p>
                          <p style={styles.apiStats}>{api.requests.toLocaleString()} req • {api.errors} erros</p>
                        </div>
                        <span style={styles.activeLabel}>Ativo</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>Multiadquirência</h3>
                  <div style={styles.acquirersContainer}>
                    {multiacquirers.map((acquirer, idx) => (
                      <div key={idx} style={styles.acquirerItem}>
                        <div style={{ ...styles.acquirerIcon, backgroundColor: acquirer.color }}>
                          {acquirer.letter}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={styles.acquirerName}>{acquirer.name}</p>
                          <p style={styles.acquirerVolume}>{formatCurrency(acquirer.volume)}</p>
                        </div>
                        <span style={styles.activeLabel}>Ativo</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={styles.ctaSection}>
                <div style={styles.ctaCard}>
                  <h3 style={styles.ctaTitle}>Pronto para integrar?</h3>
                  <p style={styles.ctaDescription}>Solicite uma apresentação personalizada e comece seu próprio gateway em minutos.</p>
                  <button style={styles.ctaButton}>Solicitar apresentação →</button>
                </div>
              </div>
            </>
          )}

          {activePage !== 'dashboard' && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Seção em desenvolvimento</h2>
              <p style={styles.subtitle}>A página "{activePage}" será implementada com todos os recursos completos.</p>
              <button style={styles.backButton} onClick={() => setActivePage('dashboard')}>
                ← Voltar ao Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== ESTILOS ====================
const styles = {
  // Container principal
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#0f0f0f',
    color: '#fff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    overflow: 'hidden'
  },

  // SIDEBAR
  sidebar: {
    width: '260px',
    backgroundColor: '#1a1a1a',
    padding: '20px 0',
    overflowY: 'auto',
    borderRight: '1px solid #222',
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '16px 20px 24px',
    borderBottom: '1px solid #222',
    textAlign: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#3987e5',
    letterSpacing: '2px',
    margin: 0
  },
  logoText: {
    fontSize: '10px',
    color: '#999',
    marginTop: '4px',
    letterSpacing: '1px',
    margin: '4px 0 0 0'
  },
  logoVersion: {
    fontSize: '9px',
    color: '#666',
    margin: '4px 0 0 0'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '13px',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    fontWeight: '500'
  },
  navItemActive: {
    backgroundColor: '#2a3a4a',
    color: '#3987e5',
    borderLeft: '2px solid #3987e5',
    paddingLeft: '12px'
  },
  navIcon: {
    fontSize: '16px',
    minWidth: '20px'
  },
  navLabel: {
    flex: 1,
    fontSize: '13px'
  },
  sidebarFooter: {
    padding: '16px',
    borderTop: '1px solid #222',
    marginTop: 'auto'
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    backgroundColor: '#3987e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '12px',
    fontWeight: '600',
    margin: 0,
    color: '#fff'
  },
  userEmail: {
    fontSize: '10px',
    color: '#999',
    margin: '2px 0 0 0'
  },

  // MAIN CONTENT
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  // HEADER
  header: {
    padding: '20px 32px',
    borderBottom: '1px solid #222',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    backdropFilter: 'blur(10px)',
    zIndex: 10
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    color: '#fff'
  },
  headerSubtitle: {
    fontSize: '13px',
    color: '#999',
    margin: 0
  },
  headerRight: {
    display: 'flex',
    gap: '12px'
  },
  whatsappBtn: {
    padding: '10px 16px',
    backgroundColor: '#25D366',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  apiDocsBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#999',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'all 0.2s',
  },

  // CONTENT
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 32px',
    paddingBottom: '40px'
  },

  // BALANCE SECTION
  balanceSection: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    minHeight: '320px'
  },
  balanceCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
    width: '300px',
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden'
  },
  balanceLabel: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 8px 0',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  balanceValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#fff',
    fontVariantNumeric: 'tabular-nums'
  },
  balanceChange: {
    fontSize: '12px',
    color: '#0ca30c',
    margin: '0 0 20px 0',
    fontWeight: '500'
  },
  divider: {
    height: '1px',
    backgroundColor: '#222',
    margin: '20px 0'
  },
  systemStatusLabel: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 12px 0',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.5px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    backgroundColor: 'rgba(12, 163, 12, 0.1)',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '16px',
    border: '1px solid rgba(12, 163, 12, 0.2)'
  },
  statusDot: {
    color: '#0ca30c',
    fontSize: '16px'
  },
  statusText: {
    color: '#0ca30c',
    fontWeight: '600'
  },
  statusPercent: {
    color: '#0ca30c',
    marginLeft: 'auto',
    fontSize: '12px'
  },
  operationDetails: {
    marginTop: '12px'
  },
  detailItem: {
    fontSize: '11px',
    color: '#999',
    margin: '6px 0',
    display: 'flex',
    alignItems: 'center'
  },

  // CHART
  chartContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  chartHeader: {
    marginBottom: '16px'
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: '0 0 4px 0',
    color: '#fff'
  },
  chartSubtitle: {
    fontSize: '12px',
    color: '#999',
    margin: 0
  },

  // METRICS GRID
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '32px'
  },
  metricCard: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '16px',
    textAlign: 'center'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 8px 0',
    fontWeight: '500'
  },
  metricValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 6px 0',
    color: '#fff'
  },
  metricChange: {
    fontSize: '11px',
    color: '#0ca30c',
    margin: 0
  },

  // GRID
  gridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },

  // CARD
  card: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    margin: 0,
    color: '#fff'
  },
  cardLink: {
    fontSize: '12px',
    color: '#3987e5',
    textDecoration: 'none',
    cursor: 'pointer'
  },

  // TRANSACTIONS
  transactionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  transactionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #222',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative'
  },
  transactionItemActive: {
    backgroundColor: 'rgba(57, 135, 229, 0.1)',
    padding: '12px 12px',
    marginLeft: '-12px',
    marginRight: '-12px',
    paddingLeft: '12px',
    borderRadius: '6px'
  },
  txIcon: {
    fontSize: '20px',
    minWidth: '24px',
    textAlign: 'center'
  },
  txInfo: {
    flex: 1,
    minWidth: 0
  },
  txName: {
    fontSize: '13px',
    fontWeight: '500',
    margin: 0,
    color: '#fff'
  },
  txDate: {
    fontSize: '11px',
    color: '#999',
    margin: '2px 0 0 0'
  },
  txRight: {
    textAlign: 'right',
    minWidth: '120px'
  },
  txValue: {
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
    color: '#3987e5',
    fontVariantNumeric: 'tabular-nums'
  },
  txStatus: {
    fontSize: '10px',
    display: 'inline-block',
    marginTop: '4px',
    fontWeight: '500'
  },
  txDetails: {
    position: 'absolute',
    bottom: '-40px',
    right: 0,
    backgroundColor: '#1a1a1a',
    border: '1px solid #222',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '10px',
    color: '#999',
    whiteSpace: 'nowrap',
    zIndex: 100
  },

  // SPLIT
  splitLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    justifyContent: 'center',
    minWidth: '200px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
    flexShrink: 0,
    marginTop: '2px'
  },
  legendName: {
    fontSize: '12px',
    fontWeight: '500',
    margin: 0,
    color: '#ccc'
  },
  legendPercent: {
    fontSize: '11px',
    color: '#999',
    margin: '2px 0 0 0'
  },

  // RECEIVERS
  receiversContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  receiverItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #222'
  },
  receiverDot: {
    width: '12px',
    height: '12px',
    borderRadius: '2px',
    flexShrink: 0
  },
  receiverName: {
    fontSize: '13px',
    fontWeight: '500',
    margin: 0,
    color: '#fff'
  },
  receiverCode: {
    fontSize: '10px',
    color: '#666',
    margin: '2px 0 0 0'
  },
  receiverAmount: {
    fontSize: '10px',
    color: '#999',
    margin: '2px 0 0 0'
  },
  receiverRight: {
    textAlign: 'right'
  },
  receiverPercent: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#3987e5',
    margin: 0,
    fontVariantNumeric: 'tabular-nums'
  },

  // API
  apiContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  apiItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #222'
  },
  apiIcon: {
    fontSize: '20px',
    minWidth: '24px'
  },
  apiName: {
    fontSize: '13px',
    fontWeight: '500',
    margin: 0,
    color: '#fff'
  },
  apiStats: {
    fontSize: '10px',
    color: '#999',
    margin: '2px 0 0 0'
  },
  activeLabel: {
    fontSize: '10px',
    padding: '4px 8px',
    backgroundColor: 'rgba(12, 163, 12, 0.15)',
    color: '#0ca30c',
    borderRadius: '4px',
    fontWeight: '600',
    border: '1px solid rgba(12, 163, 12, 0.2)'
  },

  // ACQUIRERS
  acquirersContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0'
  },
  acquirerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #222'
  },
  acquirerIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#fff'
  },
  acquirerName: {
    fontSize: '13px',
    fontWeight: '500',
    margin: 0,
    color: '#fff'
  },
  acquirerVolume: {
    fontSize: '10px',
    color: '#999',
    margin: '2px 0 0 0',
    fontVariantNumeric: 'tabular-nums'
  },

  // CTA
  ctaSection: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '32px'
  },
  ctaCard: {
    backgroundColor: 'linear-gradient(135deg, #1a2a3a 0%, #1a1a2a 100%)',
    border: '1px solid #333',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    maxWidth: '500px',
    width: '100%'
  },
  ctaTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '0 0 12px 0',
    color: '#fff'
  },
  ctaDescription: {
    fontSize: '13px',
    color: '#999',
    margin: '0 0 20px 0',
    lineHeight: '1.5'
  },
  ctaButton: {
    padding: '14px 32px',
    backgroundColor: '#3987e5',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.5px'
  },

  // UTILS
  subtitle: {
    fontSize: '13px',
    color: '#999'
  },
  backButton: {
    padding: '10px 16px',
    backgroundColor: '#2a3a4a',
    border: '1px solid #333',
    borderRadius: '6px',
    color: '#3987e5',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    marginTop: '16px',
    transition: 'all 0.2s'
  }
};

export default TKIDashboard;
