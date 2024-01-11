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

#### Three
-- Sub 
--- Sub2 
Set temp-hidden attribute, to hide until ready the component

