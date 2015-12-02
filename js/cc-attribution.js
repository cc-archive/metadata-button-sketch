////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////

// From: https://github.com/exif-js/exif-js , Apache2
var ccObjectURLToBlob = function (url, callback) {
  var http = new XMLHttpRequest();
  http.open("GET", url, true);
  http.responseType = "blob";
  //console.log(url);
  http.onload = function(e) {
    //console.log(url);
    //console.log(this);
    if (this.status == 200 || this.status === 0) {
      //console.log('OK');
      callback(this.response);
    }
  };
  http.send();
};

/*var ccCopyTextNaughtily = function (text) {
  var element = document.createElement('textarea');
  document.body.appendChild(element);
  element.innerHTML = text;
  element.select();
  var succeeded;
  try {
    succeeded = document.execCommand("copy");
  } catch (e) {
    succeeded = false;
  }
  if (succeeded) {
    // The copy was successful
  } else {
    // The copy failed
  }
  element.setSelectionRange(0, 0);
  document.body.removeChild(element);
};*/


////////////////////////////////////////////////////////////////////////////////
// Fetch metadata and add attribution and button to element
////////////////////////////////////////////////////////////////////////////////

var ccAddAttributionButtonHTML = function (element, attribution, locale) {
  var supported = true;//document.queryCommandSupported("copy");
  if (supported) {
    var button = document.createElement('button');
    button.type="button";
    button.className += 'cc-attribution-copy-button';
    button.setAttribute('data-clipboard-text', attribution);
    button.innerHTML = "Copy attribution to clipboard.";
    element.appendChild(button);
    /*button.addEventListener("click", function(event) {
      event.preventDefault();
      ccCopyTextNaughtily(attribution);
    });*/
  } else {
    //element.appendChild("<p>Copy this text to include and attribute the work.</p>");
  }
};

//FIXME: Allow button and element class specification
var addAttributionBlockAndButton = function (img, element, locale) {
  locale = typeof locale !== 'undefined' ? locale : 'en';
  var img_url = img.src;
  //console.log(img_url);
  ccObjectURLToBlob(img_url, function (blob) {
    //console.log(2);
    ccParseXMP(blob, function(err, xmp) {
      //console.log(img_url + " " + err);
      if (! err) {
        var attribution = ccLicenseToHTMLPlusRDFa(xmp.workTitle, img_url,
                                                  xmp.attributionName,
                                                  xmp.attributionURL,
                                                  xmp.licenseURL, locale);
        //console.log(attribution);
        // Allow the user to pass us an element, to ask us to create a specific
        // kind of element, or just accept a default
        if (typeof element === 'undefined' || ! element) {
          element = document.createElement('div');
        } else if (typeof element === 'string') {
          element = document.createElement(element);
        }
        element.className += 'cc-attribution-block';
        element.innerHTML = attribution + '<br />';
        ccAddAttributionButtonHTML(element, attribution, locale);
        img.parentNode.appendChild(element);
      }
    });
  });
};
