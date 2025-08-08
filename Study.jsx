import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Eye,
  EyeOff,
  Play,
  Pause,
  SkipForward,
  Home,
  Timer
} from 'lucide-react'

const Study = ({ user }) => {
  const [studySession, setStudySession] = useState(null)
  const [currentCard, setCurrentCard] = useState(null)
  const [cards, setCards] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  })
  const [isLoading, setIsLoading] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval
    if (startTime && studySession) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [startTime, studySession])

  const startStudySession = async () => {
    setIsLoading(true)
    try {
      // Buscar cards para estudo
      const cardsResponse = await fetch(`/api/cards/study?user_id=${user.id}&limit=20`)
      if (!cardsResponse.ok) throw new Error('Erro ao buscar cards')
      
      const studyCards = await cardsResponse.json()
      
      if (studyCards.length === 0) {
        alert('Não há cards para revisar no momento!')
        return
      }

      // Iniciar sessão de estudo
      const sessionResponse = await fetch('/api/study/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          session_type: 'study'
        })
      })

      if (!sessionResponse.ok) throw new Error('Erro ao iniciar sessão')
      
      const session = await sessionResponse.json()
      
      setStudySession(session)
      setCards(studyCards)
      setCurrentCard(studyCards[0])
      setCurrentIndex(0)
      setStartTime(Date.now())
      setSessionStats({ correct: 0, incorrect: 0, total: 0 })
      
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error)
      alert('Erro ao iniciar sessão de estudo')
    } finally {
      setIsLoading(false)
    }
  }

  const recordAnswer = async (isCorrect, difficultyRating = 3) => {
    if (!currentCard || !studySession) return

    const responseTime = Math.floor((Date.now() - startTime) / 1000) - elapsedTime

    try {
      await fetch('/api/study/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          card_id: currentCard.id,
          session_id: studySession.id,
          is_correct: isCorrect,
          response_time: responseTime,
          difficulty_rating: difficultyRating
        })
      })

      // Atualizar estatísticas
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1)
      }))

      // Próximo card
      nextCard()
      
    } catch (error) {
      console.error('Erro ao registrar resposta:', error)
    }
  }

  const nextCard = () => {
    setShowAnswer(false)
    
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1)
      setCurrentCard(cards[currentIndex + 1])
    } else {
      endSession()
    }
  }

  const endSession = async () => {
    if (!studySession) return

    try {
      await fetch('http://localhost:5000/api/study/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: studySession.id
        })
      })

      // Resetar estado
      setStudySession(null)
      setCurrentCard(null)
      setCards([])
      setCurrentIndex(0)
      setShowAnswer(false)
      setStartTime(null)
      setElapsedTime(0)
      
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Tela inicial - sem sessão ativa
  if (!studySession) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sessão de Estudos 📚
          </h1>
          <p className="text-gray-600">
            Revise seus flashcards usando o método de repetição espaçada
          </p>
        </div>

        {sessionStats.total > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sessão Finalizada! 🎉</CardTitle>
              <CardDescription>
                Parabéns por completar sua sessão de estudos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{sessionStats.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
                  <div className="text-sm text-gray-600">Acertos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{sessionStats.incorrect}</div>
                  <div className="text-sm text-gray-600">Erros</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-center text-lg font-semibold">
                  Precisão: {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
                <Play className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Pronto para estudar?</h2>
              <p className="text-gray-600">
                Vamos revisar os cards que precisam da sua atenção
              </p>
            </div>
            
            <Button 
              onClick={startStudySession}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Carregando...
                </div>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar Sessão
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Tela de estudo - sessão ativa
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header da sessão */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudando</h1>
          <p className="text-gray-600">
            Card {currentIndex + 1} de {cards.length}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Timer className="w-4 h-4" />
            {formatTime(elapsedTime)}
          </div>
          <Button 
            variant="outline" 
            onClick={endSession}
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Finalizar
          </Button>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progresso</span>
          <span>{Math.round(((currentIndex + 1) / cards.length) * 100)}%</span>
        </div>
        <Progress value={((currentIndex + 1) / cards.length) * 100} className="h-2" />
      </div>

      {/* Estatísticas da sessão */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-blue-600">{sessionStats.total}</div>
            <div className="text-sm text-gray-600">Respondidos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-green-600">{sessionStats.correct}</div>
            <div className="text-sm text-gray-600">Acertos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-lg font-bold text-red-600">{sessionStats.incorrect}</div>
            <div className="text-sm text-gray-600">Erros</div>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard */}
      {currentCard && (
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="min-h-[300px] flex flex-col justify-center">
              {!showAnswer ? (
                // Pergunta
                <div className="text-center">
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Pergunta
                    </span>
                  </div>
                  <div className="text-xl font-medium text-gray-900 mb-8">
                    {currentCard.question}
                  </div>
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Mostrar Resposta
                  </Button>
                </div>
              ) : (
                // Resposta
                <div className="text-center">
                  <div className="mb-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Resposta
                    </span>
                  </div>
                  <div className="text-xl font-medium text-gray-900 mb-8">
                    {currentCard.answer}
                  </div>
                  
                  {/* Botões de avaliação */}
                  <div className="space-y-4">
                    <p className="text-gray-600 mb-4">Como foi sua resposta?</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => recordAnswer(false, 1)}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Errei
                      </Button>
                      <Button 
                        onClick={() => recordAnswer(true, 3)}
                        variant="outline"
                        className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Difícil
                      </Button>
                      <Button 
                        onClick={() => recordAnswer(true, 4)}
                        variant="outline"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Bom
                      </Button>
                      <Button 
                        onClick={() => recordAnswer(true, 5)}
                        variant="outline"
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Fácil
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dicas */}
      <Alert>
        <AlertDescription>
          💡 <strong>Dica:</strong> Seja honesto com suas avaliações. Isso ajuda o algoritmo a mostrar os cards na frequência ideal para seu aprendizado.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default Study

