# Lista de usuarios

En esta pagina solo podra acceder el administrador

Sera una lista con todos los usuarios de la base de datos.

Tendra una busqueda avançada donde podras buscar por filtros y ordenar los resultados.

## Buscador

Habra un buscador que buscara por id, username y por email. Buscara si el contenido del buscador estara en el id, el username o el email.

Si el buscador es solo un numero sin letras buscara por id.
Si el buscador tiene letras buscara por username y por email.

Ejemplo -> buscador: 'user'

Resultados:

- username: 'user1', email: 'juan@da.es', rol: 'editor'
- username: 'user2', email: 'juan2@da.es', rol: 'editor'
- username: 'user3', email: 'juan3@da.es', rol: 'admin'
- username: 'juan', email: 'user@da.es', rol: 'admin'
- username: 'juan2', email: 'user2@da.es', rol: 'user'

## Filtros

- Rol: Habra 3 botones, uno para cada rol, puedes seleccionar ninguno o todos. En caso de ninguno o todos, buscara todos los roles, en caso de pulasr uno o dos, solo buscara esos

- Progreso: Seran dos inputs, uno con el progreso minimo, y uno con el progreso maximo.

- Ordenar: Habra dos botones, el boton de tipo y el de orden
    - tipo: Decidira si es ordenado alfabeticamente o por progreso
    - orden: Orden ascendente o descendente


## Datos

Se mostrarn los siguientes elementos de cada usuario:

- id
- username
- email
- rol
- progreso

Ademas cada usuraio tendra las siguientes opciones:

- ver progreso
- editar
- eliminar