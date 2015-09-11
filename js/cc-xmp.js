


var ccXMPNamespaceResolver = function (prefix) {
  var ns = {
    'x' : 'adobe:ns:meta/',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'cc': 'http://creativecommons.org/ns#',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'xapRights': 'http://ns.adobe.com/xap/1.0/rights/',
    'xmpRights': 'http://ns.adobe.com/xap/1.0/rights/'
  };
  return ns[prefix] || null;
};

var ccXMLValueByPath = function (xml, path) {
  return xml.evaluate(path, xml, ccXMPNamespaceResolver,
                      XPathResult.FIRST_ORDERED_NODE_TYPE, null)
    .singleNodeValue;
};

var ccExtractXMPLicensing = function (parser, callback) {
  var XMP_PATH = '//x:xmpmeta/rdf:RDF/rdf:Description/';
  var title = '';
  var attributionName = '';
  var attributionUrl = '';
  var license = '';
  var licenseNode = ccXMLValueByPath(parser, XMP_PATH + 'cc:license');
  if (licenseNode) {
    license = licenseNode.getAttribute('rdf:resource');
  }
  var attributionNameNode = ccXMLValueByPath(parser,
                                           XMP_PATH + 'cc:attributionName');
  if (attributionNameNode) {
    attributionName = attributionNameNode.innerHTML;
  }
  //FIXME: also handle older xapRights: prefix
  //       as the chooser generates XMP using that (as of first half of 2015)
  var attributionUrlNode = ccXMLValueByPath(parser,
                                          XMP_PATH + 'xmpRights:WebStatement');
  if (attributionUrlNode) {
    //FIXME: xapRights:Webstatement has the url as its rdf:resource attribute
    attributionUrl = attributionUrlNode.innerHTML;
  }
  //FIXME: There may be more than one li, e.g.:
  /*
    <rdf:Alt>
	  <rdf:li xml:lang='x-default'>Smley Face</rdf:li>
	  <rdf:li xml:lang='en_US'>Smley Face</rdf:li>
	</rdf:Alt>
  */
  var titleNode = ccXMLValueByPath(parser,
                                 XMP_PATH + 'dc:title/rdf:Alt/rdf:li');
  if (titleNode) {
    title = titleNode.innerHTML;
  }
  callback (0, {'workTitle':title,
                'attributionName':attributionName,
                'attributionURL': attributionUrl,
                'licenseURL':license});
};

var ccParseXMP = function (blob, callback) {
  var reader = new FileReader();
  reader.onload = function() {
    var start = reader.result.indexOf('<x:xmpmeta');
    if (start == -1) {
      callback(1, false);
      return;
    }                                     
    var end = reader.result.indexOf('</x:xmpmeta>');
    var length = (end - start) + 12;
    var data = reader.result.substr(start, start + length);
    var parser = new DOMParser();
    var xml = parser.parseFromString(data, 'application/xml');
    ccExtractXMPLicensing(xml, callback);
  };
  reader.readAsText(blob);
};
