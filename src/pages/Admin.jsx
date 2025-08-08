import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { 
  Upload, 
  Plus, 
  FileText, 
  Users, 
  List,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const Admin = ({ user }) => {
  const [questionLists, setQuestionLists] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedList, setSelectedList] = useState(null)
  const [selectedQuestions, setSelectedQuestions] = useState([])
  
  // Estados para formulário de upload
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    category_id: '',
    questions_text: ''
  })
  
  const [uploadStatus, setUploadStatus] = useState({ type: '', message: '' })

  useEffect(() => {
    if (user && user.is_admin) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [listsRes, categoriesRes] = await Promise.all([
        fetch('/api/question-lists'),
        fetch(`/api/categories?user_id=${user.id}`)
      ])

      if (listsRes.ok) {
        const listsData = await listsRes.json()
        setQuestionLists(listsData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const uploadQuestionList = async () => {
    if (!uploadForm.name || !uploadForm.questions_text) {
      setUploadStatus({ type: 'error', message: 'Nome e texto das perguntas são obrigatórios' })
      return
    }

    try {
      setUploadStatus({ type: 'loading', message: 'Processando upload...' })
      
      const response = await fetch('/api/question-lists/upload-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          created_by: user.id
        })
      })

      const result = await response.json()

      if (response.ok) {
        setUploadStatus({ 
          type: 'success', 
          message: `Lista criada com sucesso! ${result.questions_count} perguntas adicionadas.` 
        })
        setUploadForm({ name: '', description: '', category_id: '', questions_text: '' })
        setShowUploadModal(false)
        fetchData() // Recarregar listas
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Erro ao criar lista' })
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Erro de conexão' })
    }
  }

  const viewQuestions = async (list) => {
    try {
      const response = await fetch(`/api/question-lists/${list.id}/questions`)
      if (response.ok) {
        const data = await response.json()
        setSelectedList(data.list)
        setSelectedQuestions(data.questions)
        setShowViewModal(true)
      }
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error)
    }
  }

  const deleteList = async (listId) => {
    if (!confirm('Tem certeza que deseja desativar esta lista?')) return

    try {
      const response = await fetch(`/api/question-lists/${listId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      })

      if (response.ok) {
        fetchData() // Recarregar listas
      }
    } catch (error) {
      console.error('Erro ao deletar lista:', error)
    }
  }

  if (!user || !user.is_admin) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Acesso negado. Esta página é apenas para administradores.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administração</h1>
          <p className="text-gray-600">Gerencie listas de perguntas e configurações do sistema</p>
        </div>
        
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" />
              Nova Lista
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload de Lista de Perguntas</DialogTitle>
              <DialogDescription>
                Crie uma nova lista de perguntas a partir de um texto
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome da Lista</Label>
                <Input
                  id="name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                  placeholder="Ex: Traumatologia e Emergências"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  placeholder="Descrição da lista de perguntas"
                />
              </div>

              <div>
                <Label>Categoria (opcional)</Label>
                <Select 
                  value={uploadForm.category_id} 
                  onValueChange={(value) => setUploadForm({...uploadForm, category_id: value})}
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
                <Label htmlFor="questions">Texto das Perguntas</Label>
                <Textarea
                  id="questions"
                  value={uploadForm.questions_text}
                  onChange={(e) => setUploadForm({...uploadForm, questions_text: e.target.value})}
                  placeholder="Cole aqui o texto com as perguntas, uma por linha. Ex:&#10;1. Que es fractura -&#10;2. Tipos de fractura -&#10;3. ¿En relación a la traumatología..."
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formato: Uma pergunta por linha. Numeração e traços serão removidos automaticamente.
                </p>
              </div>

              {uploadStatus.message && (
                <Alert className={uploadStatus.type === 'error' ? 'border-red-200 bg-red-50' : 
                                uploadStatus.type === 'success' ? 'border-green-200 bg-green-50' : ''}>
                  {uploadStatus.type === 'success' ? <CheckCircle className="h-4 w-4" /> : 
                   uploadStatus.type === 'error' ? <AlertCircle className="h-4 w-4" /> : null}
                  <AlertDescription>{uploadStatus.message}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={uploadQuestionList} 
                className="w-full"
                disabled={uploadStatus.type === 'loading'}
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadStatus.type === 'loading' ? 'Processando...' : 'Criar Lista'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Listas</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questionLists.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Perguntas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questionLists.reduce((total, list) => total + list.questions_count, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Listas de Perguntas */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Listas de Perguntas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questionLists.map((list) => (
            <Card key={list.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{list.name}</CardTitle>
                <CardDescription>
                  {list.description || 'Sem descrição'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Perguntas:</span>
                    <span className="font-medium">{list.questions_count}</span>
                  </div>
                  {list.category_name && (
                    <div className="flex justify-between text-sm">
                      <span>Categoria:</span>
                      <span className="font-medium">{list.category_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Criado por:</span>
                    <span className="font-medium">{list.creator_name}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewQuestions(list)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => deleteList(list.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal para visualizar perguntas */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedList?.name}</DialogTitle>
            <DialogDescription>
              {selectedList?.description} • {selectedQuestions.length} perguntas
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {selectedQuestions.map((question, index) => (
              <div key={question.id} className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-500 mr-2">{index + 1}.</span>
                <span>{question.question_text}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Admin

