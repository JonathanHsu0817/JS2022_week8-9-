"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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
      if (!totalItem[products.title]) {
        totalItem[products.title] = products.price * products.quantity;
      } else {
        totalItem[products.title] += products.price * products.quantity;
      }
    });
  }); // console.log(totalItem)
  //改成C3格式

  var totalItemC3 = Object.entries(totalItem); // console.log(totalItemC3)
  //整合其他內容

  var otherItem = totalItemC3.filter(function (item, index) {
    return index > 2;
  });
  var otherItemTotal = otherItem.reduce(function (prev, curr) {
    return [["\u5176\u4ED6", prev[1] + curr[1]]];
  }); // console.log(otherItemTotal);

  totalItemC3.splice(3, totalItemC3.length - 1);
  var newOtherTotalC3 = [].concat(_toConsumableArray(totalItemC3), _toConsumableArray(otherItemTotal));
  newOtherTotalC3.sort(function (a, b) {
    return a[1] - b[1];
  }); // console.log(newOtherTotalC3);
  // C3.js

  var chart = c3.generate({
    bindto: '#chart',
    // HTML 元素綁定
    data: {
      type: "pie",
      columns: newOtherTotalC3
    },
    color: {
      pattern: ["#DACBFF", "#9D7FEA", "#5434A7", "#301E5F"]
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
