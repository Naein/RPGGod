# RPG_God Bot para Anima: Beyond Fantasy

Este bot ha sido creado para la gestión de usuarios y personajes de Anima:BF.
El objetivo de este bot es facilitar y gestionar personajes, tiradas e interacciones entre personajes para un servidor de interpretación.
De este modo, un usuario puede tener varios personajes e interactuar con todos ellos a la vez.

El método de invocación del bot es mediante el carácter ! antes de cualquier comando.
El Bot eliminará cualquier comando con el fin de 

## Requisitos
Para facilitar el uso de este bot, se utilizará el JSON exportado de la ficha Excel (v.8.2.4+).
A la hora de exportar el JSON, es importante tener en cuenta que se utilizarán campos de la hoja "General", como el nombre y la descripción física.
Por lo que es necesario rellenar la Hoja de Personaje con la mayor información posible.
Además, es importante ocultar los campos que el personaje no vaya a usar (Ki /Psíquica/Magia/Poderes de Monstruo) usando los botones dedicados en la hoja "Resumen".
De no ocultar los campos no usados, se exportarán en el JSON, creando así información inútil.

## Crear un Personaje
Para crear un personaje el usuario deberá subir un JSON exportado de la ficha Excel (v.8.2.4+).
Una vez creado, el personaje (Jugador o No-Jugador) se mantendrá libre de usuario hasta que alguien lo reclame.

## Comandos básicos

A la hora de usar los comandos, cuando sea necesario indicar el nombre de un Personaje, es posible usar un nombre suficientemente corto como para identificar a un personaje.
Por ejemplo, si queremos mostrar a nuestro personaje "ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890", en vez de usar el comando:
```
!show ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890
```
Podremos usar:
```
!show ABCD
```
Si existe más de un personaje que empieze con estas letras (ABCD), saldrá un mensaje informativoy deberemos especificar un poco más qué personaje queremos usar.

### help
El comando help mostrará una lista breve de todos los comandos disponible.
Mientras que el comando help <comando> informará, además, del uso de un comando específico.
Ejemplos:
```
user> !help
user> !help as
```

### as
El comando as sirve para hablar por un personaje. RPG_God invocará un mensaje de parte de este personaje.
El mensaje irá precedido de '-' e irá en negrita para denotar 
```
user> !as A Buenos días Señor B
user2> !as B Buenos días Señor A
```

### action
El comando action sirve, al igual que as, para hacer que RPG_God invoque un personaje.
En esta ocasión, el mensaje irá sin decoraciones, para mostrar una acción. 
```
user> !action A Camino hasta situarme justo al lado del altar.
user2> !action B B se escuda detras de una de las columnas presentes.
```