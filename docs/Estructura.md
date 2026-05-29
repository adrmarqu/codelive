# Frontend
## pages
### admin
Lista de usuarios
Crear contenido (lenguaje, modulos, niveles, contenido)

### core
Dashboard (lenguaje, modulos, lista niveles, nivel)

### auth
Login
Signin
Recuperar
Verificacion

### profile
Update (user, email, password)
Profile

### stats
Ranking
Progress

### others
Contactos
Home
Terminos
Error

## components
### common
Button

### containers


### forms
Form
InputField (div(label - input))
BoxField (div(input box - label))


### layout
### modals


# Backend
## config
db -> Puente entre servidor y base de datos
jwt -> se encarga principalmente de mantener al usuario conectado
dotenv -> lee .env y las carga en process.env para poder usarlas

## controllers

auth
user
stats
dashboard
others
userList
editLanguage
editModul
editLevel
editContent
token

## models

user
content
progress
contact
token

### User

Cualquier cosa relacionada con el usuario (la tabla users)

### Content

Cualquier cosa relacionado con el contenido principal de la pagina.
Create content y dashboard

### Progress

Cualquier contenido relacionado con el progreso de un usuario

### Contact

Cualquier contenido relacionado con los mensajes de contactos

### Token

Cualquier contenido relacionado con los codigos enviados por correo


## routes

auth
user
stats
dashboard
admin
others

### auth
login
signin
recovery
verify

### user
profile
update (user, email, pass)

### stats
progress
ranking

### dashboard
languages
modules
levels
level

### admin
userList
createContent (lenguaje, modulos, niveles, contenido)

### Others
home
terms
error
contacts

## middleware
middleware

## index

