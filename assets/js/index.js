"use strict";

////index section
var productData = [];
var cartData = [];
var productList = document.querySelector(".productWrap");
var productSelect = document.querySelector(".productSelect");

function init() {
  getProductList();
  getCartList();
}

; //取product api裡資料

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
    var content = "<li class=\"productCard\">\n            <h4 class=\"productType\">\u65B0\u54C1</h4>\n            <img src=\"".concat(item.images, "\" alt=\"\">\n            <a href=\"#\" class=\"js-addCart\" data-id=\"").concat(item.id, "\">\u52A0\u5165\u8CFC\u7269\u8ECA</a>\n            <h3>").concat(item.title, "</h3>\n            <del class=\"originPrice\">NT$").concat(toThousandsComma(item.origin_price), "</del>\n            <p class=\"nowPrice\">NT$").concat(toThousandsComma(item.price), "</p>\n        </li>");
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
  var numberCheck = 1;
  console.log(cartData);
  cartData.forEach(function (item) {
    if (productId === item.product.id) {
      numberCheck = item.quantity + 1;
    }
  });
  console.log(numberCheck); // 加入購物車 數量 並輸入給api

  axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts"), {
    "data": {
      "productId": productId,
      "quantity": numberCheck
    }
  }).then(function (res) {
    // console.log(res)
    alert("加入成功");
    getCartList();
  });
}); //取購物車api

function getCartList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts")).then(function (res) {
    // console.log(res.data);
    var finalTotal = res.data.finalTotal;
    document.querySelector(".js-total").textContent = toThousandsComma(finalTotal);
    cartData = res.data.carts; // console.log(cartData);

    renderCart(cartData);
  });
}

var cartList = document.querySelector(".shoppingCart-tableList");

function renderCart(data) {
  var str = '';
  data.forEach(function (item) {
    var content = "<tr>\n            <td>\n                <div class=\"cardItem-title\">\n                    <img src=\"".concat(item.product.images, "\" alt=\"\">\n                    <p>").concat(item.product.title, "</p>\n                </div>\n            </td>\n            <td>$").concat(toThousandsComma(item.product.price), "</td>\n            <td>").concat(item.quantity, "</td>\n            <td>$").concat(toThousandsComma(item.product.price * item.quantity), "</td>\n            <td class=\"discardBtn\">\n                <a href=\"#\" class=\"material-icons\" data-id=\"").concat(item.id, "\">\n                    clear\n                </a>\n            </td>\n        </tr>");
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
});
init(); ////加入預定訂單

var orderForm = document.querySelector(".orderInfo-form");
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
}); //validate 驗證

var inputs = document.querySelectorAll("input[name],select[data=payment]");
var constraints = {
  "姓名": {
    presence: {
      message: "必填欄位"
    }
  },
  "電話": {
    presence: {
      message: "必填欄位"
    },
    length: {
      minimum: 8,
      message: "需超過 8 碼"
    }
  },
  "信箱": {
    presence: {
      message: "必填欄位"
    },
    email: {
      message: "格式錯誤"
    }
  },
  "寄送地址": {
    presence: {
      message: "必填欄位"
    }
  },
  "交易方式": {
    presence: {
      message: "必填欄位"
    }
  }
};
inputs.forEach(function (item) {
  item.addEventListener("change", function () {
    item.nextElementSibling.textContent = '';
    var errors = validate(orderForm, constraints) || '';
    console.log(errors);

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        console.log(document.querySelector("[data-message=".concat(keys, "]")));
        document.querySelector("[data-message=\"".concat(keys, "\"]")).textContent = errors[keys];
      });
    }
  });
}); //utillities

function toThousandsComma(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//# sourceMappingURL=index.js.map
