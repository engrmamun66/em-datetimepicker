# rentmy_js_cdn

## Project Setup

```sh
npm install
```

## Compile Build Commands

```sh
npm run build
npm run build-dev1
npm run build-dev2
npm run build-stage
npm run build-prod
```

## Run build to wordpress

```sh
npm run wp
```

## To display variable or div outside of [rentmy-wraper]
Set temp-hidden attribute, to hide until ready the component
example-1: 
<p temp-hidden>{{ customer_name }}
<p temp-hidden>{{ customer_company }}</p>
example-2: 
<div temp-hidden> 
    <p>{{ customer_name }}</p> 
    <p>{{ customer_company }}</p>
</div>

## Page Like in href of a tag
a[RentMyPageLink="products_list"]
a[RentMyPageLink="checkout"]
a[RentMyPageLink="cart"]
a[RentMyPageLink="login"]
a[RentMyPageLink="logout"]
a[RentMyPageLink="registration"]
a[RentMyPageLink="reset_password"]
a[RentMyPageLink="customer_profile"]
a[RentMyPageLink="customer_change_password"]
a[RentMyPageLink="customer_change_avatar"]
a[RentMyPageLink="customer_order_history"]
a[RentMyPageLink="product_details"][uid="product_uid"]
a[RentMyPageLink="package_details"][uid="product_uid"]
a[RentMyPageLink="event_management"]
a[RentMyPageLink="rentmy_dashboard"]

## Global Logout class and id
#rentmy_logout_btn || .rentmy_logout_btn

## Some Important classes for wp menu
.RentMy-login-page
.RentMy-client-portal-page
.RentMyMiniCart