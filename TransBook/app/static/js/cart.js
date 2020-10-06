if (document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded', ready)
  }else{
    ready()
  }
  
  function ready() {
    document.querySelector('.cart-header').classList.add('d-none')
    // .classList
    var removeCartButtons=document.querySelectorAll('.cart-item-remove')
    removeCartButtons.forEach(button => {
        button.addEventListener('click', removeCartFunc)
    });  
    var quantityInputs=document.querySelectorAll('.cart-item-quantity')
    quantityInputs.forEach(input=>{
        input.addEventListener('change', quantityChanged)
    })
    var radios=document.forms["formA"].elements["tp"]
    console.log(radios)
    for(radio in radios) {
      radios[radio].onclick = updateCartTotal
    }

  }
  
  function removeCartFunc(){ 
    var title = this.parentElement.previousElementSibling.querySelector('.cart-item-title').textContent
    console.log(title)
    this.parentElement.parentElement.remove()
    fetch(`${window.origin}/session/entry/delete`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(title),
      cache: "no-cache",
      headers: new Headers({
        "content-type": "application/json"
      })
    })
      .then(function (response) {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status code: ${response.status}`);
          return;
        }
        response.json().then(data => { 
          updateCartTotal()
          })
      })
      .catch(function (error) {
        console.log("Fetch error: " + error);
      });
  }
  function quantityChanged(event) {
    if (isNaN(event.target.value) || event.target.value <1){
      event.target.value=1
    }
    // console.log(quantityInputs)
    updateCartTotal()
  }
  function updateCartTotal() {
      var cartItemsCont= document.querySelector('.cart-items')
      var cartItems=cartItemsCont.querySelectorAll('.cart-item')
      if (cartItems.length){
        var total=0
        var quantitySum=0
        cartItems.forEach(item => {
            var priceElement=item.querySelector('.cart-item-price')
            var quantityElement=item.querySelector('.cart-item-quantity')
            // console.log(quantityElement)
            var price=parseInt(priceElement.textContent.replace('$',''))
            // console.log(price)
            var quantity=parseInt(quantityElement.value)
            quantitySum+=quantity 
            total+=(price*quantity)
        })
        tp=parseInt(document.querySelector('input[name="tp"]:checked').value)
        total+=(Math.floor((quantitySum+6)/6)*100)+tp
        document.querySelector('.cart-total-price').textContent=`$ ${total}`  
      }
      else{
        document.querySelector('.everything').remove()
        var empty= document.createElement('div')
        empty.classList.add('empty')
        empty.innerHTML='<p class="">You have not added any book to the cart</p>'
        container=document.querySelector('.container')
        container.append(empty)  
      }
    
  }
  







