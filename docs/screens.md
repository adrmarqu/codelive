# Paginas

/lang/screen/language/topic_id/level
/es/dashboard/css/3/5 -> 3: id de position, 5: nivel

Aqui esta la informacion de todas las paginas que existen y los permisos necesarios para acceder a ellas. Las paginas no se explican en detalle.

## Home - /

El home, desde aqui podras acceder al menu con todos los lenguajes web.

## Dashboard - /learn

Aqui estaran todos los lenguajes que ofrece la pagina que seran:

- HTML
- CSS
- JavaScript
- PHP
- NodeJs
- Mysql

## Menu contenido

Tendra un boton para volver

Aqui estaran todos los apartados de un lenguaje. Por ejemplo de html estara: <table> <form> ...

### Menu contenido desplegable

Cuando pulses un contenido, en caso de tener diferentes opciones se abrira un desplegable con las opciones.

Aqui estaran diferentes opciones por ejemplo si es el contenido display, aqui estaran las opciones flex, grid, block...

## Menu niveles

Tendra un boton para volver

Aqui salen los niveles disponibles, sera nivel x - titulo. Habra 4 estilos: un estilo con los niveles completados, un estilo con el nivel por el que vas, un estilo para los niveles no desbloqueados y un estilo para los niveles bloqueados por el premium.

- Los niveles tendran 2 estados
    - Bloqueado: No puedes acceder
    - Desbloquead: Puedes acceder

## Nivel

Tendra un boton para volver a niveles

Habra dos tipos de niveles:

### Informacion

Es un nivel que solo sera texto y (opcional)una demostracion

Podras acceder al siguiente nivel solo habiendo bajado al fondo de la pagina.

### Juego

Es un nivel que sera texto para algo de informacion y explicaciones breves + el juego

El juego tendra un boton de reset para volver a empezar. Ese mensaje te pedira confirmación.

Solo podras acceder al siguiente nivel cuando completes el juego.

#### Confirmacion

Al completar un juego te saldra un recuadro (como si fuera un window.confirm) que te dara estas opciones:

- Siguiente nivel
- Volver
- Quizas un boton para ir a la pagina de nivles


## Perfil de usuario

Perfil de usuario con las opciones:

- Cambiar username
- Cambiar pass
- Cambiar email
- Mantener session (checkbox)
- Eliminar cuenta

## Form

### Login

Para autenticarte

- email
- password
- recuperar password (link)
- mantener session iniciada (checkbox)


### Signin

Para crear una cuenta

- usuario
- rol (en caso de ser admin) (select)
- correo
- password
- repetir password
- temrminos y servicios (checkbox)
- Hacer login (checkbox): Para hacer login directamente

### enviar correo password

- correo al cual enviar
- enviar nuevo email (link o button)

### enviar correo confirmar email

- enviar nuevo email (link o button)

### recuperate password

Para recuperar la contraseña (accedes aqui desde codigo correo):

- password
- repeat password

### update user

Actualizar usuario desde perfil

- nuevo usuario
- password (tu contraseña actual)
- recuperar password

### update password

Actualizar contraseña desde perfil

- current password
- new password
- repetir password
- recuperar password (si no te acuerdas tu password)

### update email

Actualizar tu correo desde perfil

- nuevo correo
- password
- Recuperar password

## Lista de usuarios

Lista de todos los usuarios

Podras buscar por nombre, email, rol

Podras ver el id, ek nombre de usuario, el correo, el rol, y el progreso general (puedes entrar dentro de progreso para ver el progreso detallado)

## Progreso

Progreso de un usuario de cada lenguaje y de cada elemento

## Error

Pagina de error con el header para poder volver al home