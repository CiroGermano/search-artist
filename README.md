O objetivo desse projeto é praticar um pouco do que foi visto no curso da Udemy: JavaScript Design Patterns
https://classroom.udacity.com/courses/ud989

Acabei me empolgando um pouco e usei alguns recursos da Deezer API para pesquisar dados sobre artistas. Porém, isso levou à alguns problemas de HTTP CORS e tive que usar a API cors-anywhere para contornar :sweat_smile:
Então se realmente quiser fazer alguma pesquisa dentro da aplicação , acesse o link https://cors-anywhere.herokuapp.com/https://api.deezer.com/album/302127 e habilite a API cors-anywhere.

Correções a fazer:

- Algumas requisiçoes (albums, por exemplo) são entregues em partes. Devo implementar o recebimento de todas as partes, pois atualmente só a primeira parte da requisição é tratada.
