import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Plus, 
  FolderOpen, 
  Edit, 
  Trash2, 
  BookOpen,
  Tag,
  Save,
  X
} from 'lucide-react'

const Categories = ({ user }) => {
  const [categories, setCategories] = useState([])
  const [themes, setThemes] = useState([])
  const [cards, setCards] = useState([])
  const [questionLists, setQuestionLists] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Estados para modais
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [showQuestionListModal, setShowQuestionListModal] = useState(false)
  
  // Estados para formulários
  const [categoryForm, setCategoryForm] = useState({ name: '', color: '#2E86AB', icon: '📚' })
  const [themeForm, setThemeForm] = useState({ name: '', description: '', category_id: '' })
  const [cardForm, setCardForm] = useState({
    question: '',
    answer: '',
    category_id: '',
    theme_id: '',
    difficulty: 'medium',
    tags: [],
    selected_question_list: '',
    use_preset_questions: false
  })
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [categoriesRes, cardsRes, questionListsRes] = await Promise.all([
        fetch(`/api/categories?user_id=${user.id}`),
        fetch(`/api/cards?user_id=${user.id}`),
        fetch('/api/question-lists')
      ])

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
        if (categoriesData.length > 0 && !selectedCategory) {
          setSelectedCategory(categoriesData[0])
        }
      }

      if (cardsRes.ok) {
        const cardsData = await cardsRes.json()
        setCards(cardsData)
      }

      if (questionListsRes.ok) {
        const questionListsData = await questionListsRes.json()
        setQuestionLists(questionListsData)
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchThemes = async (categoryId) => {
    try {
      const response = await fetch(`/api/themes?category_id=${categoryId}`)
      if (response.ok) {
        const themesData = await response.json()
        setThemes(themesData)
      }
    } catch (error) {
      console.error('Erro ao buscar temas:', error)
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchThemes(selectedCategory.id)
    }
  }, [selectedCategory])

  const createCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...categoryForm, user_id: user.id })
      })

      if (response.ok) {
        const newCategory = await response.json()
        setCategories([...categories, newCategory])
        setCategoryForm({ name: '', color: '#2E86AB', icon: '📚' })
        setShowCategoryModal(false)
      }
    } catch (error) {
      console.error('Erro ao criar categoria:', error)
    }
  }

  const createTheme = async () => {
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...themeForm, category_id: selectedCategory.id })
      })

      if (response.ok) {
        const newTheme = await response.json()
        setThemes([...themes, newTheme])
        setThemeForm({ name: '', description: '', category_id: '' })
        setShowThemeModal(false)
      }
    } catch (error) {
      console.error('Erro ao criar tema:', error)
    }
  }

  const createCard = async () => {
    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardForm, user_id: user.id })
      })

      if (response.ok) {
        const newCard = await response.json()
        setCards([...cards, newCard])
        setCardForm({
          question: '',
          answer: '',
          category_id: '',
          theme_id: '',
          difficulty: 'medium',
          tags: [],
          selected_question_list: '',
          use_preset_questions: false
        })
        setShowCardModal(false)
      }
    } catch (error) {
      console.error('Erro ao criar card:', error)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !cardForm.tags.includes(newTag.trim())) {
      setCardForm({
        ...cardForm,
        tags: [...cardForm.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setCardForm({
      ...cardForm,
      tags: cardForm.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const getCategoryCards = (categoryId) => {
    return cards.filter(card => card.category_id === categoryId)
  }

  const getThemeCards = (themeId) => {
    return cards.filter(card => card.theme_id === themeId)
  }

  const fetchQuestionsFromList = async (listId) => {
    try {
      const response = await fetch(`/api/question-lists/${listId}/questions`)
      if (response.ok) {
        const data = await response.json()
        setSelectedQuestions(data.questions)
        setShowQuestionListModal(true)
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error)
    }
  }

  const createCardsFromQuestions = async () => {
    if (!cardForm.category_id || selectedQuestions.length === 0) {
      alert('Selecione uma categoria e uma lista de perguntas')
      return
    }

    try {
      const promises = selectedQuestions.map(question => 
        fetch('/api/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question.question_text,
            answer: cardForm.answer || ' ', // Resposta opcional ou espaço
            category_id: cardForm.category_id,
            theme_id: cardForm.theme_id || null,
            difficulty: cardForm.difficulty,
            tags: cardForm.tags,
            user_id: user.id
          })
        })
      )

      const responses = await Promise.all(promises)
      const newCards = await Promise.all(
        responses.map(response => response.ok ? response.json() : null)
      )

      const validCards = newCards.filter(card => card !== null)
      setCards([...cards, ...validCards])
      
      setShowQuestionListModal(false)
      setShowCardModal(false)
      setCardForm({
        question: '',
        answer: '',
        category_id: '',
        theme_id: '',
        difficulty: 'medium',
        tags: [],
        selected_question_list: '',
        use_preset_questions: false
      })
      
      alert(`${validCards.length} cards criados com sucesso!`)
      
    } catch (error) {
      console.error('Erro ao criar cards:', error)
      alert('Erro ao criar cards')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
          <h1 className="text-3xl font-bold text-gray-900">Categorias e Cards</h1>
          <p className="text-gray-600 mt-1">
            Organize seus estudos por categorias e temas
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
                <DialogDescription>
                  Crie uma nova categoria para organizar seus cards
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Nome</Label>
                  <Input
                    id="category-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    placeholder="Ex: Anatomia"
                  />
                </div>
                <div>
                  <Label htmlFor="category-icon">Ícone</Label>
                  <Input
                    id="category-icon"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                    placeholder="📚"
                  />
                </div>
                <div>
                  <Label htmlFor="category-color">Cor</Label>
                  <Input
                    id="category-color"
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({...categoryForm, color: e.target.value})}
                  />
                </div>
                <Button onClick={createCategory} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Criar Categoria
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCardModal} onOpenChange={setShowCardModal}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Novo Flashcard</DialogTitle>
                <DialogDescription>
                  Crie um novo card para seus estudos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Opção de usar listas pré-cadastradas */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-2 mb-3">
                    <input
                      type="checkbox"
                      id="use-preset"
                      checked={cardForm.use_preset_questions}
                      onChange={(e) => setCardForm({...cardForm, use_preset_questions: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="use-preset" className="font-medium">
                      Usar lista de perguntas pré-cadastradas
                    </Label>
                  </div>
                  
                  {cardForm.use_preset_questions && (
                    <div>
                      <Label>Lista de Perguntas</Label>
                      <Select 
                        value={cardForm.selected_question_list} 
                        onValueChange={(value) => setCardForm({...cardForm, selected_question_list: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma lista" />
                        </SelectTrigger>
                        <SelectContent>
                          {questionLists.map(list => (
                            <SelectItem key={list.id} value={list.id.toString()}>
                              {list.name} ({list.questions_count} perguntas)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {cardForm.selected_question_list && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="mt-2 w-full"
                          onClick={() => fetchQuestionsFromList(cardForm.selected_question_list)}
                        >
                          <BookOpen className="w-4 h-4 mr-2" />
                          Visualizar e Criar Cards
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Categoria</Label>
                    <Select 
                      value={cardForm.category_id} 
                      onValueChange={(value) => setCardForm({...cardForm, category_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tema (opcional)</Label>
                    <Select 
                      value={cardForm.theme_id} 
                      onValueChange={(value) => setCardForm({...cardForm, theme_id: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {themes.map(theme => (
                          <SelectItem key={theme.id} value={theme.id.toString()}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {!cardForm.use_preset_questions && (
                  <>
                    <div>
                      <Label htmlFor="question">Pergunta</Label>
                      <Textarea
                        id="question"
                        value={cardForm.question}
                        onChange={(e) => setCardForm({...cardForm, question: e.target.value})}
                        placeholder="Digite a pergunta do card..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="answer">Resposta</Label>
                      <Textarea
                        id="answer"
                        value={cardForm.answer}
                        onChange={(e) => setCardForm({...cardForm, answer: e.target.value})}
                        placeholder="Digite a resposta do card..."
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {cardForm.use_preset_questions && (
                  <div>
                    <Label htmlFor="default-answer">Resposta Padrão (opcional)</Label>
                    <Textarea
                      id="default-answer"
                      value={cardForm.answer}
                      onChange={(e) => setCardForm({...cardForm, answer: e.target.value})}
                      placeholder="Resposta padrão para todas as perguntas (deixe vazio para resposta em branco)"
                      rows={2}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Esta resposta será aplicada a todas as perguntas da lista selecionada
                    </p>
                  </div>
                )}

                <div>
                  <Label>Dificuldade</Label>
                  <Select 
                    value={cardForm.difficulty} 
                    onValueChange={(value) => setCardForm({...cardForm, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Médio</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Digite uma tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cardForm.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                {!cardForm.use_preset_questions && (
                  <Button onClick={createCard} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Criar Card
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Modal para visualizar e criar cards de lista */}
          <Dialog open={showQuestionListModal} onOpenChange={setShowQuestionListModal}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Cards da Lista</DialogTitle>
                <DialogDescription>
                  {selectedQuestions.length} perguntas serão convertidas em cards
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Configurações dos Cards:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Categoria:</strong> {categories.find(c => c.id.toString() === cardForm.category_id)?.name || 'Não selecionada'}
                    </div>
                    <div>
                      <strong>Tema:</strong> {cardForm.theme_id ? 'Selecionado' : 'Nenhum'}
                    </div>
                    <div>
                      <strong>Dificuldade:</strong> {cardForm.difficulty}
                    </div>
                    <div>
                      <strong>Resposta padrão:</strong> {cardForm.answer || 'Em branco'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <h4 className="font-medium">Perguntas que serão criadas:</h4>
                  {selectedQuestions.map((question, index) => (
                    <div key={question.id} className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-500 mr-2">{index + 1}.</span>
                      <span>{question.question_text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={createCardsFromQuestions} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Criar {selectedQuestions.length} Cards
                  </Button>
                  <Button variant="outline" onClick={() => setShowQuestionListModal(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categorias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => {
          const categoryCards = getCategoryCards(category.id)
          return (
            <Card 
              key={category.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory?.id === category.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span style={{ color: category.color }}>{category.icon}</span>
                  {category.name}
                </CardTitle>
                <CardDescription>
                  {categoryCards.length} cards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {category.themes_count || 0} temas
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {categories.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Crie sua primeira categoria para começar a organizar seus estudos
              </p>
              <Button onClick={() => setShowCategoryModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Categoria
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Detalhes da categoria selecionada */}
      {selectedCategory && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span style={{ color: selectedCategory.color }}>{selectedCategory.icon}</span>
              {selectedCategory.name}
            </h2>
            <Dialog open={showThemeModal} onOpenChange={setShowThemeModal}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Tema
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Tema</DialogTitle>
                  <DialogDescription>
                    Crie um novo tema para a categoria {selectedCategory.name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme-name">Nome</Label>
                    <Input
                      id="theme-name"
                      value={themeForm.name}
                      onChange={(e) => setThemeForm({...themeForm, name: e.target.value})}
                      placeholder="Ex: Sistema Cardiovascular"
                    />
                  </div>
                  <div>
                    <Label htmlFor="theme-description">Descrição</Label>
                    <Textarea
                      id="theme-description"
                      value={themeForm.description}
                      onChange={(e) => setThemeForm({...themeForm, description: e.target.value})}
                      placeholder="Descrição opcional do tema..."
                    />
                  </div>
                  <Button onClick={createTheme} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Criar Tema
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Temas */}
          {themes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Temas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {themes.map((theme) => {
                  const themeCards = getThemeCards(theme.id)
                  return (
                    <Card key={theme.id}>
                      <CardHeader>
                        <CardTitle className="text-base">{theme.name}</CardTitle>
                        <CardDescription>{theme.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {themeCards.length} cards
                          </span>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cards da categoria */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cards ({getCategoryCards(selectedCategory.id).length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getCategoryCards(selectedCategory.id).map((card) => (
                <Card key={card.id}>
                  <CardHeader>
                    <CardTitle className="text-base line-clamp-2">
                      {card.question}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {card.answer}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Badge variant="outline">{card.difficulty}</Badge>
                        {card.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories

