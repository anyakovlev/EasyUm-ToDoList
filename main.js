/*
Список карточек, разбитых по доскам.
Доски можно:
 - создавать;
 - удалять.
Карточки можно: 
- создавать;
- помечать как удаленные;
- редактировать;
- перемещать между досками;
Карточка включает в себя:
- наименование;
- содержимое;
- доска;
- статус удаления.
Классы:
Card
   name
   description
   board
   deleted
   drop()
   goToList()   
Board
   name
   code
   deleted
   drop()
 */

 class Card {
     constructor(name, description, board) {
         this.name = name
         this.description = description
         this.board = board
         this.deleted = false
         this.id = cardList.length
     }

     drop(){
         this.deleted = true;
         saveApp();
     }

     goToList(board){
         this.board = board;
         saveApp();
         getBoards();
     }
 
     setAttr(key, value){
       let permitted =  ['name', 'description'];
       let obj = this;
       permitted.forEach(function(item){
       if (item == key){
        obj[key] = value;   
       
       }   
       })  
       saveApp();  
     }

 } 

class Board {

constructor(name, id){
    this.name = name
    this.deleted = false
    this.list = [] 
    this.id = id
  }


drop(){
    this.deleted = true;
    saveApp();
    getBoards();
  }  

}



function getBoards(){
    getActiveList();
    boardList.forEach(function(item){
       item.list = activeCardList.filter(n => n['board'] === item.id);
      })
    }
    

function createBoard(name, id){
    boardList.push(new Board(name, boardList.length));
    render();
}
function createCard(name, description, board){
    if (board === undefined){
        board = 0;
    }
    cardList.push(new Card(name, description, board));
    getBoards();
    saveApp();
    render();
}

function getActiveList(){
    activeCardList = cardList.filter(n => n.deleted == false);
    archiveList = cardList.filter(n => n.deleted == true);
}

function saveApp(){
    localStorage.setItem('cardList', cardList);
}
function render () {
    $('#app').empty();

    boardList.forEach(function(element) {
        var cardsHTML = '';
        
        element.list.forEach(function(element) {
           cardsHTML += '<div class="card" data-id="' + element.id+ '">' +
           '<div class="title">' + element.name + '</div>' +
           '<div class="description>' + element.description + '</div>' +
           '</div>';
        });

        $('#app').append(
              '<div class="board" data-name ="' + element.name + '" data-id ="' + element.id + '">' + 
              '<h5 class="nn">' + element.name + '</h5>' + 
              cardsHTML +
              '<div class="add-btn"> Создать карточку </div>' + 
              '</div>'
        );
           
    });

    $('.selectBoard .select_list').html('');
    boardList.forEach(function(element) {
        $('.selectBoard .select_list').append(
            ' <li data-id="' + element.id + '"data-value="' + element.name + '">' + element.name + '</li>'
        );
    });

    $('.select_list li').click(function() {
        $(this).closest('.select_list').toggleClass('hidden');
        $(this).closest('.select').find('custom_input').text($(this).data('value'));
        $(this).closest('.select').find('input').val($(this).data('id'));
    });

    $('.add-btn').click(function(){
    var boardID = $(this).closest('.board').data('id');
    var boardName =  $(this).closest('.board').data('name');
    $('#create_card').removeClass('hidden');
    $('#create_card input').val('');

    $('#create_card .select .card-id').val(boardID); 
    $('#create_card .select .custom-input').text(boardName);    
});

$('.card').click(function(){
    let id = $(this).data('id');
    let card = cardList.find(n => n.id == id);
    let board = boardList.find(n => n.id == card.board);
    
    $('#edit_card').attr('data-id', id);
    $('#edit_card').removeClass('hidden');
    $('#edit_card').find('.card_name').val(card.name);
    $('#edit_card').find('.card_description').val(card.description);
    $('#edit_card').find('.card_id').val(board.id);
    $('#edit_card').find('.custom_input').val(board.name);
    })
};


var cardList = [];
var activeCardList = [];
var boardList =  [];
var archive = []; 

getBoards();

$( document ).ready(function() {

    $('.showModel').click(function(){
        $(this).next().find('input').val('');
        $(this).next().toggleClass('hidden'); 
    })

    $('#createCard').click(function(){
        if ($(this).closest('.model_form').find('.card_name').val() != ''){
        createCard(
            $(this).closest('.model_form').find('.card_name').val(), 
            $(this).closest('.model_form').find('.card_description').val(), 
            + $(this).closest('.model_form').find('.card_id').val() 
            );

        $(this).closest('.model_from').addClass('hidden');
        }
    })

    $('#createBoard').click(function(){
        if ($('.board_name').val() != ''){
        createBoard($('.board_name').val());
        $(this).closest('.model_form').addClass('hidden');
    }
    })
$('.custom_input').click(function(){
    $(this).closest('.select').find('.select_list').toggleClass('hidden');
});

$('.close-btn').click(function(){
    $(this).closest('.model-form').addClass('hidden');
})

$('.editCard').click(function(){
    let id = $('#edit_card').data('id');
    let card = cardList.find(n => n.id == id);
    card.name = $('#edit_card').find('.card_name').val();
    card.description = $('#edit_card').find('.card_description').val();
    card.goToList($('#edit_card').find('.card_id').val());
    //card.drop(); - вместо трех свойств выше
    $(this).closest('.model-form').addClass('hidden');
   render();
})

});

