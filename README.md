# Carbone Cloud API Node SDK
![GitHub release (latest by date)](https://img.shields.io/github/v/release/carboneio/carbone-sdk-node?style=for-the-badge)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg?style=for-the-badge)](./API-REFERENCE.md)


The SDK to use [Carbone Cloud API](https://carbone.io) easily.

> Carbone is a report generator (PDF, DOCX, XLSX, ODT, PPTX, ODS, XML, CSV...) using templates and JSON data.
[Learn more about the Carbone ecosystem](https://carbone.io/documentation.html).

## Install

```bash
$ npm i --save carbone-sdk
// OR
$ yarn add carbone-sdk
```

## Getting started

Try the following code to generate a report in 10 seconds. Insert:
* Your API key ([available on Carbone account](https://account.carbone.io/))
* The absolute path to your template (created from your text editor)
* The JSON data-set you want to inject inside the document

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')
const path       = require('path');

const options = {
  data: {
    /** YOUR DATA HERE **/
    firstname: "John",
    lastname:  "Wick"
  },
  convertTo: "pdf"
  /** List of other options: https://carbone.io/api-reference.html#render-reports **/
}

/** The template path must be absolute. Use the `path` module to get it. **/
const templateAbsolutePath = path.join(__dirname, 'path', 'to', 'template.odt')
/** Generate the document **/
carboneSDK.render(templateAbsolutePath, options, (err, buffer, filename) => {

})
```
Note: Each request executed in the SDK is retry once if the first reponse request is a `ECONNRESET` errors

## API

### Change Carbone version

To choose a specific version of Carbone Render API, use the following function.
It is only possible to set a major version of Carbone.
```js
// Set the version of carbone to 4
carboneSDK.setApiVersion(4)
```

### Pass headers

Initialise a global header that will be set for each API request.

```js
sdk.setOptions({
  headers: {
    'carbone-template-delete-after': 86400
    'carbone-webhook-url': 'https://...'
  }
})
```

### Add a template

When a template is uploaded, a `Template ID` is created which is the unique identifier for the template. If you upload the same template twice, you will have the same Template ID.
From the template you can:
* Generate a report
* Delete a template
* Download a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY');
const path       = require('path');

/** The template path must be absolute. Use the `path` module to get it. **/
const templateAbsolutePath = path.join(__dirname, 'path', 'to', 'template.odt')
carboneSDK.addTemplate(templateAbsolutePath, (err, templateId) => {

})
```

### Get a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

carboneSDK.getTemplate('templateId', (err, fileContentAsBuffer) => {
  /** Note: The content returned is a buffer and not a string **/
})
```

You can also get a template with stream.

```js
const writeStream = fs.createWriteStream('tmp.odt')
const carboneStream = carboneSDK.getTemplate('templateId')

carboneStream.on('error', (err) => {

})

writeStream.on('close', () => {
  // Get the real filename here
  let filename = carboneSDK.getFilename(carboneStream)
})

carboneStream.pipe(writeStream)
```

*The only way to get the filename when using stream is to wait the end of the request execution.*

### Delete a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

carboneSDK.delTemplate('templateId', (err) => {

})
```

### Render a template

There are multiple ways to render a template.

The first solution is to use a `templateId` (previously created from the method "addTemplate").

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

const options = {
  data: { /** YOUR DATA HERE **/ },
  convertTo: "pdf"
  /** List of other options: https://carbone.io/api-reference.html#render-reports **/
}

carboneSDK.render('templateId', options, (err, buffer, filename) => {

})
```

Or if you don't want the buffer but juste the link to download it later, you can set the options `isReturningBuffer: false` to the SDK.

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

const options = {
  data: { /** YOUR DATA HERE **/ },
  convertTo: "pdf"
  /** List of other options: https://carbone.io/api-reference.html#render-reports **/
}

carboneSDK.setOptions({
  isReturningBuffer: false
})

carboneSDK.render('templateId', options, (err, downloadLink, filename) => {

})
```

The second solution (and easiest one) is to write the path of your local file, not the template ID. By using this method, if your template does not exist or has been deleted, the SDK will automatically:
* upload the template
* generate the report
* download the report as Buffer

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

const options = {
  data: {
    /** YOUR DATA HERE **/
    firstname: "John",
    lastname:  "Wick"
  },
  convertTo: "pdf"
  /** List of other options: https://carbone.io/api-reference.html#render-reports **/
}

carboneSDK.render('/absolute/path/to/your/template', options, (err, buffer, filename) => {

})
```
You can also render you template and get result with a stream.

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

const options = {
  data: { /** YOUR DATA HERE **/ },
  convertTo: "pdf"
  /** List of other options: https://carbone.io/api-reference.html#render-reports **/
}

const writeStream = fs.createWriteStream('result.pdf')
const sdkStream = carboneSDK.render('/absolute/path/to/your/template', options)

sdkStream.on('error', (err) => {

})

writeStream.on('close', () => {
  // Here you can get the real filename
  let filename = carboneSDK.getFilename(sdkStream)
})

sdkStream.pipe(writeStream)
```

## API Promise

All function of the SDK are also available with promise.

### Add a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

carboneSDK.addTemplatePromise('/absolute/path/to/your/template', 'OPTIONAL-PAYLOAD')
.then(templateId => {

})
.catch(err => {

})
```

### Get a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

carboneSDK.getTemplatePromise('templateId')
.then(content => {

})
.catch(err => {

})
```

### Delete a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

carboneSDK.delTemplatePromise('templateId', 'OPTIONAL-PAYLOAD')
.then(templateId => {

})
.catch(err => {

})
```

### Render a template

```js
const carboneSDK = require('carbone-sdk')('YOUR-API-KEY')

const options = {
  data: { /** YOUR DATA HERE **/ },
  convertTo: "pdf"
  /** List of other options: https://carbone.io/api-reference.html#render-reports **/
}

carboneSDK.renderPromise('/absolute/path/to/your/template', options)
.then(result => {
  // result.content contains the rendered file
  // result.filename containes the rendered filename
})
.catch(err => {

})
```
