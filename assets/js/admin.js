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
} ////後台
//取得訂單資料


function init() {
  getOrderList();
}

init();
var orderListData = [];
var orderList = document.querySelector(".js-orderList");

function getOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (response) {
    // console.log(response.data);
    orderListData = response.data.orders;
    renderC3();
    renderList(orderListData);
  });
}

function renderList(data) {
  var str = "";
  data.forEach(function (item) {
    //組訂單商品資訊
    var productStr = "";
    var productItem = item.products;
    productItem.forEach(function (productItem) {
      productStr += "<p>".concat(productItem.title, "x ").concat(productItem.quantity, "</p>");
    }); //判斷訂單狀態

    var orderPaidStatus = "";
    item.paid ? orderPaidStatus = "\u5DF2\u8655\u7406" : orderPaidStatus = "\u672A\u8655\u7406"; //組時間字串

    var thisStamp = new Date(item.createdAt * 1000);
    var thisTime = "".concat(thisStamp.getFullYear(), "/").concat(thisStamp.getMonth() + 1, "/").concat(thisStamp.getDate()); //   console.log(thisTime);
    //組訂單List

    var content = "<tr>\n        <td>".concat(item.id, "</td>\n        <td>\n          <p>").concat(item.user.name, "</p>\n          <p>").concat(item.user.tel, "</p>\n        </td>\n        <td>").concat(item.user.address, "</td>\n        <td>").concat(item.user.email, "</td>\n        <td>\n          ").concat(productStr, "\n        </td>\n        <td>").concat(thisTime, "</td>\n        <td class=\"orderStatus\">\n          <a href=\"#\" data-id=\"").concat(item.id, "\" data-status=\"").concat(item.paid, "\" class=\"text-primary js-orderStatus\">").concat(orderPaidStatus, "</a>\n        </td>\n        <td>\n          <input type=\"button\" class=\"delSingleOrder-Btn js-orderDelete\" data-id=\"").concat(item.id, "\" value=\"\u522A\u9664\">\n        </td>\n      </tr>");
    str += content;
  });
  orderList.innerHTML = str;
}

function renderC3() {
  console.log(orderListData);
  var totalItem = {};
  orderListData.forEach(function (item) {
    item.products.forEach(function (products) {
      if (!totalItem[products.category]) {
        totalItem[products.category] = products.price * products.quantity;
      } else {
        totalItem[products.category] += products.price * products.quantity;
      }
    });
  }); // console.log(totalItem)

  var totalItemC3 = Object.entries(totalItem); // console.log(totalItemC3)
  // C3.js

  var chart = c3.generate({
    bindto: '#chart',
    // HTML 元素綁定
    data: {
      type: "pie",
      columns: totalItemC3,
      colors: {
        "床架": "#DACBFF",
        "收納": "#9D7FEA",
        "窗簾": "#5434A7",
        "其他": "#301E5F"
      }
    }
  });
}

orderList.addEventListener('click', function (e) {
  e.preventDefault();
  var targetClass = e.target.getAttribute("class"); // console.log(targetClass);

  var Id = e.target.dataset.id;

  if (targetClass == "text-primary js-orderStatus") {
    // console.log(e.target.dataset.status);
    var status = e.target.dataset.status;
    completeOrderItem(status, Id);
    return;
  }

  if (targetClass == "delSingleOrder-Btn js-orderDelete") {
    //   console.log(e.target.dataset.id);
    deleteOrderItem(Id);
    return;
  }
});

function completeOrderItem(status, Id) {
  // console.log(status,Id);
  var newStatus; // if(!status){
  //     newStatus = false
  // }else{
  //     newStatus = true
  // }

  !status ? newStatus = false : newStatus = true;
  console.log(newStatus);
  axios.put("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    "data": {
      "id": Id,
      "paid": newStatus
    }
  }, {
    headers: {
      'Authorization': token
    }
  }).then(function (res) {
    alert("修改訂單成功");
    getOrderList();
  });
}

function deleteOrderItem(Id) {
  // console.log(Id);
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(Id), {
    headers: {
      'Authorization': token
    }
  }).then(function (res) {
    alert("刪除完畢");
    getOrderList();
  });
}

var deleteOrderBtnAll = document.querySelector(".discardAllBtn");
deleteOrderBtnAll.addEventListener("click", function (e) {
  e.preventDefault();
  axios["delete"]("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      'Authorization': token
    }
  }).then(function (res) {
    alert("已全部刪除");
    getOrderList();
  })["catch"](function (err) {
    alert("請勿重複按取");
    getOrderList();
  });
});
//# sourceMappingURL=admin.js.map
