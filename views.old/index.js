function pug_attr(t,e,n,f){return e!==!1&&null!=e&&(e||"class"!==t&&"style"!==t)?e===!0?" "+(f?t:t+'="'+t+'"'):("function"==typeof e.toJSON&&(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||e.indexOf('"')===-1)?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"):""}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (args, result, viewport) {if (args.site == 'Applitec') {
pug_html = pug_html + "\u003C!DOCTYPE html\u003E\u003Chtml lang=\"en\"\u003E\u003Chead\u003E\u003Ctitle\u003E" + (pug_escape(null == (pug_interp = args.title) ? "" : pug_interp)) + "\u003C\u002Ftitle\u003E\u003Cmeta" + (pug_attr("name", viewport, true, true)+" content=\"width=device-width, initial-scale=1\"") + "\u003E\u003Cmeta charset=\"utf-8\"\u003E\u003Cmeta name=\"copyright\" content=\"#{args.copyright}\"\u003E\u003Cmeta name=\"Author\" content=\"#{args.author}\"\u003E\u003Cmeta name=\"description\" content=\"#{args.desc}\"\u003E\u003Cmeta name=\"keywords\" content=\"Barton Phillips\"\u003E\u003Clink rel=\"stylesheet\" href=\"http:\u002F\u002Fwww.applitec.com\u002Fcss\u002Fnav.css\"\u003E\u003Clink rel=\"stylesheet\" href=\"http:\u002F\u002Fwww.applitec.com\u002Fcss\u002Fapplitec.css\"\u003E\u003Cstyle\u003E#hitCounter { margin-left: auto; margin-right: auto; width: 50%; text-align: center; }\n#hitCountertbl { font-size: 1em; width: 0; border: 8px ridge yellow; margin-left: auto; margin-right: auto; background-color: #F5DEB3 }\n#hitCounterth { color: rgb(123, 16, 66); }\n.underline { \ttext-decoration: underline; }\n\u003C\u002Fstyle\u003E\u003Cscript src=\"http:\u002F\u002Fajax.googleapis.com\u002Fajax\u002Flibs\u002Fjquery\u002F1\u002Fjquery.min.js\"\u003E\u003C\u002Fscript\u003E\u003C\u002Fhead\u003E\u003Cbody\u003E\u003Cheader\u003E\u003Cdiv id=\"topTitleDiv\"\u003E\u003Ca href=\"\u002Fapplitec\"\u003EApplied Technology Resources,&nbsp;Inc.\u003C\u002Fa\u003E\u003Cimg id=\"logo\" src=\"http:\u002F\u002Fbartonphillips.net\u002Fimages\u002Fblank.png\"\u003E\u003C\u002Fdiv\u003E\u003Cnav\u003E\u003Cdiv id=\"navMap\"\u003E\u003Cul\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Fsitemap\"\u003ESite Map \u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Fatribio\"\u003ECompany Information \u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Freference\"\u003EReferences \u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Fcontactus\"\u003EContact Us \u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C!-- Nav bar for small screens--\u003E\u003Cdiv id=\"smallNavMap\"\u003E\u003Clabel class=\"icon-menu\" for=\"smallmenu\"\u003EMenu\u003C\u002Flabel\u003E\u003Cinput type=\"checkbox\" id=\"smallmenu\" role=\"button\"\u003E\u003Cul id=\"smenu\"\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\"\u003EHome\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Fsitemap\"\u003ESite Map\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Fatribio\"\u003ECompany Info\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"\u002Fapplitec\u002Freference\"\u003EReferences\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003Cli\u003E\u003Ca href=\"contactus\"\u003EContact Us\u003C\u002Fa\u003E\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003C\u002Fdiv\u003E\u003C\u002Fnav\u003E\u003Cnoscript\u003E\u003Cp style=\"color: red; background-color: #FFE4E1; padding: 10px\"\u003EYour browser either does not support \u003Cb\u003EJavaScripts\u003C\u002Fb\u003E or you have JavaScripts disabled, \nin either case your browsing experience will be significantly impaired. \nIf your browser supports JavaScripts but you have it disabled consider enabaling\nJavaScripts conditionally if your browser supports that. Sorry for the inconvienence.\n\u003C\u002Fp\u003E\u003C\u002Fnoscript\u003E\u003C\u002Fheader\u003E\u003Cfooter\u003EReturn to Applitec \u003Ca class=\"underline\" href=\"\u002Fapplitec\"\u003EHome Page\u003C\u002Fa\u003E\u003Ch2 class=\"center\"\u003E\u003Ca href=\"\u002Fapplitec\u002Fwebstats\"\u003EWeb Stats\u003Cbr\u003E\u003Ca href=\"\u002Fapplitec\u002Faboutwebsite\"\u003EAbout This Site\u003C\u002Fa\u003E\u003C\u002Fa\u003E\u003C\u002Fh2\u003E\u003Caddress\u003ECopyright &copy; " + (pug_escape(null == (pug_interp = args.copyright) ? "" : pug_interp)) + "\u003Cbr\u003E23542 Lyons Ave. #209\u003Cbr\u003ENewhall, CA 91321\u003Cbr\u003E\u003Ca href=\"mailto:barton@applitec.com?SUBJECT=WebMaster+feedback\"\u003Ewebmaster@applitec.com\u003C\u002Fa\u003E\u003Cbr\u003EPhone: (818)652-9849\u003C\u002Faddress\u003E\u003Chr\u003E\u003Cdiv class=\"center\"\u003E" + (pug_escape(null == (pug_interp = args.msg) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv id=\"hitCounter\"\u003E\u003Ctable id=\"hitCountertbl\"\u003E\u003Ctr id=\"hitCountertr\"\u003E\u003Cth id=\"hitCounterth\"\u003E" + (pug_escape(null == (pug_interp = args.footer) ? "" : pug_interp)) + "\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cp class=\"center\"\u003ELast Modified: " + (pug_escape(null == (pug_interp = args.mtime) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Ffooter\u003E\u003C\u002Fbody\u003E\u003Cbody\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E\u003Chtml\u003E\u003C\u002Fhtml\u003E";
}
else {
pug_html = pug_html + "\u003C!DOCTYPE html\u003E\u003Chtml\u003E\u003Chead\u003E\u003Ctitle\u003E" + (pug_escape(null == (pug_interp = args.title) ? "" : pug_interp)) + "\u003C\u002Ftitle\u003E\u003Cmeta" + (pug_attr("name", viewport, true, true)+" content=\"width=device-width, initial-scale=1\"") + "\u003E\u003Cmeta charset=\"utf-8\"\u003E\u003Cmeta name=\"copyright\" content=\"#{args.copyright}\"\u003E\u003Cmeta name=\"Author\" content=\"#{args.author}\"\u003E\u003Cmeta name=\"description\" content=\"#{args.desc}\"\u003E\u003Cmeta name=\"keywords\" content=\"Barton Phillips\"\u003E\u003Clink rel=\"stylesheet\" href=\"http:\u002F\u002Fbartonphillips.net\u002Fcss\u002Fblp.css\" title=\"blp default\"\u003E\u003Cstyle\u003E.red {color: red;}\n.center {text-align: center;}\n#hitCounter { margin-left: auto; margin-right: auto; width: 50%; text-align: center; }\n#hitCountertbl { font-size: 1em; width: 0; border: 8px ridge yellow; margin-left: auto; margin-right: auto; background-color: #F5DEB3 }      #hitCountertr { width: 0; border: 8px ridge yellow; margin-left: auto; margin-right: auto; background-color: #F5DEB3 }\n#hitCounterth { color: rgb(123, 16, 66); }\n\u003C\u002Fstyle\u003E\u003Cstyle\u003E#info { border: 1px solid black; width: 100%; height: 20rem; overflow: auto; }\n#info table { widht: 100%; }\n#info td, #info th { border: 1px solid black; padding: .5rem; }\n\u003C\u002Fstyle\u003E\u003Cscript src=\"http:\u002F\u002Fajax.googleapis.com\u002Fajax\u002Flibs\u002Fjquery\u002F1\u002Fjquery.min.js\"\u003E\u003C\u002Fscript\u003E\u003C\u002Fhead\u003E\u003Cbody\u003E\u003Cheader\u003E\u003Cdiv\u003E\u003Ca href=\"http:\u002F\u002Flocalhost\"\u003E\u003Cimg id=\"blpimg\" src=\"http:\u002F\u002Fbartonphillips.net\u002Fimages\u002Fblp-image.png\" width=\"90\" height-'120 alt=\"Barton's Picture\"\u003E\u003C\u002Fa\u003E\u003Ca href=\"http:\u002F\u002Flinuxcounter.net\u002F\"\u003E\u003Cimg id=\"linuxcounter\" src=\"http:\u002F\u002Fbartonphillips.net\u002Fimages\u002F146624.png\" width=\"190\" height=\"110\" alt=\"linux counter image.\"\u003E\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003Ch1 class=\"center\"\u003E" + (pug_escape(null == (pug_interp = args.banner) ? "" : pug_interp)) + "\u003C\u002Fh1\u003E\u003Chr\u003E\u003C\u002Fheader\u003E\u003Cp\u003EThis page is on port " + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + " and your can do the following:\u003C\u002Fp\u003E\u003Cul\u003E\u003Cli\u003EThis is the root or '\u002F'.\u003C\u002Fli\u003E\u003Cli\u003EIf you enter \u003Ca href=\"http:\u002F\u002Fwww.bartonlp.org:#{args.port}\u002Fapplitec\"\u003Ehttp:\u002F\u002Fwww.bartonlp.org:" + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + "\u002Fapplitec\u003C\u002Fa\u003E you will get my Applitec node.js page.\u003C\u002Fli\u003E\u003Cli\u003EIf you enter \n\u003Ca href='http:\u002F\u002Fwww.bartonlp.org:" + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + "\u002Fquery'\u003Ehttp:\u002F\u002Fwww.bartonlp.org:" + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + "\u002Fquery\u003C\u002Fa\u003E \nyou will get a page that lets you run a mysql query against the database. The databases are 'barton' and 'nodetest'.\nThere are two tables 'barton.counter' and 'nodetest.mynode'. \u003C\u002Fli\u003E\u003Cli\u003EIf you enter \n\u003Ca href='http:\u002F\u002Fwww.bartonlp.org:" + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + "\u002Fhowitworks'\u003Ehttp:\u002F\u002Fwww.bartonlp.org:" + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + "\u002Fhowitworks\u003C\u002Fa\u003E \nyou will get a page that explains how the application works.\n\u003C\u002Fli\u003E\u003C\u002Ful\u003E\u003Cp\u003EWhile this may not seem like a wonderful thing it is interesting. I have used 'express' as the framework.\nFor details on the implementation \n\u003Ca href=\"http:\u002F\u002Fwww.bartonlp.org:" + (pug_escape(null == (pug_interp = args.port) ? "" : pug_interp)) + "\u002Fhowitworks\"\u003EHow It Works\u003C\u002Fa\u003E.\n\u003C\u002Fp\u003E\u003Ch3\u003EThe following is from my mysql 'barton.counter' table\u003C\u002Fh3\u003E\u003Cp\u003EYou should see your IP and Agent in the list.\u003C\u002Fp\u003E\u003Cdiv id=\"info\"\u003E";
if (result[0] == null) {
pug_html = pug_html + "\u003Ch3\u003ECounter Table Empty\u003C\u002Fh3\u003E";
}
else {
pug_html = pug_html + "\u003Ctable\u003E\u003Cthead\u003E\u003Ctr\u003E\u003C\u002Ftr\u003E";
// iterate result[0]
;(function(){
  var $$obj = result[0];
  if ('number' == typeof $$obj.length) {
      for (var key = 0, $$l = $$obj.length; key < $$l; key++) {
        var item = $$obj[key];
pug_html = pug_html + "\u003Cth\u003E" + (pug_escape(null == (pug_interp = key) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
      }
  } else {
    var $$l = 0;
    for (var key in $$obj) {
      $$l++;
      var item = $$obj[key];
pug_html = pug_html + "\u003Cth\u003E" + (pug_escape(null == (pug_interp = key) ? "" : pug_interp)) + "\u003C\u002Fth\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fthead\u003E\u003Ctbody\u003E";
// iterate result
;(function(){
  var $$obj = result;
  if ('number' == typeof $$obj.length) {
      for (var pug_index1 = 0, $$l = $$obj.length; pug_index1 < $$l; pug_index1++) {
        var c = $$obj[pug_index1];
pug_html = pug_html + "\u003Ctr\u003E\u003C\u002Ftr\u003E";
// iterate c
;(function(){
  var $$obj = c;
  if ('number' == typeof $$obj.length) {
      for (var pug_index2 = 0, $$l = $$obj.length; pug_index2 < $$l; pug_index2++) {
        var item = $$obj[pug_index2];
pug_html = pug_html + "\u003Ctd\u003E" + (pug_escape(null == (pug_interp = item) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index2 in $$obj) {
      $$l++;
      var item = $$obj[pug_index2];
pug_html = pug_html + "\u003Ctd\u003E" + (pug_escape(null == (pug_interp = item) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

      }
  } else {
    var $$l = 0;
    for (var pug_index1 in $$obj) {
      $$l++;
      var c = $$obj[pug_index1];
pug_html = pug_html + "\u003Ctr\u003E\u003C\u002Ftr\u003E";
// iterate c
;(function(){
  var $$obj = c;
  if ('number' == typeof $$obj.length) {
      for (var pug_index3 = 0, $$l = $$obj.length; pug_index3 < $$l; pug_index3++) {
        var item = $$obj[pug_index3];
pug_html = pug_html + "\u003Ctd\u003E" + (pug_escape(null == (pug_interp = item) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index3 in $$obj) {
      $$l++;
      var item = $$obj[pug_index3];
pug_html = pug_html + "\u003Ctd\u003E" + (pug_escape(null == (pug_interp = item) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E";
    }
  }
}).call(this);

    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ftbody\u003E\u003C\u002Ftable\u003E";
}
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003Cfooter\u003E\u003Chr\u003EReturn to \u003Ca class=\"underline\" href=\"\u002F\"\u003EHome Page\u003C\u002Fa\u003E\u003Ch2 class=\"center\"\u003E\u003Ca href=\"\u002Fwebstats\"\u003EWeb Stats\u003Cbr\u003E\u003Ca href=\"\u002Faboutwebsite\"\u003EAbout This Site\u003C\u002Fa\u003E\u003C\u002Fa\u003E\u003C\u002Fh2\u003E\u003Cdiv id=\"counter\"\u003E\u003Cdiv\u003E" + (pug_escape(null == (pug_interp = args.msg) ? "" : pug_interp)) + "\u003C\u002Fdiv\u003E\u003Cdiv id=\"hitCounter\"\u003E\u003Ctable id=\"hitCountertbl\"\u003E\u003Ctr id=\"hitCountertr\"\u003E\u003Cth id=\"hitCounterth\"\u003E" + (pug_escape(null == (pug_interp = args.footer) ? "" : pug_interp)) + "\u003C\u002Fth\u003E\u003C\u002Ftr\u003E\u003C\u002Ftable\u003E\u003C\u002Fdiv\u003E\u003Cdiv id=\"address\"\u003E\u003Caddress\u003ECopyright &copy; " + (pug_escape(null == (pug_interp = args.copyright) ? "" : pug_interp)) + "\n\u003Cbr\u003E\nBarton Phillips, 828 Cayo Grande Ct. Newbury Park CA 91320\n\u003Cbr\u003E\n\u003C\u002Faddress\u003E\u003C\u002Fdiv\u003E\u003CLast\u003EModified: " + (pug_escape(null == (pug_interp = args.mtime) ? "" : pug_interp)) + "\u003C\u002FLast\u003E\u003C\u002Fdiv\u003E\u003C\u002Ffooter\u003E\u003C\u002Fbody\u003E\u003C\u002Fhtml\u003E";
}}.call(this,"args" in locals_for_with?locals_for_with.args:typeof args!=="undefined"?args:undefined,"result" in locals_for_with?locals_for_with.result:typeof result!=="undefined"?result:undefined,"viewport" in locals_for_with?locals_for_with.viewport:typeof viewport!=="undefined"?viewport:undefined));;return pug_html;}