//TODO: Internationalization
//TODO: PD & CC0 support
//TODO: XMP and plain text support

////////////////////////////////////////////////////////////////////////////////
// Utilities
////////////////////////////////////////////////////////////////////////////////

var _ccStringSub = function (text, substitutions) {
  for (var key in substitutions) {
    var expand = new RegExp('%\\(' + key + '\\)', 'g');
    text = text.replace(expand, substitutions[key]);
  }
  return text;
};

////////////////////////////////////////////////////////////////////////////////
// License URL component extraction and expansion
////////////////////////////////////////////////////////////////////////////////

var ccLicenseURLLocale = function (url) {
  var locale = "International";
  if(parseInt(ccLicenseURLVersion(url)) < 4.0) {
    locale = "Unported";
    var match = url.match(/creativecommons.org\/licenses\/[^/]+\/([0-9.]+)\/([a-zA-Z])/);
    if (match) {
      locale = match[2];
    } 
  }
  return locale;
};

var ccLicenseURLVersion = function (url) {
  // Default to the current version
  var version = '4.0';
  var match = url.match(/creativecommons.org\/licenses\/[^/]+\/([0-9.]+)/);
  if (match) {
    version = match[1];
  }
  return version;
};

var ccLicenseURLShortcode = function (url) {
  var shortcode = false;
  var match = url.match(/creativecommons.org\/licenses\/([^/]+)\//);
  if (match) {
    shortcode = match[1];
  }
  return shortcode;
};

var ccLicenseURLName = function (url) {
  var name = '';
  switch (ccLicenseURLShortcode(url)) {
  case 'p':
    name = 'Creative Commons Public Domain Mark';
    break;
  case 'zero':
  // Deliberate fall-through
  case 'p/zero':
    name = 'Creative Commons Zero';
    break;
  case 'by-nc-sa':
    name = 'Creative Commons Attribution-NonCommercial-ShareAlike';
    break;
  case 'by-nc':
    name = 'Creative Commons Attribution-NonCommercial';
    break;
  case 'by-nc-nd':
    name = 'Creative Commons Attribution-NonCommercial-NoDerivs';
    break;
  case 'by':
    name = 'Creative Commons Attribution';
    break;
  case 'by-sa':
    name = 'Creative Commons Attribution-ShareAlike';
    break;
  case 'by-nd':
    name = 'Creative Commons Attribution-NoDerivs';
    break;
  }
  return name;
};

var ccRegionName = function (url) {
  return "International";
};

////////////////////////////////////////////////////////////////////////////////
// Public Domain URL compnent extraction and expansion
////////////////////////////////////////////////////////////////////////////////

var ccURLIsPublicDomain = function (url) {
  return url.indexOf('publicdomain' > -1);
};

////////////////////////////////////////////////////////////////////////////////
// Media types
////////////////////////////////////////////////////////////////////////////////

var ccMediaURLType = function (media_url) {
  var mediatype = false;
  var extension = media_url.split('.').pop().toLowerCase();
  if (['aif', 'aifc', 'aiff', 'au', 'flac', 'm4a', 'mp3', 'oga', 'ogg',
       'wav', 'wma'].indexOf(media_url) > -1) {
    mediatype = 'http://purl.org/dc/dcmitype/Sound';
  } else if (['jpg', 'jpeg', 'gif', 'png', 'tif', 'tiff', 'bmp',
              'pbm', 'pgm', 'pnm', 'ppm',
              'svg', 'webp'].indexOf(media_url) > -1) {
    mediatype = 'http://purl.org/dc/dcmitype/StillImage';
  } else if (['txt', 'html', 'htm', 'pdf', 'epub',
              'prc'].indexOf(media_url) > -1) {
    mediatype = 'http://purl.org/dc/dcmitype/Text';
  } else if (['avi', 'flv', 'mkv', 'mp2', 'mp4', 'mpg', 'mpeg', 'ogv', 'webm',
              'wmv'].indexOf(media_url) > -1) {
    mediatype = 'http://purl.org/dc/dcmitype/MovingImage';
  } else if (['csv'].indexOf(media_url) > -1) {
    mediatype = 'http://purl.org/dc/dcmitype/Dataset';
  } else if (['swf'].indexOf(media_url) > -1) {
    mediatype = 'http://purl.org/dc/dcmitype/InteractiveResource';
  }
  return mediatype;
};

////////////////////////////////////////////////////////////////////////////////
// Icons
////////////////////////////////////////////////////////////////////////////////

var ccLicenseURLIcon = function (url) {
  return 'https://licensebuttons.net/l/' +
    ccLicenseURLShortcode(url) + '/' + ccLicenseURLVersion(url) +
    '/88x31.png';
};

////////////////////////////////////////////////////////////////////////////////
// HTML+RDFa
////////////////////////////////////////////////////////////////////////////////

var ccLicenseToHTMLPlusRDFa = function (workTitle, workURL,
                                        attributionName, attributionURL,
                                        licenseURL, locale) {
  locale = typeof locale !== 'undefined' ? locale : 'en';
  var substitutions = {
    'title': workTitle,
    'attribution_name': attributionName,
    'attribution_url': attributionURL,
    'license_url': licenseURL,
    'license_name': ccLicenseURLName(licenseURL),
    'license_icon': ccLicenseURLIcon(licenseURL),
    'media_type': ccMediaURLType(workURL)
  };
  //TODO: Carefully identify which properties we have, get the localized text,
  // and expand.
  var template = '<a rel="license" href="%(license_url)"><img alt="Creative Commons License" style="border-width:0" src="%(license_icon)" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" href="%(media_type)" property="dct:title" rel="dct:type">%(title)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="%(attribution_url)" property="cc:attributionName" rel="cc:attributionURL">%(attribution_name)</a> is licensed under a <a rel="license" href="%(license_url)">Creative Commons Attribution 4.0 International License</a>.';
  return _ccStringSub (template, substitutions);
};

var ccLicenseToXMP = function (workTitle, workURL, attributionName,
                               attributionURL, licenseURL, locale) {
  //TODO
};

var ccLicenseToText = function (workTitle, workURL, attributionName,
                                attributionURL, licenseURL, locale) {
  //TODO
};

var ccPublicDomainToHTMLPlusRDFa = function () {
  //TODO
};
