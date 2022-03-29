# Azure Pipeline ZAP Scanner
Using OWASP [ZAP](https://www.zaproxy.org/) to perform security testing on the azure DevOps pipeline.

## Trigger

I would do this task when the website is deployed to the development via a release pipeline.

## Usage

Step by step to create the ZAP release pipeline.

### Zap Scanner Step

Utilize the OWASP/ZAP scanner within Azure DevOps using docker.

Refer to `OWASP Zap Scanner.yml`.

### Create NUnit template

Azure DevOps Publish Test Result needs the NUnit report, but ZAP reports only support `.json`, `.html`.
Therefore, these steps will help to generate the NUnit report from ZAP report.

1. Install Handlebars Commandline Tool

To invoke [handlebarsjs](http://handlebarsjs.com/) a simple templating language from the commandline, using this package [hbs-commandline](https://www.npmjs.com/package/hbs-commandline).

Refer to `Install Handlebars Commandline Tool.yml`.

2. Create NUnit Template

Following the guideline to create `_test-suite_, _test-case_ from [NUnit XML format](https://docs.nunit.org/articles/nunit/technical-notes/usage/Test-Result-XML-Format.html).

Refer to `Create NUnit Template.yml`

3. Add Handlebarsjs Helpers (Optional)

Whenever your template needs to do some logic behind it, think about creating helpers.

Refer to `Add Handlebarsjs Helpers.yml`.

For example:
The ZAP security results include risk levels: _High, Medium, Low, Informational_. Usually, the _Informational_ level instances have no changes are required.
Therefore, it's necessary to ignore them in the result.
Specifically, the NUnit basic result of the test: _Passed, Failed, Inconclusive or Skipped_, consider Informational level should be _Inconclusive_

Let make a helper as below:

```js
var helpers = function () {};

helpers.register = function (Handlebars) {

    Handlebars.registerHelper('convertRiskCode', function(value) {
        return value !== "0" ? "Failed" : "Inconclusive";
    });
};

module.exports = helpers;

```
4. Generate NUnit type file
Using `hbs-commandline`

```sh
hbs-commandline zap-report.json optional-helpers.js < template.hbs > test-results.xml

```

### Publish Test Results OWASP ZAP to Azure DevOps

Refer to `Publish Test Results OWASP ZAP.yml`.

Consider enabling `failTaskOnFailedTests: true` to fail the task if test failures are detected in the result files.

## License
MIT