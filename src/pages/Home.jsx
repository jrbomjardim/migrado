import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Calendar,
  Plus,
  Play,
  BarChart3,
  Clock
} from 'lucide-react'

const Home = ({ user }) => {
  const [stats, setStats] = useState({
    totalCards: 0,
    studiedToday: 0,
    accuracy: 0,
    streak: 0,
    cardsToReview: 0
  })
  const [recentSessions, setRecentSessions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas gerais
      const [cardsResponse, performanceResponse, historyResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/cards?user_id=${user.id}`),
        fetch(`http://localhost:5000/api/reports/performance?user_id=${user.id}&days=1`),
        fetch(`http://localhost:5000/api/study/history?user_id=${user.id}&limit=3`)
      ])

      if (cardsResponse.ok) {
        const cards = await cardsResponse.json()
        setStats(prev => ({ ...prev, totalCards: cards.length }))
      }

      if (performanceResponse.ok) {
        const performance = await performanceResponse.json()
        setStats(prev => ({ 
          ...prev, 
          studiedToday: performance.total_reviews,
          accuracy: performance.accuracy
        }))
      }

      if (historyResponse.ok) {
        const history = await historyResponse.json()
        setRecentSessions(history)
      }

      // Buscar cards para revisão
      const reviewResponse = await fetch(`http://localhost:5000/api/cards/study?user_id=${user.id}&limit=1`)
      if (reviewResponse.ok) {
        const reviewCards = await reviewResponse.json()
        setStats(prev => ({ ...prev, cardsToReview: reviewCards.length }))
      }

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Estudar Agora',
      description: 'Iniciar sessão de estudos',
      icon: Play,
      href: '/study',
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      title: 'Novo Card',
      description: 'Adicionar novo flashcard',
      icon: Plus,
      href: '/categories',
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      title: 'Relatórios',
      description: 'Ver progresso e estatísticas',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-purple-600 hover:bg-purple-700',
      textColor: 'text-white'
    }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user.username}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Continue seus estudos médicos onde parou
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link to="/study">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Estudar Agora
            </Button>
          </Link>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cards</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCards}</div>
            <p className="text-xs text-muted-foreground">
              Flashcards criados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estudado Hoje</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.studiedToday}</div>
            <p className="text-xs text-muted-foreground">
              Cards revisados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              Taxa de acertos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Para Revisar</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cardsToReview}</div>
            <p className="text-xs text-muted-foreground">
              Cards pendentes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Link key={index} to={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color}`}>
                        <Icon className={`w-6 h-6 ${action.textColor}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Sessões Recentes */}
      {recentSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sessões Recentes</h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <BookOpen className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Sessão de {session.session_type}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.total_cards} cards • {session.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-green-600">
                        {session.accuracy_percentage}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(session.started_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Meta Diária */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Meta Diária
          </CardTitle>
          <CardDescription>
            Progresso do seu objetivo de estudos de hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Cards estudados</span>
              <span>{stats.studiedToday}/20</span>
            </div>
            <Progress value={(stats.studiedToday / 20) * 100} className="h-2" />
            <p className="text-xs text-gray-600">
              {20 - stats.studiedToday > 0 
                ? `Faltam ${20 - stats.studiedToday} cards para completar sua meta`
                : 'Parabéns! Meta diária concluída! 🎉'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home

