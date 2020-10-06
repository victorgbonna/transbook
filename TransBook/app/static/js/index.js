if (document.readyState=='loading'){
  document.addEventListener('DOMContentLoaded', ready)
}else{
  ready()
}

function ready() {
  var addToCartButtons=document.querySelectorAll('.add-to-cart')
  addToCartButtons.forEach(button => {
      button.addEventListener('click', addToCartFunc)
  });  
}

function addToCartFunc(){
  var title = this.parentElement.querySelector('.shop-item-title').textContent
  var price = this.parentElement.querySelector(".shop-item-price").textContent.replace('$','')
  var entry = {
    title: title,
    price: price
  };

  fetch(`${window.origin}/session/entry`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(entry),
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
        var json_data=JSON.parse(data)
        updateTotal(parseFloat(json_data.price))                  
        })
    })
    .catch(function (error) {
      console.log("Fetch error: " + error);
    });
}
function updateTotal(price){
  console.log(price)
  var totalprice=parseFloat(document.querySelector('.cart-total').textContent.replace('$',''))
  var totallengthElem=document.querySelector('.cart-length')
  var totallength=parseFloat(totallengthElem.textContent)
  // console.log(totallength) 
  totalprice+=price
  // console.log(totalprice)
  // console.log(totallength)
  if(totallength){
    totallength+=1
  }
  else{
    totallength=1
  }
  document.querySelector('.cart-total').textContent=`$${totalprice}`
  document.querySelector('.cart-length').textContent=totallength
}