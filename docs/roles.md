# Roles

## Invitado

Este rol se dara cuando no estes conectado (el rol no existe).

El header tendra las opciones de login y signin.

El invitado no tendra barra de progreso

El invitado no podra acceder a: perfil, update, progreso, lista de usuarios, crear contenido

## Usuario

Este rol es para los usuarios que vienen a consumir la web

El header tendra un desplegable con perfil, progreso y logout

Podra ver su barra de progreso

El usuario no podra acceder a lista de usuarios, crear contenido


## Editor

Este rol es para los editores que vienen a consumir y crear contenido en la web

El header tendra un desplegable con perfil, progreso crear contenido y logout

Podra ver su barra de progreso

El usuario no podra acceder a lista de usuarios.

## Admin

Este rol es para el administrador

El header tendra un desplegable con perfil, progreso, lista de usuarios, crear contenido y logout

Podra ver su barra de progreso


# Verificar email

Al acceder aqui mirara el get y decidira que hacer, si el get esta vacio o es incorrecto te redirigira a error.jsx