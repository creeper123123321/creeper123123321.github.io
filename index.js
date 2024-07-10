$(() => {
var pageNow = null;

const pages = {
  "home": {
    title: "home", lang: "en-us",
    content: `## Projects
- [GitHub](https://github.com/creeper123123321)
- [Modrinth](https://modrinth.com/user/creeper123123321)
- [CurseForge](https://www.curseforge.com/members/creeper12312332/projects)

## Social
- Discord: creeper123123321
- [Mastodon](https://social.vivaldi.net/@creeper123123321)
- [Keybase](https://keybase.io/creeper123123321)`
  },
  "404": {"title": "not found", "lang": "en-us", "content": "**404 Not Found**\n\n[Go to home](#home)"},
  "donate": {
    "title": "donate", "lang": "en-us",
    "content": "## Donate\n- [Github Sponsors](https://github.com/sponsors/creeper123123321/)\n- [PayPal](https://www.paypal.com/donate/?business=AXCK2P7NJNRVN&item_name=Donation+to+creeper123123321&currency_code=USD)\n- [PicPay](https://picpay.me/creeper123123321)"
  },
}

const notFound = "404";
const home = "home";

function updatePage() {
  const pageRegex = new RegExp("^[a-z0-9\-]+$");
  var hash = decodeURIComponent(location.hash.substring(1));
  var pageToLoad = hash.split("#", 1)[0];
  var anchor = hash.substring(pageToLoad.length + 1);
  if (!anchor) anchor = null;
  if (!pageToLoad) pageToLoad = home;
  if (!pageRegex.test(pageToLoad)) pageToLoad = notFound;
  if (pageToLoad != pageNow) {
    try {
      history.replaceState(null, null, "#" + pageToLoad + (anchor ? "#" + anchor : ""));
    } catch (e) {
      location.hash = "#" + pageToLoad + (anchor ? "#" + anchor : ""); // may be an iframe
    }
    data = pages[pageToLoad];
    if (data != undefined) {
      loadPage(pageToLoad, data, anchor);
    } else {
      location.replace("#" + notFound);
    }
  } else {
    goToAnchor(anchor);
  }
}
function popState(e) {
  if (e.state != null) {
    loadPage(e.state.id, e.state.data, e.state.anchor);
  }
}
function loadPage(pageId, pageData, anchor) {
  if (pageId != null) {
    try {
      history.replaceState({id: pageId, data: pageData, anchor: anchor}, null, "#" + pageId + (anchor ? "#" + anchor : ""));
    } catch (e) {
      location.hash = "#" + pageId + (anchor ? "#" + anchor : ""); // may be an iframe
    }
  }
  pageNow = pageId;
  document.title = "creeper123123321 - " + pageData.title;
  $("html title, #content").attr("lang", pageData.lang);
  $("#content").html(marked(pageData.content));
  goToAnchor(anchor);
}
function goToAnchor(anchor) {
  var anchorElement = document.getElementById(anchor);
  if (anchorElement) anchorElement.scrollIntoView();
}
$(window).on("popstate", popState);
$(window).on("hashchange", updatePage);
updatePage();
});
