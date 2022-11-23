"use strict";

// 預設 JS，請同學不要修改此處
var menuOpenBtn = document.querySelector('.menuToggle');
var linkBtn = document.querySelectorAll('.topBar-menu a');
var menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);
linkBtn.forEach(function (item) {
  item.addEventListener('click', closeMenu);
});

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}

function closeMenu() {
  menu.classList.remove('openMenu');
} // C3.js


var chart = c3.generate({
  bindto: '#chart',
  // HTML 元素綁定
  data: {
    type: "pie",
    columns: [['Louvre 雙人床架', 1], ['Antony 雙人床架', 2], ['Anty 雙人床架', 3], ['其他', 4]],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      "其他": "#301E5F"
    }
  }
}); ////後台
//取得訂單資料

function getOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    console.log(response.data);
  });
}
"use strict";

////config section
// config test
var api_path = "testrabbit";
var token = "8ki6mIFCZqOqa2U0T7bPSRXZkOr2"; ////index section

var productData = [];
var cartData = [];
var productList = document.querySelector(".productWrap");
var productSelect = document.querySelector(".productSelect");

function init() {
  getProductList();
  getCartList();
}

;
init(); //取product api裡資料

function getProductList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products")).then(function (res) {
    // console.log(res.data);
    productData = res.data.products;
    renderCard(productData);
  });
}

; //將product api資料渲染成HTML(card)

function renderCard(data) {
  var str = "";
  data.forEach(function (item) {
    var content = "<li class=\"productCard\">\n            <h4 class=\"productType\">\u65B0\u54C1</h4>\n            <img src=\"".concat(item.images, "\" alt=\"\">\n            <a href=\"#\" class=\"js-addCart\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n            <h3>").concat(item.title, "</h3>\n            <del class=\"originPrice\">NT").concat(item.origin_price, "</del>\n            <p class=\"nowPrice\">NT").concat(item.price, "</p>\n        </li>");
    str += content;
  });
  productList.innerHTML = str;
} //篩選category


productSelect.addEventListener("change", function (e) {
  // console.log(e.target.value);
  var category = e.target.value;

  if (category === "全部") {
    renderCard(productData);
  } else {
    var tempData = [];
    productData.forEach(function (item) {
      if (item.category === category) {
        tempData.push(item);
      }
    });
    renderCard(tempData);
  }
}); ////購物車
//點選購物車

productList.addEventListener("click", function (e) {
  e.preventDefault();
  var addCartClass = e.target.getAttribute("class");

  if (addCartClass !== "js-addCart") {
    return;
  }

  var productId = e.target.getAttribute("data-id");
  console.log(productId);
  var numberCheck = 1; // console.log(cartData)

  cartData.forEach(function (item) {
    if (productId === item.product.id) {
      item.quantity += 1;
      numberCheck = item.quantity;
    } // console.log(numberCheck)

  }); // 加入購物車 數量 並輸入給api

  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
    "data": {
      "productId": productId,
      "quantity": numberCheck
    }
  }).then(function (res) {
    console.log(res);
    alert("加入成功");
    getCartList(cartData);
  });
}); //取購物車api

function getCartList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (res) {
    // console.log(res.data);
    var finalTotal = res.data.finalTotal;
    document.querySelector(".js-total").textContent = finalTotal;
    cartData = res.data.carts;
    renderCart(cartData);
  });
}

var cartList = document.querySelector(".shoppingCart-tableList");

function renderCart(data) {
  var str = '';
  data.forEach(function (item) {
    var content = "<tr>\n            <td>\n                <div class=\"cardItem-title\">\n                    <img src=\"".concat(item.product.images, "\" alt=\"\">\n                    <p>").concat(item.product.title, "</p>\n                </div>\n            </td>\n            <td>").concat(item.product.price, "</td>\n            <td>").concat(item.quantity, "</td>\n            <td>").concat(item.product.price * item.quantity, "</td>\n            <td class=\"discardBtn\">\n                <a href=\"#\" class=\"material-icons\" data-id=\"").concat(item.id, "\">\n                    clear\n                </a>\n            </td>\n        </tr>");
    str += content;
  });
  cartList.innerHTML = str;
} //刪除購物車單一品項


cartList.addEventListener('click', function (e) {
  e.preventDefault(); // console.log(e.target)

  var cartId = e.target.getAttribute('data-id');

  if (cartId == null) {
    return;
  } // console.log(cartId)


  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(cartId)).then(function (res) {
    alert("刪除成功");
    getCartList();
  });
}); //刪除整個購物車

var discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener('click', function (e) {
  e.preventDefault();
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (res) {
    alert("全部刪除成功");
    getCartList();
  })["catch"](function (err) {
    alert("已清空，請勿重複刪除");
    getCartList();
  });
}); ////加入預定訂單

var orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", function (e) {
  e.preventDefault(); // console.log(e.target)

  if (cartData.length == 0) {
    alert("請加入購物車");
    return;
  }

  var customerName = document.querySelector("#customerName").value;
  var customerPhone = document.querySelector("#customerPhone").value;
  var customerEmail = document.querySelector("#customerEmail").value;
  var customerAddress = document.querySelector("#customerAddress").value;
  var customerTradeWay = document.querySelector("#tradeWay").value;

  if (customerName == "" || customerAddress == "" || customerPhone == "" || customerEmail == "" || customerTradeWay == "") {
    alert("請輸入訂單資訊");
    return;
  }

  var orderForm = document.querySelector(".orderInfo-form");
  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/orders"), {
    "data": {
      "user": {
        "name": customerName,
        "tel": customerPhone,
        "email": customerEmail,
        "address": customerAddress,
        "payment": customerTradeWay
      }
    }
  }).then(function (res) {
    alert("訂單建立成功");
    orderForm.reset();
    getCartList();
  });
});
"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var ele = document.querySelector('.recommendation-wall');
  ele.style.cursor = 'grab';
  var pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
  };

  var mouseDownHandler = function mouseDownHandler(e) {
    ele.style.cursor = 'grabbing';
    ele.style.userSelect = 'none';
    pos = {
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  var mouseMoveHandler = function mouseMoveHandler(e) {
    // How far the mouse has been moved
    var dx = e.clientX - pos.x;
    var dy = e.clientY - pos.y; // Scroll the element

    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  var mouseUpHandler = function mouseUpHandler() {
    ele.style.cursor = 'grab';
    ele.style.removeProperty('user-select');
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  }; // Attach the handler


  ele.addEventListener('mousedown', mouseDownHandler);
}); // menu 切換

var menuOpenBtn = document.querySelector('.menuToggle');
var linkBtn = document.querySelectorAll('.topBar-menu a');
var menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);
linkBtn.forEach(function (item) {
  item.addEventListener('click', closeMenu);
});

function menuToggle() {
  if (menu.classList.contains('openMenu')) {
    menu.classList.remove('openMenu');
  } else {
    menu.classList.add('openMenu');
  }
}

function closeMenu() {
  menu.classList.remove('openMenu');
}
//# sourceMappingURL=all.js.map
