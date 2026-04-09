import jsonServer from 'json-server'

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// 로그인 POST /api/users/login
server.post('/api/users/login', (req, res) => {
  const { userId, password } = req.body
  const db = router.db

  const userById = db.get('users').find({ userId }).value()
  if (!userById) {
    return res.status(401).json({ success: false, message: '아이디가 존재하지 않습니다' })
  }

  const user = db.get('users').find({ userId, password }).value()
  if (!user) {
    return res.status(401).json({ success: false, message: '비밀번호를 확인해주세요' })
  }

  res.json({ success: true, data: user })
})

// 회원가입 POST /api/users
server.post('/api/users', (req, res) => {
  const { userId, name, email, password } = req.body
  const db = router.db

  if (!userId || !name || !email || !password) {
    return res.status(400).json({ success: false, message: '모든 항목을 입력해주세요' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: '이메일 형식이 올바르지 않습니다' })
  }

  const existUser = db.get('users').find({ userId }).value()
  if (existUser) {
    return res.status(400).json({ success: false, message: '이미 사용중인 아이디입니다' })
  }

  const existEmail = db.get('users').find({ email }).value()
  if (existEmail) {
    return res.status(400).json({ success: false, message: '이미 사용중인 이메일입니다' })
  }

  const newUser = {
    id: String(Date.now()),
    userId,
    name,
    email,
    password
  }
  db.get('users').push(newUser).write()

  res.json({ success: true, data: newUser })
})

// 아이디 찾기 / 비밀번호 변경용 아이디 조회 GET /api/users
server.get('/api/users', (req, res) => {
  const { name, email, userId } = req.query
  const db = router.db

  if (userId && !name && !email) {
    const user = db.get('users').find({ userId }).value()
    if (!user) {
      return res.status(404).json({ success: false, message: '존재하지 않는 아이디입니다' })
    }
    return res.json({ success: true, id: user.id })
  }

  if (!name || !email) {
    return res.status(400).json({ success: false, message: '이름과 이메일을 입력해주세요' })
  }

  const user = db.get('users').find({ name, email }).value()
  if (!user) {
    return res.status(404).json({ success: false, message: '일치하는 사용자가 없습니다' })
  }

  res.json({ success: true, userId: user.userId })
})

server.use('/api', router)
server.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000')
})