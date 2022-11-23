////config section
// config test

const api_path = "testrabbit";
const token = "8ki6mIFCZqOqa2U0T7bPSRXZkOr2";



////index section
let productData = [];
let cartData = [];
const productList = document.querySelector(".productWrap");
const productSelect = document.querySelector(".productSelect");

function init(){
    getProductList();
    getCartList();
};

init();

//取product api裡資料
function getProductList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`)
      .then(res=>{
        // console.log(res.data);
        productData = res.data.products;
        renderCard(productData);
      })
};


//將product api資料渲染成HTML(card)
function renderCard(data){
    let str = "";
    data.forEach(item=>{
        let content = `<li class="productCard">
            <h4 class="productType">新品</h4>
            <img src="${item.images}" alt="">
            <a href="#" class="js-addCart" data-id="${item.id}">加入購物車</a>
            <h3>${item.title}</h3>
            <del class="originPrice">NT${item.origin_price}</del>
            <p class="nowPrice">NT${item.price}</p>
        </li>`
        str+=content;
    })
    productList.innerHTML = str;
}

//篩選category
productSelect.addEventListener("change",(e)=>{
    // console.log(e.target.value);
    const category = e.target.value;
    if( category === "全部"){
        renderCard(productData)
    }else{
        const tempData = [];
        productData.forEach(item=>{
            if(item.category === category){
                tempData.push(item)
            }
        })
        renderCard(tempData);
    }
})


////購物車
//點選購物車
productList.addEventListener("click",(e)=>{
    e.preventDefault();
    let addCartClass = e.target.getAttribute("class");
    if(addCartClass !== "js-addCart"){
        return;
    }
    let productId = e.target.getAttribute("data-id");
    console.log(productId)

    let numberCheck = 1;
    // console.log(cartData)
    cartData.forEach(item =>{
        if(productId === item.product.id){
            item.quantity+=1;
            numberCheck=item.quantity;
        }
        // console.log(numberCheck)
    })

    // 加入購物車 數量 並輸入給api
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,{
        "data": {
            "productId": productId,
            "quantity": numberCheck
          }
    }).then(res=>{
            console.log(res)
            alert("加入成功")
            getCartList(cartData);
        })
})

//取購物車api
function getCartList(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(res=>{
            // console.log(res.data);
            let finalTotal = res.data.finalTotal;
            document.querySelector(".js-total").textContent = finalTotal;
            cartData = res.data.carts;
            renderCart(cartData);
        })
}

const cartList = document.querySelector(".shoppingCart-tableList");

function renderCart(data){
    let str = '';
    data.forEach(item=>{
        let content = `<tr>
            <td>
                <div class="cardItem-title">
                    <img src="${item.product.images}" alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>${item.product.price * item.quantity}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-id="${item.id}">
                    clear
                </a>
            </td>
        </tr>`
        str+=content;
    })
    
    cartList.innerHTML = str;
}

//刪除購物車單一品項
cartList.addEventListener('click',(e)=>{
    e.preventDefault();
    // console.log(e.target)
    const cartId = e.target.getAttribute('data-id');
    if(cartId == null){
        return;
    }
    // console.log(cartId)

    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`)
        .then(res=>{
            alert("刪除成功")
            getCartList()
        })
})

//刪除整個購物車
const discardAllBtn = document.querySelector(".discardAllBtn");

discardAllBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`)
        .then(res=>{
            alert("全部刪除成功")
            getCartList();
        })
        .catch(err=>{
            alert("已清空，請勿重複刪除")
            getCartList();
        })
})

////加入預定訂單

const orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    // console.log(e.target)
    if(cartData.length ==0){
        alert("請加入購物車");
        return;
    }

    const customerName = document.querySelector("#customerName").value;
    const customerPhone = document.querySelector("#customerPhone").value;
    const customerEmail = document.querySelector("#customerEmail").value;
    const customerAddress = document.querySelector("#customerAddress").value;
    const customerTradeWay = document.querySelector("#tradeWay").value;
    if(customerName==""||customerAddress==""||customerPhone==""||customerEmail==""||customerTradeWay==""){
        alert("請輸入訂單資訊")
        return;
    }

    const orderForm = document.querySelector(".orderInfo-form");

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,{
        "data": {
            "user": {
            "name": customerName,
            "tel": customerPhone,
            "email": customerEmail,
            "address": customerAddress,
            "payment": customerTradeWay
            }
        }
    }).then(res=>{
        alert("訂單建立成功")
        orderForm.reset();
        getCartList();
    })
})

