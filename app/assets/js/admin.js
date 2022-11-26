// 預設 JS，請同學不要修改此處
let menuOpenBtn = document.querySelector('.menuToggle');
let linkBtn = document.querySelectorAll('.topBar-menu a');
let menu = document.querySelector('.topBar-menu');
menuOpenBtn.addEventListener('click', menuToggle);

linkBtn.forEach((item) => {
    item.addEventListener('click', closeMenu);
})

function menuToggle() {
    if(menu.classList.contains('openMenu')) {
        menu.classList.remove('openMenu');
    }else {
        menu.classList.add('openMenu');
    }
}
function closeMenu() {
    menu.classList.remove('openMenu');
}



////後台
//取得訂單資料

function init(){
    getOrderList();
}

init();

let orderListData = [];
const orderList = document.querySelector(".js-orderList")

function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      }).then(function (response) {
        // console.log(response.data);
        orderListData = response.data.orders;
        renderC3();
        renderList(orderListData);
      })
  }

function renderList(data){
    let str = "";
    data.forEach(item=>{
      //組訂單商品資訊
      let productStr = "";
      let productItem = item.products;
      productItem.forEach(productItem=>{
        productStr+=`<p>${productItem.title}x ${productItem.quantity}</p>`
      })
      //判斷訂單狀態
      let orderPaidStatus = ""
      item.paid? orderPaidStatus =`已處理`: orderPaidStatus =`未處理`
      //組時間字串
      const thisStamp = new Date(item.createdAt*1000);
      const thisTime = `${thisStamp.getFullYear()}/${thisStamp.getMonth()+1}/${thisStamp.getDate()}`
    //   console.log(thisTime);
      //組訂單List
      let content = `<tr>
        <td>${item.id}</td>
        <td>
          <p>${item.user.name}</p>
          <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
          ${productStr}
        </td>
        <td>${thisTime}</td>
        <td class="orderStatus">
          <a href="#" data-id="${item.id}" data-status="${item.paid}" class="text-primary js-orderStatus">${orderPaidStatus}</a>
        </td>
        <td>
          <input type="button" class="delSingleOrder-Btn js-orderDelete" data-id="${item.id}" value="刪除">
        </td>
      </tr>`
      str+=content;
    })
    orderList.innerHTML = str;
  }
  
function renderC3(){
    console.log(orderListData)
    let totalItem ={};
    orderListData.forEach(item=>{
        item.products.forEach(products=>{
            if(!totalItem[products.category]){
                totalItem[products.category] = products.price*products.quantity;
            }else{
                totalItem[products.category] += products.price*products.quantity;
            }
        })
    })
    // console.log(totalItem)
    let totalItemC3 = Object.entries(totalItem);
    // console.log(totalItemC3)
    // C3.js
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: totalItemC3,
            colors:{
                "床架":"#DACBFF",
                "收納":"#9D7FEA",
                "窗簾": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}

orderList.addEventListener('click',(e)=>{
    e.preventDefault();
    const targetClass = e.target.getAttribute("class");
    // console.log(targetClass);
    let Id = e.target.dataset.id;
    if(targetClass =="text-primary js-orderStatus") {
      // console.log(e.target.dataset.status);
      let status = e.target.dataset.status;
      completeOrderItem(status,Id);
      return
    }
    if(targetClass =="delSingleOrder-Btn js-orderDelete") {
    //   console.log(e.target.dataset.id);
      deleteOrderItem(Id);
      return
    }
  })
  
function completeOrderItem(status,Id) {
    // console.log(status,Id);
    let newStatus;
    // if(!status){
    //     newStatus = false
    // }else{
    //     newStatus = true
    // }
    !status? newStatus = false:newStatus = true;
    console.log(newStatus);
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
      "data": {
        "id": Id,
        "paid": newStatus
      }
    }, {
      headers: {
        'Authorization': token
      }
    })
    .then(res=>{
      alert("修改訂單成功")
      getOrderList();
    })
}  

function deleteOrderItem(Id){
    // console.log(Id);
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${Id}`,
      {
        headers: {
          'Authorization': token
        }
      }).then(res=>{
        alert("刪除完畢")
        getOrderList();
      })
}

const deleteOrderBtnAll = document.querySelector(".discardAllBtn");

deleteOrderBtnAll.addEventListener("click",(e)=>{
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          'Authorization': token
        }
      }).then(res=>{
        alert("已全部刪除");
        getOrderList();
      }).catch(err=>{
        alert("請勿重複按取")
        getOrderList();
      })
});