import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Award, 
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  Download
} from 'lucide-react'

const Reports = ({ user }) => {
  const [timeRange, setTimeRange] = useState('7')
  const [performanceData, setPerformanceData] = useState(null)
  const [progressData, setProgressData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReportsData()
  }, [user, timeRange])

  const fetchReportsData = async () => {
    setIsLoading(true)
    try {
      const [performanceRes, progressRes] = await Promise.all([
        fetch(`/api/reports/performance?user_id=${user.id}&days=${timeRange}`),
        fetch(`/api/reports/progress?user_id=${user.id}&days=${timeRange}`)
      ])

      if (performanceRes.ok) {
        const performance = await performanceRes.json()
        setPerformanceData(performance)
        setCategoryData(performance.categories || [])
      }

      if (progressRes.ok) {
        const progress = await progressRes.json()
        setProgressData(progress)
      }

    } catch (error) {
      console.error('Erro ao buscar relatórios:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const COLORS = ['#2E86AB', '#06D6A0', '#F18F01', '#C73E1D', '#8E44AD', '#3498DB']

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getPerformanceTrend = () => {
    if (progressData.length < 2) return null
    
    const recent = progressData.slice(-3)
    const avgRecent = recent.reduce((sum, day) => sum + day.accuracy, 0) / recent.length
    const older = progressData.slice(0, -3)
    const avgOlder = older.length > 0 ? older.reduce((sum, day) => sum + day.accuracy, 0) / older.length : avgRecent
    
    return avgRecent > avgOlder ? 'up' : avgRecent < avgOlder ? 'down' : 'stable'
  }

  const trend = getPerformanceTrend()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios de Desempenho</h1>
          <p className="text-gray-600 mt-1">
            Acompanhe seu progresso e identifique áreas de melhoria
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revisado</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performanceData?.total_reviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Cards estudados no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão Geral</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {performanceData?.accuracy || 0}%
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
            </div>
            <p className="text-xs text-muted-foreground">
              Taxa de acertos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acertos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {performanceData?.correct_reviews || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Respostas corretas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3s</div>
            <p className="text-xs text-muted-foreground">
              Por card
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progresso ao Longo do Tempo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progresso Diário
            </CardTitle>
            <CardDescription>
              Evolução da sua precisão ao longo do tempo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis 
                  domain={[0, 100]}
                  fontSize={12}
                />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [`${value}%`, 'Precisão']}
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#2E86AB" 
                  fill="#2E86AB" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cards por Dia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Volume de Estudos
            </CardTitle>
            <CardDescription>
              Quantidade de cards estudados por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => formatDate(value)}
                  formatter={(value) => [value, 'Cards']}
                />
                <Bar dataKey="total_cards" fill="#06D6A0" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5" />
              Performance por Categoria
            </CardTitle>
            <CardDescription>
              Distribuição de acertos por área de estudo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, accuracy }) => `${name}: ${accuracy}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="accuracy"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Precisão']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Dados insuficientes para exibir gráfico
              </div>
            )}
          </CardContent>
        </Card>

        {/* Análise Detalhada por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Análise por Categoria</CardTitle>
            <CardDescription>
              Desempenho detalhado em cada área de estudo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={category.accuracy >= 80 ? "default" : category.accuracy >= 60 ? "secondary" : "destructive"}
                      >
                        {category.accuracy}%
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {category.correct}/{category.total}
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={category.accuracy} 
                    className="h-2"
                    style={{ 
                      '--progress-background': COLORS[index % COLORS.length] 
                    }}
                  />
                </div>
              ))}
              
              {categoryData.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  Nenhum dado disponível para o período selecionado
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Insights e Recomendações
          </CardTitle>
          <CardDescription>
            Análise automática do seu desempenho
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">Pontos Fortes</h4>
              <ul className="space-y-2">
                {categoryData
                  .filter(cat => cat.accuracy >= 80)
                  .map(cat => (
                    <li key={cat.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">
                        Excelente desempenho em <strong>{cat.name}</strong> ({cat.accuracy}%)
                      </span>
                    </li>
                  ))}
                {categoryData.filter(cat => cat.accuracy >= 80).length === 0 && (
                  <li className="text-sm text-gray-600">
                    Continue estudando para identificar seus pontos fortes
                  </li>
                )}
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-orange-600">Áreas para Melhoria</h4>
              <ul className="space-y-2">
                {categoryData
                  .filter(cat => cat.accuracy < 70)
                  .map(cat => (
                    <li key={cat.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">
                        Foque mais em <strong>{cat.name}</strong> ({cat.accuracy}%)
                      </span>
                    </li>
                  ))}
                {categoryData.filter(cat => cat.accuracy < 70).length === 0 && (
                  <li className="text-sm text-gray-600">
                    Parabéns! Seu desempenho está consistente em todas as áreas
                  </li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Dica de Estudo</h4>
            <p className="text-blue-700 text-sm">
              {performanceData?.accuracy >= 80 
                ? "Seu desempenho está excelente! Continue mantendo a consistência nos estudos."
                : performanceData?.accuracy >= 60
                ? "Bom progresso! Tente aumentar a frequência de revisões nas áreas com menor desempenho."
                : "Foque em revisar os conceitos básicos e aumente o tempo de estudo diário."
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports

