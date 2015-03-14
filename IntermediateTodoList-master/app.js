var itemTemplate = $('#templates .item')
var list         = $('#list')

//ADD AN ITEM TO THE LIST
var addItemToPage = function(itemData) {
	var item = itemTemplate.clone()
	item.attr('data-id', itemData.id)
	item.find('.description').text(itemData.description)
	if(itemData.completed) {
		item.addClass('completed')
	}
	list.append(item)
}

//REQUEST DATA FROM SERVER
var loadRequest = $.ajax({
  type: 'GET',
  url: "https://listalous.herokuapp.com/lists/mhmiller/"
})

loadRequest.done(function(dataFromServer) {
  var itemsData = dataFromServer.items

//ADD NEW LIST ITEMS TO PAGE
  itemsData.forEach(function(itemData) {
    addItemToPage(itemData)
  })
})

//ALLOW USER TO ADD A NEW ITEM TO THE LIST
$('#add-form').on('submit', function(event) {
  event.preventDefault()
  var itemDescription = event.target.itemDescription.value
  var creationRequest = $.ajax({
     type: 'POST',
     url: "https://listalous.herokuapp.com/lists/mhmiller/items",
     data: { description: itemDescription, completed: false }
   })

  creationRequest.done(function(itemDataFromServer) {
    addItemToPage(itemDataFromServer)
  })
})


// LET USER MARK A LIST ITEM AS COMPLETE
$('#list').on('click', '.complete-button', function(event) {
  var item = $(event.target).parent()
  var isItemCompleted = item.hasClass('completed')
  var itemId = item.attr('data-id')
//MARK ITEM AS COMPLETE OR INCOMPLETE, BY CHANGING THE CLASS, INSTEAD OF CREATING NEW ITEM

  var updateRequest = $.ajax({
    type: 'PUT',
    url: "https://listalous.herokuapp.com/lists/mhmiller/items/" + itemId,
    data: { completed: !isItemCompleted }
  })

  updateRequest.done(function(itemData) {
    if (itemData.completed) {
      item.addClass('completed')
    } else {
      item.removeClass('completed')
    }
  })
})

// LET USER REMOVE ITEM BY HITTING "X" OPTION
$('#list').on('click', '.delete-button', function(event) {
  var item = $(event.target).parent();
  var isItemCompleted = item.hasClass('completed');
  var itemId = item.attr('data-id');
  console.log(item);
  //removes from DOM
  item.hide();
  // delete from server
  var updateRequest = $.ajax({
    type: 'DELETE',
    url: "https://listalous.herokuapp.com/lists/mhmiller/items/" + itemId,
    data: { completed: !isItemCompleted }
})
})


